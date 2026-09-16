import { PDFDocument, StandardFonts, PDFFont, PDFPage, rgb } from "pdf-lib";

export interface NdfLigne {
  ref: number;
  date: string;
  description: string;
  montant: number;
}

export interface NdfProfileInfo {
  email?: string | null;
  adresse?: string | null;
  iban?: string | null;
}

const PAGE_W = 595.28;
const PAGE_H = 841.89;

function formatMontantFr(n: number): string {
  const fixed = n.toFixed(2).replace(".", ",");
  const [intPart, decPart] = fixed.split(",");
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSpaces},${decPart}`;
}

/**
 * Petit générateur de PDF page unique, porté de lib/MinimalPDF.php (même
 * système de coordonnées : y mesuré depuis le HAUT de la page, en points).
 */
class PdfWriter {
  private doc!: PDFDocument;
  private page!: PDFPage;
  private fReg!: PDFFont;
  private fBold!: PDFFont;
  private font!: PDFFont;
  private size = 10;
  private color = rgb(0, 0, 0);

  static async create(): Promise<PdfWriter> {
    const w = new PdfWriter();
    w.doc = await PDFDocument.create();
    w.page = w.doc.addPage([PAGE_W, PAGE_H]);
    w.fReg = await w.doc.embedFont(StandardFonts.Helvetica);
    w.fBold = await w.doc.embedFont(StandardFonts.HelveticaBold);
    w.font = w.fReg;
    return w;
  }

  private cy(y: number): number {
    return PAGE_H - y;
  }

  setFont(bold: boolean, size: number): this {
    this.font = bold ? this.fBold : this.fReg;
    this.size = size;
    return this;
  }

  setColor(r: number, g: number, b: number): this {
    this.color = rgb(r, g, b);
    return this;
  }

  tw(t: string): number {
    return this.font.widthOfTextAtSize(t, this.size);
  }

  text(x: number, y: number, t: string): this {
    if (!t) return this;
    this.page.drawText(t, { x, y: this.cy(y), size: this.size, font: this.font, color: this.color });
    return this;
  }

  textClip(x: number, y: number, t: string, maxW: number): this {
    if (this.tw(t) <= maxW) return this.text(x, y, t);
    let clipped = t;
    while (clipped.length > 0 && this.tw(clipped + "..") > maxW) {
      clipped = clipped.slice(0, -1);
    }
    return this.text(x, y, clipped + "..");
  }

  /** Texte multi-lignes avec retour automatique. Retourne le nouveau y. */
  multiText(x: number, y: number, t: string, maxW: number, lh = 14): number {
    let curY = y;
    for (const para of t.split("\n")) {
      if (para.trim() === "") {
        curY += lh * 0.5;
        continue;
      }
      const words = para.split(" ");
      let line = "";
      for (const w of words) {
        const test = line === "" ? w : `${line} ${w}`;
        if (this.tw(test) <= maxW) {
          line = test;
        } else {
          if (line !== "") {
            this.text(x, curY, line);
            curY += lh;
          }
          line = w;
        }
      }
      if (line !== "") {
        this.text(x, curY, line);
        curY += lh;
      }
    }
    return curY;
  }

  hline(x: number, y: number, w: number, lw = 0.5): this {
    this.page.drawLine({ start: { x, y: this.cy(y) }, end: { x: x + w, y: this.cy(y) }, thickness: lw, color: rgb(0, 0, 0) });
    return this;
  }

  vline(x: number, y1: number, y2: number, lw = 0.5): this {
    this.page.drawLine({ start: { x, y: this.cy(y1) }, end: { x, y: this.cy(y2) }, thickness: lw, color: rgb(0, 0, 0) });
    return this;
  }

  rect(x: number, y: number, w: number, h: number, lw = 0.5): this {
    this.page.drawRectangle({ x, y: this.cy(y + h), width: w, height: h, borderWidth: lw, borderColor: rgb(0, 0, 0) });
    return this;
  }

  fillRect(x: number, y: number, w: number, h: number, r = 0.85, g = 0.85, b = 0.85): this {
    this.page.drawRectangle({ x, y: this.cy(y + h), width: w, height: h, color: rgb(r, g, b) });
    return this;
  }

  checkboxEmpty(x: number, y: number, sz = 10): this {
    return this.rect(x, y - sz, sz, sz, 0.6);
  }

  checkboxChecked(x: number, y: number, sz = 10): this {
    this.rect(x, y - sz, sz, sz, 0.6);
    this.page.drawLine({ start: { x: x + 2, y: this.cy(y - 2) }, end: { x: x + sz - 2, y: this.cy(y - sz + 2) }, thickness: 0.6, color: rgb(0, 0, 0) });
    this.page.drawLine({ start: { x: x + 2, y: this.cy(y - sz + 2) }, end: { x: x + sz - 2, y: this.cy(y - 2) }, thickness: 0.6, color: rgb(0, 0, 0) });
    return this;
  }

  async addJpegImage(jpegBytes: Uint8Array, x: number, y: number, w: number, h: number): Promise<this> {
    if (!jpegBytes || jpegBytes.length === 0) return this;
    const img = await this.doc.embedJpg(jpegBytes);
    this.page.drawImage(img, { x, y: this.cy(y + h), width: w, height: h });
    return this;
  }

  async output(): Promise<Buffer> {
    return Buffer.from(await this.doc.save());
  }
}

export async function generateNdfPdf(
  id: string,
  nom: string,
  periode: string,
  lignes: NdfLigne[],
  total: number,
  contexte: string,
  paiement: "virement" | "cheque",
  association: string,
  profile: NdfProfileInfo,
  signatureJpeg: Uint8Array | null
): Promise<Buffer> {
  const pdf = await PdfWriter.create();

  const lm = 40.0;
  const cw = 515.28;
  let y = 45.0;

  // ── En-tête ─────────────────────────────────────────────────────────────
  pdf.setFont(true, 13);
  const title = "NOTE DE FRAIS / JUSTIFICATIF DE DÉPENSES";
  const titleW = pdf.tw(title);
  pdf.text(lm + (cw - titleW) / 2, y, title);
  y += 20;

  pdf.setFont(true, 10);
  pdf.text(lm, y, "Association : " + association);

  pdf.setFont(false, 8);
  const refLine = "Réf : " + id;
  const rm = lm + cw;
  pdf.text(rm - pdf.tw(refLine), y, refLine);
  y += 6;

  pdf.hline(lm, y, cw, 1.2);
  y += 12;

  // ── Section 1 : Infos bénéficiaire ─────────────────────────────────────
  pdf.setFont(true, 10);
  pdf.text(lm, y, "1. INFORMATIONS SUR LE BÉNÉFICIAIRE");
  y += 15;

  pdf.setFont(false, 10);
  pdf.text(lm + 5, y, "Nom et Prénom :");
  pdf.setFont(true, 10);
  pdf.text(lm + 85, y, nom);
  y += 14;

  const email = (profile.email ?? "").trim();
  const adresse = (profile.adresse ?? "").trim();
  if (email !== "") {
    pdf.setFont(false, 10);
    pdf.text(lm + 5, y, "Email :");
    pdf.setFont(true, 10);
    pdf.text(lm + 85, y, email);
    y += 14;
  }
  if (adresse !== "") {
    pdf.setFont(false, 10);
    pdf.text(lm + 5, y, "Adresse :");
    pdf.setFont(false, 9);
    y = pdf.multiText(lm + 85, y, adresse, cw - 90, 13);
    y += 14;
  }

  pdf.setFont(false, 10);
  pdf.text(lm + 5, y, "Période concernée :");
  pdf.setFont(true, 10);
  pdf.text(lm + 105, y, periode);
  y += 10;

  pdf.hline(lm, y, cw, 0.5);
  y += 12;

  // ── Section 2 : Tableau des dépenses ───────────────────────────────────
  pdf.setFont(true, 10);
  pdf.text(lm, y, "2. DÉTAIL DES DÉPENSES");
  y += 13;

  pdf.setFont(false, 7.5);
  pdf.text(
    lm + 5,
    y,
    "Joindre les originaux des justificatifs (factures, tickets de caisse détaillés) numérotés. Ticket CB seul non accepté."
  );
  y += 12;

  const cols = [
    { x: lm, w: 28, label: "Réf", align: "c" as const },
    { x: lm + 28, w: 72, label: "Date", align: "l" as const },
    { x: lm + 100, w: 300, label: "Description", align: "l" as const },
    { x: lm + 400, w: 115.28, label: "Montant TTC", align: "r" as const },
  ];
  const rowH = 18.0;
  const tableX = lm;
  const tableW = cw;
  const tableTop = y;

  pdf.fillRect(tableX, y, tableW, rowH, 0.22, 0.22, 0.22);
  pdf.setFont(true, 8.5).setColor(1, 1, 1);
  for (const col of cols) {
    const lbl = col.label;
    const lx =
      col.align === "r"
        ? col.x + col.w - pdf.tw(lbl) - 4
        : col.align === "c"
          ? col.x + (col.w - pdf.tw(lbl)) / 2
          : col.x + 3;
    pdf.text(lx, y + 13, lbl);
  }
  pdf.setColor(0, 0, 0);
  y += rowH;

  pdf.setFont(false, 9);
  lignes.forEach((ligne, i) => {
    if (i % 2 === 1) {
      pdf.fillRect(tableX, y, tableW, rowH, 0.96, 0.96, 0.96);
    }
    const refStr = String(ligne.ref);
    pdf.text(cols[0].x + (cols[0].w - pdf.tw(refStr)) / 2, y + 12, refStr);
    pdf.text(cols[1].x + 3, y + 12, ligne.date);
    pdf.textClip(cols[2].x + 3, y + 12, ligne.description, cols[2].w - 6);
    const montStr = formatMontantFr(ligne.montant) + " EUR";
    pdf.text(cols[3].x + cols[3].w - pdf.tw(montStr) - 4, y + 12, montStr);
    y += rowH;
  });

  pdf.fillRect(tableX, y, tableW, rowH, 0.92, 0.92, 0.92);
  pdf.setFont(true, 9);
  pdf.text(cols[2].x + 3, y + 12, "TOTAL À REMBOURSER");
  const totalStr = formatMontantFr(total) + " EUR";
  pdf.text(cols[3].x + cols[3].w - pdf.tw(totalStr) - 4, y + 12, totalStr);
  y += rowH;

  const tableBottom = y;
  pdf.rect(tableX, tableTop, tableW, tableBottom - tableTop, 0.7);
  cols.forEach((col, i) => {
    if (i > 0) pdf.vline(col.x, tableTop, tableBottom, 0.4);
  });
  for (let r = 1; r <= lignes.length + 1; r++) {
    pdf.hline(tableX, tableTop + r * rowH, tableW, 0.3);
  }
  y += 14;

  // ── Section 3 : Contexte ───────────────────────────────────────────────
  pdf.setFont(true, 10);
  pdf.text(lm, y, "3. CONTEXTE ET JUSTIFICATION");
  y += 14;

  pdf.setFont(false, 7.5);
  pdf.text(lm + 5, y, "(Précisez le projet, l'événement ou la mission liée à ces frais)");
  y += 12;

  if (contexte.trim() !== "") {
    pdf.setFont(false, 9);
    pdf.multiText(lm + 5, y, contexte, cw - 10, 13);
  } else {
    y += 13;
  }
  pdf.rect(lm, y - 2, cw, 35, 0.5);
  y += 60;

  // ── Section 4 : Modalités de paiement ──────────────────────────────────
  pdf.setFont(true, 10);
  pdf.text(lm, y, "4. MODALITÉS DE PAIEMENT");
  y += 15;

  if (paiement === "virement") pdf.checkboxChecked(lm + 5, y, 10);
  else pdf.checkboxEmpty(lm + 5, y, 10);
  pdf.setFont(false, 9);

  const ibanRaw = (profile.iban ?? "").replace(/\s+/g, "").toUpperCase();
  const ibanDisplay = ibanRaw !== "" ? " — IBAN : " + (ibanRaw.match(/.{1,4}/g) ?? []).join(" ") : " (RIB joint)";
  pdf.text(lm + 20, y, "Virement bancaire" + ibanDisplay);
  y += 16;

  if (paiement === "cheque") pdf.checkboxChecked(lm + 5, y, 10);
  else pdf.checkboxEmpty(lm + 5, y, 10);
  pdf.text(lm + 20, y, "Chèque");
  y += 10;

  pdf.hline(lm, y, cw, 0.5);
  y += 28;

  // ── Section 5 : Signature ──────────────────────────────────────────────
  pdf.setFont(true, 10);
  pdf.text(lm, y, "5. SIGNATURE ET VALIDATION");
  y += 15;

  pdf.setFont(false, 9);
  pdf.text(lm + 5, y, "Date de la demande :");
  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  pdf.text(lm + 105, y, dateStr);
  y += 18;

  pdf.text(lm + 5, y, "Signature du demandeur :");
  const sigY = y;

  if (signatureJpeg && signatureJpeg.length > 0) {
    const imgW = 200.0;
    const imgH = 80.0;
    await pdf.addJpegImage(signatureJpeg, lm + 110, sigY - 10, imgW, imgH);
    y = sigY + imgH + 8;
  } else {
    pdf.hline(lm + 110, sigY + 4, 200, 0.5);
    y = sigY + 30;
  }

  // ── Pied de page ────────────────────────────────────────────────────────
  pdf.setFont(false, 7);
  pdf.hline(lm, 810, cw, 0.3);
  const genStr = now.toLocaleDateString("fr-FR") + " à " + now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  pdf.text(lm, 820, association + " — Note de frais générée le " + genStr);

  return pdf.output();
}
