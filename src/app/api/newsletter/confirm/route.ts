import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyNewsletterToken } from "@/lib/newsletter-token";
import { welcomeEmail } from "@/lib/newsletter-emails";
import { addConfirmedSubscriberToMailchimp } from "@/app/actions/newsletter";

// Cible du lien envoyé par email : vérifie le token signé, inscrit dans Mailchimp,
// envoie l'email de bienvenue, puis renvoie vers une page de retour à la DA.

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);
// Repli sur l'expéditeur du formulaire de contact, déjà vérifié dans Resend.
const FROM =
  process.env.NEWSLETTER_FROM_EMAIL ??
  process.env.CONTACT_FROM_EMAIL ??
  "Spotlight <noreply@spotlightcrea.fr>";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const redirectTo = (status: string) =>
    NextResponse.redirect(new URL(`/newsletter/confirmation?status=${status}`, request.url));

  if (!token) return redirectTo("invalid");

  const result = verifyNewsletterToken(token);
  if (!result.valid) return redirectTo(result.reason);

  const { firstName, lastName, email } = result.payload;
  const outcome = await addConfirmedSubscriberToMailchimp({ firstName, lastName, email });

  if (outcome === "error") return redirectTo("error");
  // Déjà inscrit : on ne renvoie pas un second email de bienvenue.
  if (outcome === "already") return redirectTo("already");

  try {
    const { subject, html, text } = welcomeEmail({ firstName });
    await resend.emails.send({ from: FROM, to: email, subject, html, text });
  } catch (err) {
    // L'inscription est faite : un échec de l'email de bienvenue ne doit pas
    // transformer une confirmation réussie en erreur pour l'utilisateur.
    console.error("Welcome email error:", err);
  }

  return redirectTo("ok");
}
