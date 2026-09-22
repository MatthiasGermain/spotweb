"use server";

import { redirect } from "next/navigation";
import { requireRole, getTresorierEmails } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { sendNdfRejection } from "@/lib/ndf/mail";

export async function toggleStatusAction(formData: FormData) {
  await requireRole(["TRESORIER"]);

  const subId = String(formData.get("sub_id") ?? "").replace(/[^a-zA-Z0-9_-]/g, "");
  const currentStatus = String(formData.get("current_status") ?? "created");
  const newStatus = currentStatus === "processed" ? "created" : "processed";

  await prisma.submission.update({ where: { id: subId }, data: { status: newStatus } }).catch(() => null);

  redirect("/ndf/admin");
}

export async function rejectSubmissionAction(formData: FormData) {
  await requireRole(["TRESORIER"]);

  const subId = String(formData.get("sub_id") ?? "").replace(/[^a-zA-Z0-9_-]/g, "");
  const comment = String(formData.get("comment") ?? "").trim();
  if (comment === "") {
    redirect(`/ndf/admin?error=${encodeURIComponent("Merci d'indiquer un motif avant de renvoyer la note.")}`);
  }

  const submission = await prisma.submission.findUnique({ where: { id: subId }, include: { user: true } });
  if (!submission) redirect("/ndf/admin");

  // Mise à jour conditionnée au statut actuel ("created") : si la note a déjà été renvoyée
  // (double clic, second onglet, nouvelle tentative après une réponse SMTP lente…), `count`
  // vaut 0 et on ne renvoie pas de second e-mail — c'est ce qui provoquait les envois en double.
  const { count } = await prisma.submission.updateMany({
    where: { id: subId, status: "created" },
    data: { status: "a_completer", reviewComment: comment },
  });
  if (count === 0) redirect("/ndf/admin?rejected=1");

  const { user } = submission;
  const prenomDisplay = user.prenom.trim() !== "" ? user.prenom.trim() : submission.nom;
  const recipients = user.email.trim() !== "" ? [user.email.trim()] : [];
  const cc = (await getTresorierEmails()).filter((e) => e !== user.email.trim());

  let mailErr = "";
  try {
    await sendNdfRejection({
      recipients,
      cc,
      prenomDisplay,
      periode: submission.periode,
      association: submission.association,
      comment,
    });
  } catch (err) {
    console.error("Échec de l'envoi de l'e-mail de refus :", err);
    mailErr = err instanceof Error ? err.message : String(err);
  }

  redirect(`/ndf/admin${mailErr ? `?mailerr=${encodeURIComponent(mailErr)}` : "?rejected=1"}`);
}
