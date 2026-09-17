import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/ndf/db";

export async function GET() {
  const store = await cookies();
  const all = store.getAll().filter((c) => c.name === "ndf_session");

  const result: Record<string, unknown> = {
    vercelEnv: process.env.VERCEL_ENV ?? null,
    onVercel: process.env.VERCEL === "1",
    cookieCount: all.length,
    cookieLengths: all.map((c) => c.value.length),
  };

  const token = all[0]?.value;
  if (!token) {
    result.status = "no_cookie";
    return NextResponse.json(result);
  }

  const secret = process.env.SESSION_SECRET;
  result.secretDefined = !!secret;
  result.secretLength = secret?.length ?? 0;

  if (!secret) {
    result.status = "no_secret";
    return NextResponse.json(result);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    result.jwtOk = true;
    result.uid = payload.uid ?? null;
    result.exp = payload.exp ?? null;
    result.nowUnix = Math.floor(Date.now() / 1000);

    try {
      const user = await prisma.user.findUnique({ where: { id: String(payload.uid) } });
      result.dbOk = true;
      result.userFound = !!user;
      result.userDisabled = user?.disabled ?? null;
      result.username = user?.username ?? null;
    } catch (dbErr) {
      result.dbOk = false;
      result.dbError = dbErr instanceof Error ? dbErr.message : String(dbErr);
    }
  } catch (jwtErr) {
    result.jwtOk = false;
    result.jwtError = jwtErr instanceof Error ? jwtErr.message : String(jwtErr);
  }

  return NextResponse.json(result);
}
