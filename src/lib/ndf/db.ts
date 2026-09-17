import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws";
import { PrismaClient } from "@/generated/prisma/client";

// Driver WebSocket serverless de Neon (au lieu de connexions TCP persistantes
// via `pg`) — évite la saturation de connexions par intermittence en
// environnement serverless (Vercel), qui se manifestait par des sessions
// silencieusement invalidées sur certaines routes. Uniquement pertinent en
// production (Vercel Postgres = Neon) ; en local (`npx prisma dev`), on
// reste sur le driver `pg` classique, que Neon ne sait pas parler.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  // process.env.VERCEL est défini automatiquement sur tout déploiement
  // Vercel (prod ET preview) — plus fiable qu'un sniff de l'hôte de connexion.
  const onVercel = process.env.VERCEL === "1";
  const adapter = onVercel ? new PrismaNeon({ connectionString }) : new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
