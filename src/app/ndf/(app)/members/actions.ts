"use server";

import { redirect } from "next/navigation";
import { requireRole, setUserRole, setUserDisabled, isAdmin } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { deleteBlobs } from "@/lib/ndf/blob";
import type { Role } from "@/generated/prisma/client";

function msgRedirect(type: "ok" | "error", msg: string): never {
  redirect(`/ndf/members?${type}=${encodeURIComponent(msg)}`);
}

const VALID_ROLES: Role[] = ["MEMBER", "TRESORIER", "ADMIN"];

export async function setRoleAction(formData: FormData) {
  const me = await requireRole(["ADMIN"]);
  const target = String(formData.get("username") ?? "").replace(/[^a-zA-Z0-9._-]/g, "");
  const roleRaw = String(formData.get("role") ?? "MEMBER").toUpperCase();

  if (target === me.username) msgRedirect("error", "Vous ne pouvez pas modifier votre propre rôle.");
  if (!VALID_ROLES.includes(roleRaw as Role)) msgRedirect("error", "Rôle invalide.");

  const ok = await setUserRole(target, roleRaw as Role);
  msgRedirect(ok ? "ok" : "error", ok ? `Rôle de « ${target} » mis à jour.` : "Compte introuvable.");
}

export async function toggleDisabledAction(formData: FormData) {
  const me = await requireRole(["ADMIN"]);
  const target = String(formData.get("username") ?? "").replace(/[^a-zA-Z0-9._-]/g, "");
  const disabled = String(formData.get("current_disabled") ?? "0") !== "1";

  if (target === me.username) msgRedirect("error", "Vous ne pouvez pas désactiver votre propre compte.");

  const ok = await setUserDisabled(target, disabled);
  if (!ok) msgRedirect("error", "Opération impossible.");
  msgRedirect("ok", disabled ? `Le compte « ${target} » a été désactivé.` : `Le compte « ${target} » a été réactivé.`);
}

export async function deleteUserAction(formData: FormData) {
  const me = await requireRole(["ADMIN"]);
  const target = String(formData.get("username") ?? "").replace(/[^a-zA-Z0-9._-]/g, "");

  if (target === me.username) msgRedirect("error", "Vous ne pouvez pas supprimer votre propre compte.");

  const targetUser = await prisma.user.findUnique({ where: { username: target } });
  if (!targetUser) msgRedirect("error", "Compte introuvable.");
  if (isAdmin(targetUser)) msgRedirect("error", "Impossible de supprimer un compte administrateur.");

  const submissions = await prisma.submission.findMany({ where: { userId: targetUser.id }, select: { archiveUrl: true } });
  const blobUrls = submissions.map((s) => s.archiveUrl);
  if (targetUser.signatureUrl) blobUrls.push(targetUser.signatureUrl);

  await prisma.user.delete({ where: { id: targetUser.id } }); // cascade supprime les submissions
  if (blobUrls.length > 0) await deleteBlobs(blobUrls);

  msgRedirect("ok", `Le compte « ${target} » a été supprimé.`);
}
