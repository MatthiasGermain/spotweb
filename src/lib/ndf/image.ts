import "server-only";
import { sniffMime } from "@/lib/ndf/files";

export type NormalizedImage = { buffer: Buffer; contentType: string };

/**
 * Normalise une image en JPEG sur fond blanc via `sharp` (chargé à la demande).
 * Si `sharp` est indisponible dans l'environnement, les JPEG et PNG sont
 * conservés tels quels (pdf-lib sait intégrer les deux) ; les autres formats
 * (GIF, WebP) sont alors refusés avec un message explicite.
 */
export async function normalizeImage(input: Buffer): Promise<NormalizedImage> {
  try {
    const { default: sharp } = await import("sharp");
    const buffer = await sharp(input).flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toBuffer();
    return { buffer, contentType: "image/jpeg" };
  } catch (err) {
    console.error("normalizeImage: sharp indisponible ou image illisible", err);
    const mime = sniffMime(input);
    if (mime === "image/jpeg" || mime === "image/png") return { buffer: input, contentType: mime };
    throw new Error("Format non pris en charge sur ce serveur : utilisez une image JPG ou PNG.");
  }
}

/** Data URL pour afficher une image stockée (JPEG ou PNG). */
export function toDataUrl(buf: Buffer): string {
  return `data:${sniffMime(buf) ?? "image/jpeg"};base64,${buf.toString("base64")}`;
}

export function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
