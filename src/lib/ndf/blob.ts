import "server-only";
import { put, del, get } from "@vercel/blob";

export async function uploadBlob(
  pathname: string,
  data: Buffer | string,
  contentType?: string
): Promise<string> {
  const blob = await put(pathname, data, {
    // Le store Vercel Blob du projet est en accès privé : les fichiers ne sont
    // lisibles que côté serveur (get + token), jamais par URL directe.
    access: "private",
    contentType,
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteBlobs(urls: string[]): Promise<void> {
  const clean = urls.filter(Boolean);
  if (clean.length === 0) return;
  await del(clean);
}

/** Télécharge le contenu d'un blob privé côté serveur (pour le proxifier via une route protégée). */
export async function fetchBlob(url: string): Promise<Buffer> {
  const result = await get(url, { access: "private" });
  if (!result || result.statusCode !== 200) throw new Error("Impossible de récupérer le fichier.");
  return Buffer.from(await new Response(result.stream).arrayBuffer());
}
