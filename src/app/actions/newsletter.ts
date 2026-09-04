"use server";

// Inscription newsletter via l'endpoint "post-json" de Mailchimp.
// On évite l'embed officiel (CSS + jQuery + mc-validate.js) pour ne pas casser la DA :
// le formulaire reste 100% maison, seule la soumission part chez Mailchimp.
const MAILCHIMP_U = process.env.MAILCHIMP_U ?? "8662b47764a2dcf9b2f7389cd";
const MAILCHIMP_ID = process.env.MAILCHIMP_LIST_ID ?? "c961fea884";
const MAILCHIMP_F_ID = process.env.MAILCHIMP_F_ID ?? "00891ae1f0";
const MAILCHIMP_TAGS = process.env.MAILCHIMP_TAGS ?? "2182729";
const MAILCHIMP_DOMAIN = process.env.MAILCHIMP_DOMAIN ?? "spotlightcrea.us8.list-manage.com";

export type NewsletterState = {
  ok: boolean;
  error?: string;
  // true si l'audience est en double opt-in : Mailchimp a envoyé un mail de
  // confirmation et le contact reste « Pending » tant qu'il n'a pas cliqué.
  // false en simple opt-in : aucun mail n'est envoyé, l'inscription est immédiate.
  pending?: boolean;
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

export async function subscribeToNewsletter(data: {
  firstName: string;
  lastName: string;
  email: string;
  // Honeypot Mailchimp : rempli = bot.
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

  const params = new URLSearchParams({
    u: MAILCHIMP_U,
    id: MAILCHIMP_ID,
    f_id: MAILCHIMP_F_ID,
    EMAIL: email,
    FNAME: firstName,
    LNAME: lastName,
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

    if (result.result === "success") {
      // Mailchimp annonce l'envoi d'un mail de confirmation uniquement en double opt-in
      // (« Almost finished... we need to confirm your email address » / « Presque fini... »).
      const successMsg = stripHtml(result.msg ?? "");
      const pending = /confirm|presque|almost/i.test(successMsg);
      return { ok: true, pending };
    }

    const msg = stripHtml(result.msg ?? "");
    // Déjà inscrit : on n'affiche pas le pavé Mailchimp par défaut.
    if (/already subscribed|d[ée]j[àa] inscrit/i.test(msg)) {
      return { ok: false, error: "Cette adresse est déjà inscrite à la newsletter." };
    }
    return { ok: false, error: msg || "L'inscription n'a pas pu aboutir." };
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return { ok: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}
