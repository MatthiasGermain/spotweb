"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.CONTACT_FROM_EMAIL ?? "Spotlight <noreply@spotlightcrea.fr>";
const TO = process.env.CONTACT_TO_EMAIL ?? "contact@spotlightcrea.fr";

export type ContactState = {
  ok: boolean;
  error?: string;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const escapeHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function sendContactEmail(data: {
  name: string;
  email: string;
  interest: string;
  message: string;
}): Promise<ContactState> {
  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const interest = data.interest?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  // Validation côté serveur (ne jamais faire confiance au client).
  if (!name || !email || !message) {
    return { ok: false, error: "Merci de remplir tous les champs obligatoires." };
  }
  if (!isEmail(email)) {
    return { ok: false, error: "L'adresse email saisie n'est pas valide." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Votre message est trop long." };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Nouveau message de ${name}${interest ? ` — ${interest}` : ""}`,
      html: `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Intérêt :</strong> ${escapeHtml(interest || "—")}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { ok: false, error: "L'envoi a échoué. Merci de réessayer plus tard." };
    }

    return { ok: true };
  } catch (err) {
    console.error("Contact form error:", err);
    return { ok: false, error: "Une erreur est survenue. Merci de réessayer plus tard." };
  }
}
