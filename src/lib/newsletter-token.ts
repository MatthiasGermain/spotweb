import { createHmac, timingSafeEqual } from "node:crypto";

// Token de confirmation d'inscription, signé et auto-porteur : il contient
// l'email + le nom + une expiration, et sa signature HMAC garantit qu'il vient
// bien de nous. Aucune base de données n'est donc nécessaire pour le double opt-in.

const TOKEN_TTL_MS = 48 * 60 * 60 * 1000; // 48 heures

export type NewsletterTokenPayload = {
  email: string;
  firstName: string;
  lastName: string;
  // Timestamp d'expiration (ms depuis epoch).
  exp: number;
};

function getSecret(): string {
  const secret = process.env.NEWSLETTER_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "NEWSLETTER_SECRET manquant ou trop court (32 caractères aléatoires minimum)."
    );
  }
  return secret;
}

const toBase64Url = (input: string) => Buffer.from(input, "utf8").toString("base64url");
const fromBase64Url = (input: string) => Buffer.from(input, "base64url").toString("utf8");

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createNewsletterToken(
  data: Omit<NewsletterTokenPayload, "exp">
): string {
  const payload: NewsletterTokenPayload = { ...data, exp: Date.now() + TOKEN_TTL_MS };
  const body = toBase64Url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export type TokenResult =
  | { valid: true; payload: NewsletterTokenPayload }
  | { valid: false; reason: "invalid" | "expired" };

export function verifyNewsletterToken(token: string): TokenResult {
  const [body, signature] = token.split(".");
  if (!body || !signature) return { valid: false, reason: "invalid" };

  // Comparaison à temps constant pour ne pas fuiter d'information sur la signature.
  const expected = Buffer.from(sign(body));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return { valid: false, reason: "invalid" };
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as NewsletterTokenPayload;
    if (!payload.email || typeof payload.exp !== "number") {
      return { valid: false, reason: "invalid" };
    }
    if (Date.now() > payload.exp) {
      return { valid: false, reason: "expired" };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "invalid" };
  }
}
