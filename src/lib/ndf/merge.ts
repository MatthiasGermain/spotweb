import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { sniffMime } from "@/lib/ndf/files";
import { normalizeImage } from "@/lib/ndf/image";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 36;

export type MergeAttachment = { name: string; buffer: Buffer };

/**
 * Assemble en un seul PDF : la NDF en page 1, puis chaque pièce jointe
 * (PDF : ses pages telles quelles ; image : une page A4 avec l'image ajustée).
 * Une pièce illisible est remplacée par une page d'information plutôt que de
 * faire échouer toute la génération.
 */
export async function buildMergedPdf(ndfPdf: Buffer, attachments: MergeAttachment[]): Promise<Buffer> {
  const doc = await PDFDocument.load(ndfPdf);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const caption = (page: ReturnType<typeof doc.addPage>, name: string) => {
    const safe = name.replace(/[^\x20-\x7e]/g, "?");
    page.drawText(`Pièce jointe : ${safe}`, {
      x: MARGIN,
      y: PAGE_H - 22,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  };

  const placeholder = (name: string, reason: string) => {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    const safe = name.replace(/[^\x20-\x7e]/g, "?");
    page.drawText("Pièce jointe non intégrable", { x: MARGIN, y: PAGE_H - 80, size: 14, font: bold });
    page.drawText(safe, { x: MARGIN, y: PAGE_H - 104, size: 10, font });
    page.drawText(reason, { x: MARGIN, y: PAGE_H - 124, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
  };

  for (const att of attachments) {
    try {
      const mime = sniffMime(att.buffer);

      if (mime === "application/pdf") {
        const src = await PDFDocument.load(att.buffer);
        const pages = await doc.copyPages(src, src.getPageIndices());
        pages.forEach((p) => doc.addPage(p));
        continue;
      }

      let bytes = att.buffer;
      let kind = mime;
      if (mime !== "image/jpeg" && mime !== "image/png") {
        // GIF / WebP : conversion en JPEG (nécessite sharp).
        const norm = await normalizeImage(att.buffer);
        bytes = norm.buffer;
        kind = norm.contentType;
      }
      if (kind !== "image/jpeg" && kind !== "image/png") throw new Error("format non pris en charge");

      const img = kind === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const page = doc.addPage([PAGE_W, PAGE_H]);
      const maxW = PAGE_W - MARGIN * 2;
      const maxH = PAGE_H - MARGIN * 2 - 14;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1.5);
      const w = img.width * scale;
      const h = img.height * scale;
      page.drawImage(img, { x: (PAGE_W - w) / 2, y: MARGIN + (maxH - h) / 2, width: w, height: h });
      caption(page, att.name);
    } catch (err) {
      console.error(`buildMergedPdf: pièce jointe ignorée (${att.name})`, err);
      placeholder(att.name, "Le fichier est illisible ou protégé. Il reste disponible dans l'archive ZIP.");
    }
  }

  return Buffer.from(await doc.save());
}
