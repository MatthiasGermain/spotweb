"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/ndf/auth";
import { uploadBlob, deleteBlobs } from "@/lib/ndf/blob";
import { normalizeImage, errMessage } from "@/lib/ndf/image";
import { saveDeliveryConfig } from "@/lib/ndf/settings";
import { DEFAULT_NAME_TEMPLATE } from "@/lib/ndf/naming";
import { createAssociation, updateAssociation, deleteAssociation, getAssociationById } from "@/lib/ndf/associations";

function msgRedirect(msg: string): never {
  redirect(`/ndf/settings?msg=${encodeURIComponent(msg)}`);
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
    const back = assocId ? `edit=${encodeURIComponent(assocId)}` : "new=1";
    let img;
    try {
      img = await normalizeImage(Buffer.from(await logoFile.arrayBuffer()));
    } catch (err) {
      console.error("saveAssociationAction (image):", err);
      redirect(`/ndf/settings?${back}&error=${encodeURIComponent(`Image illisible : ${errMessage(err)}`)}`);
    }
    try {
      const ext = img.contentType === "image/png" ? "png" : "jpg";
      logoUrl = await uploadBlob(`ndf/associations/${assocId || "new"}/logo.${ext}`, img.buffer, img.contentType);
    } catch (err) {
      console.error("saveAssociationAction (stockage):", err);
      redirect(`/ndf/settings?${back}&error=${encodeURIComponent(`Envoi du logo impossible (stockage) : ${errMessage(err)}`)}`);
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

export async function saveDeliveryAction(formData: FormData) {
  await requireRole(["ADMIN", "TRESORIER"]);
  const mode = formData.get("mode") === "pdf" ? "pdf" : "zip";
  const template = String(formData.get("template") ?? "").trim().slice(0, 100) || DEFAULT_NAME_TEMPLATE;
  await saveDeliveryConfig({ mode, nameTemplate: template });
  msgRedirect("✓ Réglages de réception enregistrés.");
}
