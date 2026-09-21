import { NextResponse } from "next/server";
import { destroySession } from "@/lib/ndf/auth";

// POST uniquement : une route GET de déconnexion est exécutée par le
// pré-chargement (prefetch) de Next.js et détruit la session à chaque page.
export async function POST(request: Request) {
  await destroySession();
  return NextResponse.redirect(new URL("/ndf/login", request.url), 303);
}
