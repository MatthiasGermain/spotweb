import { NextResponse } from "next/server";
import JSZip from "jszip";
import sharp from "sharp";
import { getCurrentUser, getTresorierEmails } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { generateNdfPdf, type NdfLigne } from "@/lib/ndf/pdf";
import { uploadBlob, fetchBlob } from "@/lib/ndf/blob";
import { sendNdfNotification } from "@/lib/ndf/mail";
import { generateSubmissionId } from "@/lib/ndf/id";
import { sniffMime, sanitizeFilename } from "@/lib/ndf/files";

const MAX_UPLOAD_B = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

function redirectHome(request: Request, params: Record<string, string>) {
  const url = new URL("/ndf", request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/ndf/login", request.url), 303);

  const formData = await request.formData();

  const nom = String(formData.get("nom") ?? "").trim();
  const periode = String(formData.get("periode") ?? "").trim();
  const contexte = String(formData.get("contexte") ?? "").trim();
  const paiementRaw = String(formData.get("paiement") ?? "");
  const paiement: "virement" | "cheque" = paiementRaw === "cheque" ? "cheque" : "virement";
  const associationRaw = String(formData.get("association") ?? "");
  const association = ["Eglise Connexion", "Family Connect"].includes(associationRaw)
    ? associationRaw
    : "Eglise Connexion";

  const errors: string[] = [];
  if (nom === "") errors.push("Le nom et prénom est requis.");
  if (periode === "") errors.push("La période est requise.");

  const refs = formData.getAll("ref[]").map(String);
  const dates = formData.getAll("date_dep[]").map(String);
  const descs = formData.getAll("description[]").map(String);
  const montants = formData.getAll("montant[]").map(String);

  const lignes: NdfLigne[] = [];
  let total = 0;
  refs.forEach((ref, i) => {
    const date = (dates[i] ?? "").trim();
    const desc = (descs[i] ?? "").trim();
    const mont = parseFloat((montants[i] ?? "0").replace(",", ".")) || 0;
    if (date === "" && desc === "" && mont === 0) return;
    lignes.push({ ref: parseInt(ref, 10) || 0, date, description: desc, montant: Math.round(mont * 100) / 100 });
    total += mont;
  });
  total = Math.round(total * 100) / 100;

  if (lignes.length === 0) errors.push("Veuillez saisir au moins une ligne de dépense.");

  // ── Pièces jointes ────────────────────────────────────────────────────────
  const pjFiles: { name: string; buffer: Buffer }[] = [];
  for (const entry of formData.getAll("pj[]")) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (entry.size > MAX_UPLOAD_B) {
      errors.push(`Fichier trop volumineux : ${entry.name} (max 10 Mo).`);
      continue;
    }
    const buffer = Buffer.from(await entry.arrayBuffer());
    const mime = sniffMime(buffer);
    if (!mime || !ALLOWED_MIME.includes(mime)) {
      errors.push(`Type de fichier non autorisé : ${entry.name}.`);
      continue;
    }
    pjFiles.push({ name: sanitizeFilename(entry.name), buffer });
  }

  if (errors.length > 0) {
    return redirectHome(request, { error: errors.join(" ") });
  }

  // ── Signature ────────────────────────────────────────────────────────────
  let signatureJpeg: Buffer | null = null;
  const sigData = String(formData.get("signature") ?? "").trim();

  if (sigData.startsWith("data:image/jpeg;base64,")) {
    signatureJpeg = Buffer.from(sigData.slice("data:image/jpeg;base64,".length), "base64");
  } else if (sigData.startsWith("data:image/png;base64,")) {
    const pngBuffer = Buffer.from(sigData.slice("data:image/png;base64,".length), "base64");
    try {
      signatureJpeg = await sharp(pngBuffer).flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toBuffer();
    } catch {
      signatureJpeg = null;
    }
  }

  if (!signatureJpeg && user.signatureUrl) {
    try {
      signatureJpeg = await fetchBlob(user.signatureUrl);
    } catch {
      signatureJpeg = null;
    }
  }

  // ── Génération de l'identifiant + PDF ───────────────────────────────────
  const id = generateSubmissionId();
  const pdfBuffer = await generateNdfPdf(
    id,
    nom,
    periode,
    lignes,
    total,
    contexte,
    paiement,
    association,
    { email: user.email, adresse: user.adresse, iban: user.iban },
    signatureJpeg
  );

  // ── Construction du ZIP ──────────────────────────────────────────────────
  const zip = new JSZip();
  zip.file(`ndf-${id}.pdf`, pdfBuffer);

  const iban = user.iban.trim();
  if (iban !== "") {
    const ibanFormatted = (iban.replace(/\s+/g, "").match(/.{1,4}/g) ?? []).join(" ");
    const prenom = user.prenom.trim();
    const nomProfil = user.nom.trim();
    const now = new Date();
    const lines = [
      `Coordonnées bancaires — ${association}`,
      "─".repeat(40),
      `Bénéficiaire : ${`${prenom} ${nomProfil}`.trim()}`,
    ];
    if (user.email.trim() !== "") lines.push(`Email        : ${user.email.trim()}`);
    if (user.adresse.trim() !== "") lines.push(`Adresse      : ${user.adresse.trim()}`);
    lines.push("", `IBAN         : ${ibanFormatted}`, "", `Généré le ${now.toLocaleDateString("fr-FR")} à ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`);
    zip.file("coordonnees-bancaires.txt", lines.join("\n"));
  }

  const pjNames: string[] = [];
  for (const pj of pjFiles) {
    zip.file(`pj/${pj.name}`, pj.buffer);
    pjNames.push(pj.name);
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  // ── Upload de l'archive ──────────────────────────────────────────────────
  const archiveUrl = await uploadBlob(`ndf/users/${user.id}/archives/${id}.zip`, zipBuffer, "application/zip");

  // ── Enregistrement en base ───────────────────────────────────────────────
  await prisma.submission.create({
    data: {
      id,
      userId: user.id,
      nom,
      periode,
      association,
      contexte,
      paiement,
      total,
      lignes: lignes as unknown as object,
      pjNames: pjNames as unknown as object,
      archiveUrl,
    },
  });

  // ── Notification email ───────────────────────────────────────────────────
  const recipients = new Set<string>();
  if (user.email.trim() !== "") recipients.add(user.email.trim());
  for (const e of await getTresorierEmails()) recipients.add(e);

  const prenomDisplay = user.prenom.trim() !== "" ? user.prenom.trim() : nom;
  try {
    await sendNdfNotification({
      recipients: [...recipients],
      id,
      nom,
      prenomDisplay,
      periode,
      association,
      total,
      paiement,
      lignes,
      zipBuffer,
    });
  } catch (err) {
    console.error("Échec de l'envoi de l'email de notification :", err);
  }

  return redirectHome(request, { success: "1", id });
}
