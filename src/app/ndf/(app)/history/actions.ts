"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { deleteBlobs } from "@/lib/ndf/blob";

export async function deleteSubmissionAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "").replace(/[^a-zA-Z0-9_-]/g, "");

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (submission && submission.userId === user.id && submission.status === "created") {
    await prisma.submission.delete({ where: { id } });
    await deleteBlobs([submission.archiveUrl]);
  }

  redirect("/ndf/history?deleted=1");
}
