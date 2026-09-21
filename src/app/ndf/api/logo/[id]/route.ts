import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/ndf/auth";
import { getAssociationById } from "@/lib/ndf/associations";
import { fetchBlob } from "@/lib/ndf/blob";
import { sniffMime } from "@/lib/ndf/files";

// Le store Blob est privé : le logo d'une association est servi via cette
// route (réservée aux utilisateurs connectés) plutôt que par son URL directe.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Non autorisé.", { status: 401 });

  const { id } = await params;
  const assoc = await getAssociationById(id);
  if (!assoc?.logoUrl) return new NextResponse("Introuvable.", { status: 404 });

  try {
    const buf = await fetchBlob(assoc.logoUrl);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": sniffMime(buf) ?? "image/jpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Introuvable.", { status: 404 });
  }
}
