import "server-only";
import nodemailer from "nodemailer";
import type { NdfLigne } from "@/lib/ndf/pdf";

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  // VERCEL_URL est l'URL du déploiement (ex. spotweb-abc123.vercel.app, change à chaque déploiement),
  // pas le domaine personnalisé : en production on pointe donc explicitement vers le vrai domaine.
  if (process.env.VERCEL_ENV === "production") return "https://www.spotlightcrea.fr";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function formatMontantFr(n: number): string {
  const fixed = n.toFixed(2).replace(".", ",");
  const [intPart, decPart] = fixed.split(",");
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSpaces},${decPart} €`;
}

interface NotificationInput {
  recipients: string[];
  id: string;
  nom: string;
  prenomDisplay: string;
  periode: string;
  association: string;
  total: number;
  paiement: "virement" | "cheque";
  lignes: NdfLigne[];
  /** Pièce jointe du mail : archive ZIP ou PDF unique selon le réglage du trésorier. */
  attachment: { filename: string; content: Buffer; contentType: string };
}

/** Retire espaces/retours à la ligne parasites et une paire de guillemets englobants (copier-coller depuis un .env). */
function cleanEnv(v: string | undefined): string | undefined {
  if (v === undefined) return undefined;
  let out = v.trim();
  if (out.length >= 2 && (out[0] === '"' || out[0] === "'") && out[out.length - 1] === out[0]) out = out.slice(1, -1);
  return out;
}

function createTransporter(user: string, pass: string, host: string, port: number) {
  return nodemailer.createTransport({
    host,
    port,
    // 465 = TLS direct ; 587 = STARTTLS (secure:false, la connexion est ensuite chiffrée).
    secure: port === 465,
    auth: { user, pass },
  });
}

/** Lit et valide la config SMTP (variables d'env), lève une erreur explicite sinon. */
function getSmtpConfig(): { user: string; pass: string; host: string; port: number } {
  // Tolère une saisie du type "http://ssl0.ovh.net/" ou "ssl0.ovh.net:465" : on ne garde que le nom d'hôte.
  const host = process.env.SMTP_HOST?.trim().replace(/^[a-z]+:\/\//i, "").replace(/[/:].*$/, "");
  const user = cleanEnv(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASS);
  if (!host || !user || !pass) {
    const missing = [!host && "SMTP_HOST", !user && "SMTP_USER", !pass && "SMTP_PASS"].filter(Boolean).join(", ");
    throw new Error(`l'envoi d'e-mails n'est pas configuré sur le serveur (variable(s) manquante(s) : ${missing}).`);
  }
  const port = Number(process.env.SMTP_PORT?.trim() || 465);
  return { user, pass, host, port };
}

