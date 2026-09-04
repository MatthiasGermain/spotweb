"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { SITE_URL } from "@/constants";
import { createNewsletterToken } from "@/lib/newsletter-token";
import { confirmationEmail } from "@/lib/newsletter-emails";

// Double opt-in maison :
//   1. le formulaire déclenche l'envoi d'un email de confirmation (Resend) ;
//   2. le clic sur le lien signé inscrit réellement le contact dans Mailchimp.
// Rien n'est envoyé à Mailchimp tant que l'adresse n'est pas confirmée : la liste
// reste propre et le consentement est prouvé.

const resend = new Resend(process.env.RESEND_API_KEY);

// Repli sur l'expéditeur du formulaire de contact, déjà vérifié dans Resend.
const FROM =
  process.env.NEWSLETTER_FROM_EMAIL ??
  process.env.CONTACT_FROM_EMAIL ??
  "Spotlight <noreply@spotlightcrea.fr>";

const MAILCHIMP_U = process.env.MAILCHIMP_U ?? "8662b47764a2dcf9b2f7389cd";
const MAILCHIMP_ID = process.env.MAILCHIMP_LIST_ID ?? "c961fea884";
const MAILCHIMP_F_ID = process.env.MAILCHIMP_F_ID ?? "00891ae1f0";
const MAILCHIMP_TAGS = process.env.MAILCHIMP_TAGS ?? "2182729";
const MAILCHIMP_DOMAIN = process.env.MAILCHIMP_DOMAIN ?? "spotlightcrea.us8.list-manage.com";

export type NewsletterState = {
  ok: boolean;
  error?: string;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Mailchimp renvoie du HTML dans ses messages (liens « cliquez ici »…) : on nettoie.
const stripHtml = (v: string) =>
  v
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#039;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

/** Étape 1 : validation + envoi de l'email de confirmation. */
export async function subscribeToNewsletter(data: {
  firstName: string;
  lastName: string;
  email: string;
  // Honeypot : rempli = bot.
  botField?: string;
}): Promise<NewsletterState> {
  const firstName = data.firstName?.trim() ?? "";
  const lastName = data.lastName?.trim() ?? "";
  const email = data.email?.trim() ?? "";

  // Bot détecté : on répond « ok » sans rien envoyer.
  if (data.botField) {
    return { ok: true };
  }

  // Validation côté serveur (ne jamais faire confiance au client).
  if (!firstName || !lastName || !email) {
    return { ok: false, error: "Merci de remplir tous les champs." };
  }
  if (!isEmail(email)) {
    return { ok: false, error: "L'adresse email saisie n'est pas valide." };
  }
  if (firstName.length > 100 || lastName.length > 100 || email.length > 200) {
    return { ok: false, error: "Les informations saisies sont trop longues." };
  }

  try {
    const token = createNewsletterToken({ firstName, lastName, email });
    // Origine réelle de la requête, pour que le lien fonctionne aussi en local
    // (SITE_URL pointe vers la production).
    const headerList = await headers();
    const host = headerList.get("host");
    const proto = headerList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
    const origin = host ? `${proto}://${host}` : SITE_URL;
    const confirmUrl = `${origin}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const { subject, html, text } = confirmationEmail({ firstName, confirmUrl });

    const { error } = await resend.emails.send({ from: FROM, to: email, subject, html, text });

    if (error) {
      console.error("Newsletter confirmation email error:", error);
      return { ok: false, error: "L'email de confirmation n'a pas pu être envoyé." };
    }

    return { ok: true };
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return { ok: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}

export type ConfirmResult = "ok" | "already" | "error";

/** Étape 2 : inscription réelle dans Mailchimp, une fois l'adresse confirmée. */
export async function addConfirmedSubscriberToMailchimp(data: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<ConfirmResult> {
  const params = new URLSearchParams({
    u: MAILCHIMP_U,
    id: MAILCHIMP_ID,
    f_id: MAILCHIMP_F_ID,
    EMAIL: data.email,
    FNAME: data.firstName,
    LNAME: data.lastName,
    tags: MAILCHIMP_TAGS,
  });

  try {
    const res = await fetch(`https://${MAILCHIMP_DOMAIN}/subscribe/post-json?${params}&c=cb`, {
      method: "GET",
      cache: "no-store",
    });

    const raw = await res.text();
    // Réponse JSONP : cb({...}) — on extrait le JSON.
    const json = raw.replace(/^[^(]*\(/, "").replace(/\)[;\s]*$/, "");
    const result = JSON.parse(json) as { result: string; msg: string };

    if (result.result === "success") return "ok";

    const msg = stripHtml(result.msg ?? "");
    // Déjà dans la liste : ce n'est pas une erreur pour l'utilisateur.
    if (/already subscribed|d[ée]j[àa] inscrit/i.test(msg)) return "already";

    console.error("Mailchimp subscribe failed:", msg);
    return "error";
  } catch (err) {
    console.error("Mailchimp subscribe error:", err);
    return "error";
  }
}
