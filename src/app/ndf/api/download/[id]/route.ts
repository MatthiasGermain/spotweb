import { NextResponse } from "next/server";
import { getCurrentUser, isPrivileged } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { fetchBlob } from "@/lib/ndf/blob";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/ndf/login", request.url), 303);

  const { id } = await params;
  const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, "");

  const submission = await prisma.submission.findUnique({ where: { id: cleanId } });
  if (!submission) {
    return new NextResponse("Archive introuvable ou accès refusé.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (submission.userId !== user.id && !isPrivileged(user)) {
    return new NextResponse("Accès refusé.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  let zipBuffer: Buffer;
  try {
    zipBuffer = await fetchBlob(submission.archiveUrl);
  } catch {
    return new NextResponse("Archive introuvable ou accès refusé.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="ndf-${cleanId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
