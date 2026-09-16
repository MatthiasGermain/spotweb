import "server-only";
import { put, del } from "@vercel/blob";

export async function uploadBlob(
  pathname: string,
  data: Buffer | string,
  contentType?: string
): Promise<string> {
  const blob = await put(pathname, data, {
    access: "public",
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

/** Télécharge le contenu d'un blob côté serveur (pour le proxifier via une route protégée). */
export async function fetchBlob(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Impossible de récupérer le fichier (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}
