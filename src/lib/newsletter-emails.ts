// Templates des emails newsletter, calqués sur la maquette :
// fond blanc, logo Spotlight en tête, texte noir, signature en bas.
//
// Contraintes email : pas de <link> ni de webfonts (Avenir/Montserrat ne sont pas
// chargeables dans la plupart des clients mail) et pas de SVG (Gmail le supprime).
// Tout est en styles inline, avec le logo en PNG et en URL absolue.

import { SITE_NAME, SITE_URL } from "@/constants";

const INK = "#1E1E24"; // Foreground par défaut de la charte
const RAISIN = "#1e2952";
const SUNGLOW = "#FCCA46";
const FONT = "Helvetica, Arial, sans-serif";

const LOGO_URL = `${SITE_URL}/images/logo_noir_sans_fond.png`;

// Signataire des emails automatiques.
const SIGNATORY = "Faneva";

const escapeHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Enveloppe commune : fond blanc, logo, contenu, signature.
function layout(content: string): string {
  return `
<body style="margin:0;padding:0;background-color:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${FONT};color:${INK};">
          <tr>
            <td style="padding-bottom:32px;">
              <img src="${LOGO_URL}" alt="${SITE_NAME}" width="180" style="display:block;width:180px;max-width:180px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td>
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding-top:40px;font-size:16px;line-height:1.6;color:${INK};">
              <strong>${SIGNATORY},</strong> pour l'équipe ${SITE_NAME}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`.trim();
}

// Interlignes serrés comme sur la maquette : les lignes se suivent en un bloc.
const line = (text: string) =>
  `<p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:${INK};">${text}</p>`;

export function confirmationEmail({
  firstName,
  confirmUrl,
}: {
  firstName: string;
  confirmUrl: string;
}) {
  const name = escapeHtml(firstName);

  const html = layout(`
    ${line(`Salut ${name},`)}
    ${line(`Merci de t'être inscrit(e) à la newsletter de ${SITE_NAME} ! Il reste juste une petite étape : confirme ton adresse en cliquant sur le bouton ci-dessous, et c'est parti 🙌`)}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background-color:${SUNGLOW};border-radius:999px;">
          <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;font-family:${FONT};font-size:16px;font-weight:600;color:${RAISIN};text-decoration:none;">
            Je confirme mon inscription
          </a>
        </td>
      </tr>
    </table>
    ${line(`Ce lien est valable 48 heures. Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :`)}
    ${line(`<a href="${confirmUrl}" style="color:${INK};word-break:break-all;">${confirmUrl}</a>`)}
    <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:${INK};opacity:0.7;">
      Tu n'es à l'origine de cette inscription ? Ignore simplement cet email, rien ne sera enregistré.
    </p>
    <p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:${INK};">À très vite,</p>
  `);

  const text = `Salut ${firstName},

Merci de t'être inscrit(e) à la newsletter de ${SITE_NAME} ! Il reste juste une petite étape : confirme ton adresse en ouvrant ce lien (valable 48 heures) :

${confirmUrl}

Tu n'es à l'origine de cette inscription ? Ignore simplement cet email, rien ne sera enregistré.

À très vite,
${SIGNATORY}, pour l'équipe ${SITE_NAME}`;

  return { subject: `Confirme ton inscription à la newsletter ${SITE_NAME}`, html, text };
}

export function welcomeEmail({ firstName }: { firstName: string }) {
  const name = escapeHtml(firstName);

  const html = layout(`
    ${line(`Salut ${name},`)}
    ${line(`Bienvenue dans la newsletter de ${SITE_NAME} ! On est trop contents de t'avoir avec nous 🙌`)}
    ${line(`Ici, on te partage nos coulisses, nos derniers projets, quelques conseils com', et toute l'actu de l'équipe, histoire de te mettre un peu de lumière dans ta boîte mail de temps en temps.`)}
    ${line(`Et si jamais t'as une question, une envie de collab, ou juste envie de dire bonjour, notre boîte mail est grande ouverte 💌`)}
    ${line(`À très vite,`)}
  `);

  const text = `Salut ${firstName},

Bienvenue dans la newsletter de ${SITE_NAME} ! On est trop contents de t'avoir avec nous 🙌

Ici, on te partage nos coulisses, nos derniers projets, quelques conseils com', et toute l'actu de l'équipe, histoire de te mettre un peu de lumière dans ta boîte mail de temps en temps.

Et si jamais t'as une question, une envie de collab, ou juste envie de dire bonjour, notre boîte mail est grande ouverte 💌

À très vite,
${SIGNATORY}, pour l'équipe ${SITE_NAME}`;

  return { subject: `Bienvenue dans la newsletter ${SITE_NAME} !`, html, text };
}
