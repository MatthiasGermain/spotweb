import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/ndf/db";
import type { User, Role } from "@/generated/prisma/client";

const COOKIE_NAME = "ndf_session";
const SESSION_DURATION_S = 60 * 60 * 24 * 30; // 30 jours

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET n'est pas défini.");
  return new TextEncoder().encode(secret);
}

// ── Session ───────────────────────────────────────────────────────────────

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_S}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "lax" (pas "strict") : Safari/WebKit a un historique de bugs avec les
    // cookies Strict posés sur une réponse de redirection (exactement notre
    // cas ici). Lax reste protecteur contre le CSRF pour un cookie de session.
    sameSite: "lax",
    path: "/ndf",
    maxAge: SESSION_DURATION_S,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/ndf" });
}

async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.uid === "string" ? payload.uid : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const uid = await getSessionUserId();
  if (!uid) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user || user.disabled) return null;
    return user;
  } catch (err) {
    console.error("getCurrentUser: échec de la lecture en base", err);
    return null;
  }
}

/** À appeler en haut d'une Server Component protégée : redirige vers /login sinon. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/ndf/login");
  return user;
}

/** Redirige vers /ndf si l'utilisateur n'a pas le rôle requis. */
export async function requireRole(roles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/ndf");
  return user;
}

// ── Rôles ─────────────────────────────────────────────────────────────────

export function isAdmin(user: Pick<User, "role">) {
  return user.role === "ADMIN";
}
export function isTresorier(user: Pick<User, "role">) {
  return user.role === "TRESORIER";
}
export function isPrivileged(user: Pick<User, "role">) {
  return isAdmin(user) || isTresorier(user);
}

export async function setUserRole(username: string, role: Role): Promise<boolean> {
  try {
    await prisma.user.update({ where: { username }, data: { role } });
    return true;
  } catch {
    return false;
  }
}

export async function setUserDisabled(username: string, disabled: boolean): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || isAdmin(user)) return false; // protège uniquement les admins
  await prisma.user.update({ where: { username }, data: { disabled } });
  return true;
}

export async function getTresorierEmails(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { role: "TRESORIER" },
    select: { email: true },
  });
  return users.map((u) => u.email.trim()).filter((e) => e !== "");
}

// ── Mots de passe ─────────────────────────────────────────────────────────

export async function hashPassword(pwd: string): Promise<string> {
  return bcrypt.hash(pwd, 10);
}

export async function verifyPassword(pwd: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pwd, hash);
}

export async function changePassword(
  userId: string,
  oldPwd: string,
  newPwd: string
): Promise<true | string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return "Utilisateur introuvable.";
  if (!(await verifyPassword(oldPwd, user.password))) return "Ancien mot de passe incorrect.";
  if (newPwd.length < 6) return "Le nouveau mot de passe doit faire au moins 6 caractères.";
  await prisma.user.update({
    where: { id: userId },
    data: { password: await hashPassword(newPwd) },
  });
  return true;
}

// ── Authentification ────────────────────────────────────────────────────

// Rôles par défaut pour les comptes historiques (parité avec DEFAULT_ROLES en PHP).
const DEFAULT_ROLES: Record<string, Role> = {
  thomas: "ADMIN",
  "alexandre.nisse": "TRESORIER",
};

export async function registerUser(
  username: string,
  password: string
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const clean = username.trim();
  if (!/^[a-zA-Z0-9._-]{3,30}$/.test(clean)) {
    return { ok: false, error: "Identifiant invalide (3-30 caractères alphanumériques)." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Le mot de passe doit faire au moins 6 caractères." };
  }
  const existing = await prisma.user.findUnique({ where: { username: clean } });
  if (existing) {
    return { ok: false, error: "Cet identifiant est déjà utilisé." };
  }
  const role = DEFAULT_ROLES[clean.toLowerCase()] ?? "MEMBER";
  const user = await prisma.user.create({
    data: { username: clean, password: await hashPassword(password), role },
  });
  await createSession(user.id);
  return { ok: true, userId: user.id };
}

export async function loginUser(
  username: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: "disabled" | "bad_credentials" }> {
  const user = await prisma.user.findUnique({ where: { username: username.trim() } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return { ok: false, error: "bad_credentials" };
  }
  if (user.disabled) {
    return { ok: false, error: "disabled" };
  }
  await createSession(user.id);
  return { ok: true };
}
