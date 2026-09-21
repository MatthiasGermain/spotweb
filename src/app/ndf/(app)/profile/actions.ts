"use server";

import { redirect } from "next/navigation";
import { requireUser, changePassword } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { uploadBlob, deleteBlobs } from "@/lib/ndf/blob";
import { toJpegOnWhite } from "@/lib/ndf/image";

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();

  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const adresse = String(formData.get("adresse") ?? "").trim();
  const iban = String(formData.get("iban") ?? "")
    .replace(/\s+/g, "")
    .toUpperCase();

  await prisma.user.update({
    where: { id: user.id },
    data: { prenom, nom, email, adresse, iban },
  });

  redirect("/ndf/profile?success=1");
}

export async function changePasswordAction(formData: FormData) {
  const user = await requireUser();
  const oldPwd = String(formData.get("old_pwd") ?? "");
  const newPwd = String(formData.get("new_pwd") ?? "");

  const result = await changePassword(user.id, oldPwd, newPwd);
  if (result === true) {
    redirect("/ndf/profile?pwok=1");
  }
  redirect(`/ndf/profile?pwerror=${encodeURIComponent(result)}`);
}

const ALLOWED_SIG_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function updateSignatureAction(formData: FormData) {
  const user = await requireUser();

  if (formData.get("delete_sig") === "1") {
    if (user.signatureUrl) await deleteBlobs([user.signatureUrl]);
    await prisma.user.update({ where: { id: user.id }, data: { signatureUrl: null } });
    redirect("/ndf/profile?sigok=1");
  }

  const file = formData.get("sig_img");
  if (!(file instanceof File) || file.size === 0) {
    redirect(`/ndf/profile?sigerror=${encodeURIComponent("Aucun fichier reçu.")}`);
  }
  if (file.size > 5 * 1024 * 1024) {
    redirect(`/ndf/profile?sigerror=${encodeURIComponent("Fichier trop volumineux (5 Mo max).")}`);
  }
  if (!ALLOWED_SIG_MIME.includes(file.type)) {
    redirect(`/ndf/profile?sigerror=${encodeURIComponent("Format non supporté (JPG, PNG, GIF, WEBP uniquement).")}`);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const jpeg = await toJpegOnWhite(buffer);

    if (user.signatureUrl) await deleteBlobs([user.signatureUrl]);
    const url = await uploadBlob(`ndf/users/${user.id}/signature.jpg`, jpeg, "image/jpeg");

    await prisma.user.update({ where: { id: user.id }, data: { signatureUrl: url } });
  } catch (err) {
    console.error("updateSignatureAction:", err);
    redirect(`/ndf/profile?sigerror=${encodeURIComponent("Impossible de lire l'image.")}`);
  }

  redirect("/ndf/profile?sigok=1");
}
