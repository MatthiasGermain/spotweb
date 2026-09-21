import "server-only";

/**
 * Convertit une image (PNG/GIF/WebP/JPEG) en JPEG sur fond blanc.
 * `sharp` est chargé à la demande (import dynamique) : s'il est indisponible
 * dans l'environnement, seule la conversion échoue — pas le chargement des
 * pages qui importent les actions concernées.
 */
export async function toJpegOnWhite(input: Buffer): Promise<Buffer> {
  const { default: sharp } = await import("sharp");
  return sharp(input).flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toBuffer();
}
