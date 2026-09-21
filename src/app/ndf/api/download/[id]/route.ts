import { NextResponse } from "next/server";
import { getCurrentUser, isTresorier } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import JSZip from "jszip";
import { fetchBlob } from "@/lib/ndf/blob";
import { getDeliveryConfig } from "@/lib/ndf/settings";
import { buildMergedPdf } from "@/lib/ndf/merge";

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

  // Propriétaire ou trésorier uniquement : l'admin configure l'app mais ne voit pas les NDF des autres.
  if (submission.userId !== user.id && !isTresorier(user)) {
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

  // Nom de base = nom du PDF de la NDF stocké dans l'archive (modèle du trésorier).
  const zip = await JSZip.loadAsync(zipBuffer);
  const pdfEntry = Object.keys(zip.files).find((n) => !n.includes("/") && n.toLowerCase().endsWith(".pdf"));
  const baseName = pdfEntry ? pdfEntry.replace(/\.pdf$/i, "") : `ndf-${cleanId}`;

  // Format : celui choisi par le trésorier, sauf brouillon ; ?format=zip|pdf permet de forcer.
  const wanted = new URL(request.url).searchParams.get("format");
  const { mode } = await getDeliveryConfig();
  const format = wanted === "zip" || wanted === "pdf" ? wanted : submission.status === "draft" ? "zip" : mode;

  if (format === "pdf" && pdfEntry) {
    try {
      const ndfPdf = await zip.file(pdfEntry)!.async("nodebuffer");
      const names = Array.isArray(submission.pjNames) ? (submission.pjNames as string[]) : [];
      const attachments: { name: string; buffer: Buffer }[] = [];
      for (const name of names) {
        const entry = zip.file(`pj/${name}`);
        if (entry) attachments.push({ name, buffer: await entry.async("nodebuffer") });
      }
      const merged = await buildMergedPdf(ndfPdf, attachments);
      return new NextResponse(new Uint8Array(merged), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${baseName}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    } catch (err) {
      console.error("Fusion PDF impossible, téléchargement du ZIP à la place :", err);
    }
  }

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${baseName}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
