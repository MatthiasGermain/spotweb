import "server-only";
import { prisma } from "@/lib/ndf/db";
import type { Association } from "@/generated/prisma/client";

function slugify(nom: string): string {
  return (
    nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "asso"
  );
}

export async function ensureDefaultAssociations(): Promise<void> {
  const count = await prisma.association.count();
  if (count > 0) return;
  await prisma.association.createMany({
    data: [
      { slug: "eglise-connexion", nom: "Eglise Connexion" },
      { slug: "family-connect", nom: "Family Connect" },
    ],
  });
}

export async function getAssociations(): Promise<Association[]> {
  return prisma.association.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getAssociationByNom(nom: string): Promise<Association | null> {
  return prisma.association.findFirst({ where: { nom } });
}

export async function getAssociationById(id: string): Promise<Association | null> {
  return prisma.association.findUnique({ where: { id } });
}

export async function createAssociation(data: {
  nom: string;
  adresse: string;
  email: string;
  logoUrl?: string | null;
}): Promise<Association> {
  const base = slugify(data.nom);
  let slug = base;
  let i = 1;
  while (await prisma.association.findUnique({ where: { slug } })) {
    slug = `${base}-${++i}`;
  }
  return prisma.association.create({
    data: { slug, nom: data.nom, adresse: data.adresse, email: data.email, logoUrl: data.logoUrl ?? null },
  });
}

export async function updateAssociation(
  id: string,
  data: { nom: string; adresse: string; email: string; logoUrl?: string | null }
): Promise<Association> {
  return prisma.association.update({
    where: { id },
    data: {
      nom: data.nom,
      adresse: data.adresse,
      email: data.email,
      ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
    },
  });
}

export async function deleteAssociation(id: string): Promise<void> {
  await prisma.association.delete({ where: { id } });
}
