"use server";

import { redirect } from "next/navigation";
import sharp from "sharp";
import { requireRole } from "@/lib/ndf/auth";
import { uploadBlob, deleteBlobs } from "@/lib/ndf/blob";
import { createAssociation, updateAssociation, deleteAssociation, getAssociationById } from "@/lib/ndf/associations";

function msgRedirect(msg: string): never {
  redirect(`/ndf/settings?msg=${encodeURIComponent(msg)}`);
}

async function processLogo(file: File): Promise<Buffer> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return sharp(buffer).flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toBuffer();
}

export async function saveAssociationAction(formData: FormData) {
  await requireRole(["ADMIN", "TRESORIER"]);

  const assocId = String(formData.get("assoc_id") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const adresse = String(formData.get("adresse") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (nom === "") {
    redirect(
      `/ndf/settings?${assocId ? `edit=${encodeURIComponent(assocId)}` : "new=1"}&error=${encodeURIComponent(
        "Le nom est requis."
      )}`
    );
  }

  const logoFile = formData.get("logo");
  let logoUrl: string | undefined;
  if (logoFile instanceof File && logoFile.size > 0) {
    if (logoFile.size > 2 * 1024 * 1024) {
      redirect(
        `/ndf/settings?${assocId ? `edit=${encodeURIComponent(assocId)}` : "new=1"}&error=${encodeURIComponent(
          "Logo trop volumineux (max 2 Mo)."
        )}`
      );
    }
    try {
      const jpeg = await processLogo(logoFile);
      const pathId = assocId || "new";
      logoUrl = await uploadBlob(`ndf/associations/${pathId}/logo.jpg`, jpeg, "image/jpeg");
    } catch {
      redirect(
        `/ndf/settings?${assocId ? `edit=${encodeURIComponent(assocId)}` : "new=1"}&error=${encodeURIComponent(
          "Impossible de lire l'image."
        )}`
      );
    }
  }

  if (assocId === "") {
    await createAssociation({ nom, adresse, email, logoUrl });
  } else {
    const existing = await getAssociationById(assocId);
    if (logoUrl && existing?.logoUrl) await deleteBlobs([existing.logoUrl]);
    await updateAssociation(assocId, { nom, adresse, email, logoUrl });
  }

  msgRedirect("✓ Association enregistrée.");
}

export async function deleteLogoAction(formData: FormData) {
  await requireRole(["ADMIN", "TRESORIER"]);
  const assocId = String(formData.get("assoc_id") ?? "").trim();
  const existing = await getAssociationById(assocId);
  if (existing?.logoUrl) {
    await deleteBlobs([existing.logoUrl]);
    await updateAssociation(assocId, { nom: existing.nom, adresse: existing.adresse, email: existing.email, logoUrl: null });
  }
  msgRedirect("✓ Logo supprimé.");
}

export async function deleteAssociationAction(formData: FormData) {
  await requireRole(["ADMIN", "TRESORIER"]);
  const assocId = String(formData.get("assoc_id") ?? "").trim();
  const existing = await getAssociationById(assocId);
  if (existing) {
    if (existing.logoUrl) await deleteBlobs([existing.logoUrl]);
    await deleteAssociation(assocId);
  }
  msgRedirect("✓ Association supprimée.");
}
