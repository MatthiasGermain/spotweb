"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { Plus, X, Paperclip, EraserIcon, RotateCcw, Save, ArrowRight, PenLine } from "lucide-react";
import ShadSelect from "./ShadSelect";
import FlatpickrDateInput from "./FlatpickrDateInput";
import { frMonths, selectYears, combinePeriode } from "@/lib/ndf/periode";

interface Row {
  key: number;
  date: string;
  description: string;
  montant: string;
}

export interface DraftData {
  id: string;
  nom: string;
  month: string;
  year: string;
  association: string;
  contexte: string;
  paiement: "virement" | "cheque";
  lignes: { date: string; description: string; montant: number }[];
  pj: string[];
  /** "draft" (brouillon) ou "a_completer" (renvoyée par le trésorier). */
  status?: string;
  reviewComment?: string;
}

function formatTotal(t: number): string {
  return (
    t
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €"
  );
}

let keySeq = 1;
function mkRow(init?: Partial<Row>): Row {
  return { key: keySeq++, date: init?.date ?? "", description: init?.description ?? "", montant: init?.montant ?? "" };
}

export default function NdfForm({
  prefillNom,
  savedSigDataUrl,
  associations,
  draft,
}: {
  prefillNom: string;
  savedSigDataUrl: string | null;
  associations: { nom: string }[];
  draft: DraftData | null;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    draft && draft.lignes.length > 0
      ? draft.lignes.map((l) => mkRow({ date: l.date, description: l.description, montant: String(l.montant) }))
      : [mkRow(), mkRow(), mkRow()]
  );
  const [keptPj, setKeptPj] = useState<string[]>(draft?.pj ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [month, setMonth] = useState(draft?.month ?? "");
  const [year, setYear] = useState(draft?.year ?? String(new Date().getFullYear()));

  const formRef = useRef<HTMLFormElement>(null);
  const actionTypeRef = useRef<HTMLInputElement>(null);
  const periodeRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isCleared, setIsCleared] = useState(false);

  const hasSavedSig = !!savedSigDataUrl;

  useEffect(() => {
    if (periodeRef.current) periodeRef.current.value = combinePeriode(month, year);
  }, [month, year]);

  function addRow() {
    setRows((prev) => [...prev, mkRow()]);
  }
  function removeRow(key: number) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.key !== key)));
  }
  function updateRow(key: number, field: keyof Omit<Row, "key">, value: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  const total = rows.reduce((sum, r) => sum + (parseFloat(r.montant.replace(",", ".")) || 0), 0);

  // ── Fichiers ────────────────────────────────────────────────────────────
  function addFiles(files: FileList | File[]) {
    const added = Array.from(files); // copie avant tout reset de l'input (FileList "live")
    setNewFiles((prev) => [...prev, ...added]);
  }
  function removeNewFile(idx: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Signature pad ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pad = new SignaturePad(canvas, { backgroundColor: "rgb(255,255,255)", penColor: "#1e293b" });
    padRef.current = pad;

    function drawSavedSig() {
      if (!savedSigDataUrl || !canvas) return;
      const img = new Image();
      img.onload = () => {
        const ctx = canvas!.getContext("2d");
        const w = parseInt(canvas!.style.width) || 640;
        if (!ctx) return;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, 160);
        ctx.drawImage(img, 0, 0, w, 160);
        if (placeholderRef.current) placeholderRef.current.style.display = "none";
      };
      img.src = savedSigDataUrl;
    }

    function resizeCanvas() {
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const w = canvas.parentElement!.getBoundingClientRect().width;
      canvas.width = w * ratio;
      canvas.height = 160 * ratio;
      canvas.style.width = w + "px";
      canvas.style.height = "160px";
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      if (hasSavedSig) drawSavedSig();
    }

    resizeCanvas();
    if (hasSavedSig && sigInputRef.current) sigInputRef.current.value = savedSigDataUrl!;
    window.addEventListener("resize", resizeCanvas);

    pad.addEventListener("endStroke", () => {
      if (sigInputRef.current) sigInputRef.current.value = canvas.toDataURL("image/png");
      if (placeholderRef.current) placeholderRef.current.style.display = "none";
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      pad.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClearOrRestore() {
    const pad = padRef.current;
    const canvas = canvasRef.current;
    if (!pad || !canvas) return;

    if (isCleared) {
      if (hasSavedSig && savedSigDataUrl) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext("2d");
          const w = parseInt(canvas.style.width) || 640;
          if (!ctx) return;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, w, 160);
          ctx.drawImage(img, 0, 0, w, 160);
          if (placeholderRef.current) placeholderRef.current.style.display = "none";
        };
        img.src = savedSigDataUrl;
        if (sigInputRef.current) sigInputRef.current.value = savedSigDataUrl;
      }
      pad.clear();
      setIsCleared(false);
    } else {
      pad.clear();
      if (sigInputRef.current) sigInputRef.current.value = "";
      if (placeholderRef.current) placeholderRef.current.style.display = "";
      if (hasSavedSig) setIsCleared(true);
    }
  }

  function submitAs(type: "draft" | "submit") {
    if (!periodeRef.current?.value.trim()) {
      alert("Veuillez sélectionner un mois et une année.");
      return;
    }
    const assocHidden = formRef.current?.querySelector<HTMLInputElement>('input[name="association"]');
    if (type === "submit" && assocHidden && !assocHidden.value) {
      alert("Veuillez choisir une association.");
      return;
    }
    // Vercel refuse les requêtes de plus de 4,5 Mo (erreur 413, avant même notre code).
    const totalBytes = newFiles.reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > 4 * 1024 * 1024) {
      alert(
        `Les pièces jointes pèsent ${(totalBytes / 1024 / 1024).toFixed(1)} Mo au total : la limite d'envoi est d'environ 4 Mo. ` +
          "Réduisez leur taille ou retirez-en."
      );
      return;
    }
    if (actionTypeRef.current) actionTypeRef.current.value = type;

    // Injecte les fichiers sélectionnés dans le vrai input[type=file] via DataTransfer
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      newFiles.forEach((f) => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }

    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action="/ndf/api/submit" method="POST" encType="multipart/form-data">
      <input type="hidden" name="action_type" ref={actionTypeRef} defaultValue="submit" />
      {draft && <input type="hidden" name="edit_id" value={draft.id} />}

      {/* 1. Informations bénéficiaire */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="card-title">1. Informations sur le bénéficiaire</div>
        </div>
        <div className="card-body field-group">
          <div className="field">
            <label className="field-label">
              Nom et prénom <span className="req">*</span>
            </label>
            <input className="input" type="text" name="nom" defaultValue={prefillNom} required />
          </div>

          <div className="flex flex-col gap-4">
            <div className="field">
              <label className="field-label">
                Période <span className="req">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="field">
                  <label className="field-label text-xs font-normal" style={{ color: "var(--muted-foreground)" }}>
                    Mois
                  </label>
                  <ShadSelect name="periode_month" options={frMonths()} defaultValue={month} placeholder="MM" onValueChange={setMonth} />
                </div>
                <div className="field">
                  <label className="field-label text-xs font-normal" style={{ color: "var(--muted-foreground)" }}>
                    Année
                  </label>
                  <ShadSelect name="periode_year" options={selectYears()} defaultValue={year} placeholder="AAAA" onValueChange={setYear} />
                </div>
              </div>
              <input type="hidden" name="periode" ref={periodeRef} defaultValue={combinePeriode(month, year)} />
            </div>

            <div className="field">
              <label className="field-label">
                Association <span className="req">*</span>
              </label>
              <ShadSelect
                name="association"
                options={associations.map((a) => ({ value: a.nom, label: a.nom }))}
                defaultValue={draft?.association ?? associations[0]?.nom ?? ""}
                placeholder="Choisir…"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dépenses */}
      <div className="card mb-4">
        <div className="card-header flex items-center justify-between gap-3">
          <div className="card-title">2. Détail des dépenses</div>
          <button type="button" className="btn btn-outline btn-sm" onClick={addRow}>
            <Plus className="size-3.5" />
            Ligne
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
                <th className="text-center text-xs font-medium py-2 px-2 w-10" style={{ color: "var(--muted-foreground)" }}>
                  #
                </th>
                <th className="text-left text-xs font-medium py-2 px-2 w-36" style={{ color: "var(--muted-foreground)" }}>
                  Date
                </th>
                <th className="text-left text-xs font-medium py-2 px-2" style={{ color: "var(--muted-foreground)" }}>
                  Description
                </th>
                <th className="text-right text-xs font-medium py-2 px-2 w-28" style={{ color: "var(--muted-foreground)" }}>
                  Montant TTC
                </th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.key} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="expense-td-ref">{i + 1}</td>
                  <td style={{ borderLeft: "1px solid var(--border)", padding: 0 }}>
                    <FlatpickrDateInput name="date_dep[]" defaultValue={row.date} className="expense-input" />
                    <input type="hidden" name="ref[]" value={i + 1} />
                  </td>
                  <td style={{ borderLeft: "1px solid var(--border)", padding: 0 }}>
                    <input
                      type="text"
                      name="description[]"
                      className="expense-input"
                      placeholder="Description de la dépense…"
                      value={row.description}
                      onChange={(e) => updateRow(row.key, "description", e.target.value)}
                    />
                  </td>
                  <td style={{ borderLeft: "1px solid var(--border)", padding: 0 }}>
                    <input
                      type="number"
                      name="montant[]"
                      className="expense-input"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={row.montant}
                      onChange={(e) => updateRow(row.key, "montant", e.target.value)}
                    />
                  </td>
                  <td style={{ borderLeft: "1px solid var(--border)", textAlign: "center", padding: ".25rem" }}>
                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--muted-foreground)", width: "1.75rem", height: "1.75rem", padding: 0 }}
                    >
                      <X className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1px solid var(--border)", background: "var(--muted)" }}>
                <td colSpan={3} className="py-2.5 px-3 text-sm font-semibold text-right">
                  Total à rembourser
                </td>
                <td className="py-2.5 px-3 text-right font-bold" style={{ fontSize: "1rem", letterSpacing: "-.01em" }}>
                  {formatTotal(total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="px-4 py-2.5 text-xs" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
          Joindre les originaux des justificatifs numérotés. Ticket CB seul non accepté.
        </p>
      </div>

      {/* 3. Contexte */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="card-title">3. Contexte et justification</div>
        </div>
        <div className="card-body field-group">
          <div className="field">
            <label className="field-label">Projet ou mission concernée</label>
            <textarea className="input" name="contexte" rows={3} placeholder="ex : Achat matériel pour la réunion de rentrée…" defaultValue={draft?.contexte ?? ""} />
            <p className="field-description">Précisez l&apos;événement ou l&apos;activité liée à ces frais.</p>
          </div>
        </div>
      </div>

      {/* 4. Paiement */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="card-title">4. Modalités de paiement</div>
        </div>
        <div className="card-body field-group">
          <label className="choice-card">
            <input type="radio" name="paiement" value="virement" defaultChecked={(draft?.paiement ?? "virement") === "virement"} />
            <div>
              <div className="text-sm font-medium">Virement bancaire</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                RIB inclus dans l&apos;archive ZIP
              </div>
            </div>
          </label>
          <label className="choice-card">
            <input type="radio" name="paiement" value="cheque" defaultChecked={draft?.paiement === "cheque"} />
            <div className="text-sm font-medium">Chèque</div>
          </label>
        </div>
      </div>

      {/* 5. Pièces jointes */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="card-title">5. Pièces jointes</div>
        </div>
        <div className="card-body field-group">
          {keptPj.length > 0 && (
            <div className="field">
              <div className="field-label">Fichiers enregistrés</div>
              <div className="flex flex-wrap gap-2">
                {keptPj.map((name) => (
                  <span key={name} className="badge badge-blue" style={{ borderRadius: "calc(var(--radius)*.8)", padding: ".25rem .75rem" }}>
                    <Paperclip className="size-3" />
                    {name}
                    <input type="hidden" name="kept_pj[]" value={name} />
                    <button
                      type="button"
                      className="ml-0.5"
                      style={{ opacity: 0.7 }}
                      onClick={() => setKeptPj((prev) => prev.filter((n) => n !== name))}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <p className="field-description">Cliquez sur ✕ pour retirer une pièce jointe.</p>
            </div>
          )}

          <div className="field">
            <div
              className={`drop-zone${dragOver ? " drag-over" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                name="pj[]"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = ""; // permet de re-sélectionner le même fichier
                }}
              />
              <Paperclip className="size-6 mx-auto mb-2" style={{ color: "var(--muted-foreground)" }} />
              <p className="text-sm font-medium">Cliquer ou glisser-déposer</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                JPG, PNG, PDF — 10 Mo max par fichier
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newFiles.map((f, i) => (
                <span key={i} className="badge badge-blue" style={{ borderRadius: "calc(var(--radius)*.8)", padding: ".25rem .75rem", gap: ".375rem" }}>
                  <Paperclip className="size-3" />
                  {f.name} <span style={{ opacity: 0.6, fontSize: ".7rem" }}>({Math.round(f.size / 1024)} ko)</span>
                  <button type="button" style={{ marginLeft: ".125rem", opacity: 0.7 }} onClick={() => removeNewFile(i)}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Signature */}
      <div className="card mb-4">
        <div className="card-header flex items-center justify-between">
          <div className="card-title">6. Signature</div>
          <button type="button" className="btn btn-ghost btn-sm" style={{ color: "var(--muted-foreground)" }} onClick={handleClearOrRestore}>
            {isCleared ? <RotateCcw className="size-4" /> : <EraserIcon className="size-4" />}
            {isCleared ? "Restaurer" : "Effacer"}
          </button>
        </div>
        <div className="card-body">
          <div className="sig-box">
            <canvas ref={canvasRef} />
            <div
              ref={placeholderRef}
              className="absolute inset-0 flex items-center justify-center text-sm"
              style={{ color: "var(--muted-foreground)", pointerEvents: "none" }}
            >
              <div className="text-center">
                <PenLine className="size-5 mx-auto mb-1" style={{ opacity: 0.4 }} />
                Signez ici avec votre souris ou votre doigt
              </div>
            </div>
          </div>
          <input type="hidden" name="signature" ref={sigInputRef} />
          <p className="field-description mt-2">Signature manuscrite numérisée — usage interne uniquement.</p>
        </div>
      </div>

      {/* Boutons */}
      <div className="card mb-6">
        <div className="card-body">
          <p className="field-description mb-4">
            En soumettant, vous certifiez que les dépenses déclarées sont exactes et conformes à l&apos;activité de l&apos;association.
          </p>
          <div className="flex gap-3">
            <button type="button" className="btn btn-secondary flex-1" onClick={() => submitAs("draft")}>
              <Save className="size-4" />
              Enregistrer brouillon
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={() => submitAs("submit")}>
              {draft ? "Soumettre au trésorier" : "Soumettre et générer l'archive"}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
