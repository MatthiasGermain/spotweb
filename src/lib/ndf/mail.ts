import "server-only";
import nodemailer from "nodemailer";
import type { NdfLigne } from "@/lib/ndf/pdf";

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
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
  zipBuffer: Buffer;
}

export async function sendNdfNotification(input: NotificationInput): Promise<void> {
  const { recipients, id, nom, prenomDisplay, periode, association, total, paiement, lignes, zipBuffer } = input;
  if (recipients.length === 0) return;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn("SMTP non configuré (SMTP_HOST/SMTP_USER/SMTP_PASS) — email de notification ignoré.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user, pass },
  });

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
      Les documents et informations nécessaires sont dans l'archive ci-jointe.
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
        ⬇ Télécharger l'archive ZIP
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
    `Les documents et informations nécessaires sont dans l'archive ci-jointe.\n\n` +
    `Télécharger l'archive : ${dlUrl}\n` +
    `Consulter l'historique : ${histUrl}\n\n` +
    `— ${association}`;

  await transporter.sendMail({
    from: `"Notes de frais" <${user}>`,
    to: recipients.join(", "),
    subject: `Nouvelle note de frais — ${nom} — ${periode}`,
    text,
    html,
    attachments: [{ filename: `ndf-${id}.zip`, content: zipBuffer, contentType: "application/zip" }],
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