export async function sendNdfNotification(input: NotificationInput): Promise<void> {
  const { recipients, id, nom, prenomDisplay, periode, association, total, paiement, lignes, attachment } = input;
  const isPdf = attachment.contentType === "application/pdf";
  const what = isPdf ? "le PDF ci-joint" : "l'archive ci-jointe";
  if (recipients.length === 0) {
    throw new Error("aucun destinataire (renseignez votre e-mail dans votre profil, et vérifiez que le trésorier a un e-mail).");
  }

  const { user, pass, host, port } = getSmtpConfig();
  const transporter = createTransporter(user, pass, host, port);

  const baseUrl = getBaseUrl();
  const dlUrl = `${baseUrl}/ndf/api/download/${encodeURIComponent(id)}`;
  const histUrl = `${baseUrl}/ndf/history`;

  const totalStr = formatMontantFr(total);
  const paiementStr = paiement === "virement" ? "Virement bancaire" : "Chèque";
  const now = new Date();
  const dateStr =
    now.toLocaleDateString("fr-FR") + " à " + now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const lignesHtml = lignes
    .map(
      (l) =>
        `<tr>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #e2e8f0">${escapeHtml(l.date)}</td>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #e2e8f0">${escapeHtml(l.description)}</td>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;text-align:right;white-space:nowrap">${formatMontantFr(l.montant)}</td>` +
        `</tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:600px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1)">
  <div style="background:#1e3a5f;padding:24px 32px">
    <h1 style="margin:0;color:white;font-size:1.1rem;font-weight:600">Notes de frais</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,.7);font-size:.85rem">${escapeHtml(association)}</p>
  </div>
  <div style="padding:28px 32px">
    <p style="margin:0 0 16px;color:#1e293b;font-size:.95rem;line-height:1.6">
      Une nouvelle note de frais pour le compte de <strong>${escapeHtml(prenomDisplay)}</strong> a été créée.
      Les documents et informations nécessaires sont dans ${what}.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <tr style="background:#f8fafc">
        <td style="padding:10px 14px;font-size:.82rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e2e8f0">Bénéficiaire</td>
        <td style="padding:10px 14px;font-size:.92rem;color:#1e293b;border-bottom:1px solid #e2e8f0"><strong>${escapeHtml(nom)}</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:.82rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e2e8f0">Période</td>
        <td style="padding:10px 14px;font-size:.92rem;color:#1e293b;border-bottom:1px solid #e2e8f0">${escapeHtml(periode)}</td>
      </tr>
      <tr style="background:#f8fafc">
        <td style="padding:10px 14px;font-size:.82rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e2e8f0">Association</td>
        <td style="padding:10px 14px;font-size:.92rem;color:#1e293b;border-bottom:1px solid #e2e8f0">${escapeHtml(association)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:.82rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e2e8f0">Total</td>
        <td style="padding:10px 14px;font-size:1.05rem;font-weight:700;color:#1e3a5f;border-bottom:1px solid #e2e8f0">${totalStr}</td>
      </tr>
      <tr style="background:#f8fafc">
        <td style="padding:10px 14px;font-size:.82rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em">Paiement</td>
        <td style="padding:10px 14px;font-size:.92rem;color:#1e293b">${paiementStr}</td>
      </tr>
    </table>
    <h3 style="margin:0 0 10px;font-size:.82rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em">Détail des dépenses</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:.88rem">
      <thead>
        <tr style="background:#1e3a5f;color:white">
          <th style="padding:8px 10px;text-align:left;font-weight:600">Date</th>
          <th style="padding:8px 10px;text-align:left;font-weight:600">Description</th>
          <th style="padding:8px 10px;text-align:right;font-weight:600">Montant</th>
        </tr>
      </thead>
      <tbody>${lignesHtml}</tbody>
    </table>
    <div style="text-align:center;margin-bottom:24px">
      <a href="${dlUrl}" style="display:inline-block;background:#1e3a5f;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:.92rem">
        ⬇ Télécharger ${isPdf ? "le PDF" : "l'archive ZIP"}
      </a>
    </div>
    <p style="text-align:center;margin:0 0 8px">
      <a href="${histUrl}" style="color:#3b82f6;font-size:.85rem">Consulter l'historique en ligne →</a>
    </p>
  </div>
  <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center">
    <p style="margin:0;font-size:.78rem;color:#94a3b8">${escapeHtml(association)} — Généré le ${dateStr}</p>
  </div>
</div>
</body>
</html>`;

  const text =
    `Nouvelle note de frais — ${association}\n\n` +
    `Bénéficiaire : ${nom}\n` +
    `Période      : ${periode}\n` +
    `Total        : ${totalStr}\n` +
    `Paiement     : ${paiementStr}\n\n` +
    `Une nouvelle note de frais pour le compte de ${prenomDisplay} a été créée.\n` +
    `Les documents et informations nécessaires sont dans ${what}.\n\n` +
    `Télécharger ${isPdf ? "le PDF" : "l'archive"} : ${dlUrl}\n` +
    `Consulter l'historique : ${histUrl}\n\n` +
    `— ${association}`;

  await transporter.sendMail({
    from: `"Notes de frais" <${user}>`,
    to: recipients.join(", "),
    subject: `Nouvelle note de frais — ${nom} — ${periode}`,
    text,
    html,
    attachments: [attachment],
  });
}

interface RejectionInput {
  /** Demandeur en premier (To), trésorier(s) en copie (Cc). */
  recipients: string[];
  cc: string[];
  prenomDisplay: string;
  periode: string;
  association: string;
  comment: string;
}

/** E-mail envoyé au demandeur (copie trésorier) quand une NDF est renvoyée « à compléter ». */
export async function sendNdfRejection(input: RejectionInput): Promise<void> {
  const { recipients, cc, prenomDisplay, periode, association, comment } = input;
  if (recipients.length === 0) {
    throw new Error("aucun destinataire (le demandeur n'a pas d'e-mail dans son profil).");
  }

  const { user, pass, host, port } = getSmtpConfig();
  const transporter = createTransporter(user, pass, host, port);

  const baseUrl = getBaseUrl();
  const histUrl = `${baseUrl}/ndf/history`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:600px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1)">
  <div style="background:#92400e;padding:24px 32px">
    <h1 style="margin:0;color:white;font-size:1.1rem;font-weight:600">Note de frais à compléter</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,.7);font-size:.85rem">${escapeHtml(association)}</p>
  </div>
  <div style="padding:28px 32px">
    <p style="margin:0 0 16px;color:#1e293b;font-size:.95rem;line-height:1.6">
      Bonjour ${escapeHtml(prenomDisplay)},<br><br>
      Votre note de frais pour la période <strong>${escapeHtml(periode)}</strong> vous a été renvoyée par le trésorier : elle nécessite une correction avant de pouvoir être traitée.
    </p>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 18px;margin-bottom:24px">
      <p style="margin:0 0 6px;font-size:.78rem;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em">Motif</p>
      <p style="margin:0;font-size:.92rem;color:#1e293b;white-space:pre-wrap">${escapeHtml(comment)}</p>
    </div>
    <p style="margin:0 0 20px;color:#1e293b;font-size:.9rem;line-height:1.6">
      Rendez-vous dans votre historique pour la modifier et la soumettre à nouveau.
    </p>
    <div style="text-align:center;margin-bottom:8px">
      <a href="${histUrl}" style="display:inline-block;background:#1e3a5f;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:.92rem">
        Voir mon historique
      </a>
    </div>
  </div>
  <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center">
    <p style="margin:0;font-size:.78rem;color:#94a3b8">${escapeHtml(association)} — Notes de frais</p>
  </div>
</div>
</body>
</html>`;

  const text =
    `Note de frais à compléter — ${association}\n\n` +
    `Bonjour ${prenomDisplay},\n\n` +
    `Votre note de frais pour la période ${periode} vous a été renvoyée par le trésorier : elle nécessite une correction avant de pouvoir être traitée.\n\n` +
    `Motif : ${comment}\n\n` +
    `Rendez-vous dans votre historique pour la modifier et la soumettre à nouveau : ${histUrl}\n\n` +
    `— ${association}`;

  await transporter.sendMail({
    from: `"Notes de frais" <${user}>`,
    to: recipients.join(", "),
    ...(cc.length > 0 ? { cc: cc.join(", ") } : {}),
    subject: `Note de frais à compléter — ${periode}`,
    text,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
