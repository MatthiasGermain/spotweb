"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";

export async function toggleStatusAction(formData: FormData) {
  await requireRole(["TRESORIER"]);

  const subId = String(formData.get("sub_id") ?? "").replace(/[^a-zA-Z0-9_-]/g, "");
  const currentStatus = String(formData.get("current_status") ?? "created");
  const newStatus = currentStatus === "processed" ? "created" : "processed";

  await prisma.submission.update({ where: { id: subId }, data: { status: newStatus } }).catch(() => null);

  redirect("/ndf/admin");
}
