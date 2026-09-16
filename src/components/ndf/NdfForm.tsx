"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

interface Row {
  key: number;
  date: string;
  description: string;
  montant: string;
}

function formatTotal(t: number): string {
  return (
    t
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €"
  );
}

let keySeq = 1;
function mkRow(): Row {
  return { key: keySeq++, date: "", description: "", montant: "" };
}

export default function NdfForm({
  prefillNom,
  savedSigDataUrl,
}: {
  prefillNom: string;
  savedSigDataUrl: string | null;
}) {
  const [rows, setRows] = useState<Row[]>(() => [mkRow(), mkRow(), mkRow()]);
  const [fileNames, setFileNames] = useState<{ name: string; size: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const clearedRef = useRef(false);
  const [clearBtnLabel, setClearBtnLabel] = useState("✕ Effacer");

  const hasSavedSig = !!savedSigDataUrl;

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
        const w = parseInt(canvas!.style.width) || 820;
        if (!ctx) return;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, 160);
        ctx.drawImage(img, 0, 0, w, 160);
        placeholderRef.current?.classList.add("hidden");
      };
      img.src = savedSigDataUrl;
    }

    function resizeCanvas() {
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = 160 * ratio;
      canvas.style.width = rect.width + "px";
      canvas.style.height = "160px";
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      if (hasSavedSig) drawSavedSig();
    }

    resizeCanvas();
    if (hasSavedSig && sigInputRef.current) {
      sigInputRef.current.value = savedSigDataUrl!;
    }
    window.addEventListener("resize", resizeCanvas);

    pad.addEventListener("endStroke", () => {
      if (sigInputRef.current) sigInputRef.current.value = canvas.toDataURL("image/png");
      placeholderRef.current?.classList.add("hidden");
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

    if (clearedRef.current) {
      // Restaurer la signature enregistrée
      if (hasSavedSig && savedSigDataUrl) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext("2d");
          const w = parseInt(canvas.style.width) || 820;
          if (!ctx) return;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, w, 160);
          ctx.drawImage(img, 0, 0, w, 160);
          placeholderRef.current?.classList.add("hidden");
        };
        img.src = savedSigDataUrl;
        if (sigInputRef.current) sigInputRef.current.value = savedSigDataUrl;
      }
      pad.clear();
      clearedRef.current = false;
      setClearBtnLabel("✕ Effacer");
    } else {
      pad.clear();
      if (sigInputRef.current) sigInputRef.current.value = "";
      placeholderRef.current?.classList.remove("hidden");
      if (hasSavedSig) {
        clearedRef.current = true;
        setClearBtnLabel("↺ Restaurer ma signature");
      }
    }
  }

  return (
    <form method="POST" action="/ndf/api/submit" encType="multipart/form-data" id="ndf-form">
      {/* Section 1 */}
      <div className="card">
        <div className="section-title">1. Informations sur le bénéficiaire</div>
        <div className="form-row thirds">
          <div>
            <label>
              Nom et Prénom <span className="req">*</span>
            </label>
            <input type="text" name="nom" defaultValue={prefillNom} required />
          </div>
          <div>
            <label>
              Période concernée <span className="req">*</span>
            </label>
            <input type="text" name="periode" placeholder="ex : Août 2026" required />
          </div>
          <div>
            <label>
              Association <span className="req">*</span>
            </label>
            <select name="association">
              <option value="Eglise Connexion">Eglise Connexion</option>
              <option value="Family Connect">Family Connect</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2 : Dépenses */}
      <div className="card">
        <div className="section-title">2. Détail des dépenses</div>
        <table className="expenses-table">
          <thead>
            <tr>
              <th className="center" style={{ width: 42 }}>
                Réf
              </th>
              <th style={{ width: 130 }}>Date</th>
              <th>Description de l&apos;achat / Objet</th>
              <th className="right" style={{ width: 125 }}>
                Montant TTC (€)
              </th>
              <th style={{ width: 42 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.key}>
                <td className="ref-cell">{i + 1}</td>
                <td>
                  <input
                    type="date"
                    name="date_dep[]"
                    value={row.date}
                    onChange={(e) => updateRow(row.key, "date", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="description[]"
                    placeholder="Description…"
                    value={row.description}
                    onChange={(e) => updateRow(row.key, "description", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="montant[]"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={row.montant}
                    onChange={(e) => updateRow(row.key, "montant", e.target.value)}
                  />
                  <input type="hidden" name="ref[]" value={i + 1} />
                </td>
                <td>
                  <button type="button" className="btn-del-row" onClick={() => removeRow(row.key)}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn-add-row" onClick={addRow}>
          ＋ Ajouter une ligne
        </button>
        <div className="total-bar">
          Total à rembourser : <strong>{formatTotal(total)}</strong>
        </div>
      </div>

      {/* Section 3 : Contexte */}
      <div className="card">
        <div className="section-title">3. Contexte et justification</div>
        <div className="form-row full">
          <label>Projet, événement ou mission liée à ces frais</label>
          <textarea name="contexte" placeholder="ex : Achat matériel pour la réunion de rentrée…" />
        </div>
      </div>

      {/* Section 4 : Paiement */}
      <div className="card">
        <div className="section-title">4. Modalités de paiement</div>
        <div className="radio-group">
          <label className="radio-opt">
            <input type="radio" name="paiement" value="virement" defaultChecked />
            <span>Virement bancaire (RIB joint)</span>
          </label>
          <label className="radio-opt">
            <input type="radio" name="paiement" value="cheque" />
            <span>Chèque</span>
          </label>
        </div>
      </div>

      {/* Pièces jointes */}
      <div className="card">
        <div className="section-title">Pièces jointes (facultatif)</div>
        <div className="file-zone">
          <input
            type="file"
            name="pj[]"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
            onChange={(e) => setFileNames([...(e.target.files ?? [])].map((f) => ({ name: f.name, size: f.size })))}
          />
          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>📎</div>
          <p>
            <strong>Cliquez ou glissez vos fichiers ici</strong>
          </p>
          <p>Factures, tickets — JPG, PNG, PDF — 10 Mo max</p>
        </div>
        <div id="file-list">
          {fileNames.map((f, i) => (
            <span className="file-tag" key={i}>
              {f.name} ({(f.size / 1024).toFixed(0)} ko)
            </span>
          ))}
        </div>
      </div>

      {/* Section 5 : Signature */}
      <div className="card">
        <div className="section-title">5. Signature manuscrite numérique</div>
        {hasSavedSig ? (
          <p style={{ fontSize: ".82rem", color: "#64748b", marginBottom: 8 }}>
            Votre signature enregistrée est pré-chargée. Dessinez dans le cadre pour en utiliser une nouvelle, ou{" "}
            <a href="/ndf/profile" style={{ color: "#3b82f6" }}>
              gérez-la dans votre profil
            </a>
            .
          </p>
        ) : (
          <label style={{ marginBottom: 10 }}>Signez dans le cadre ci-dessous (souris ou doigt)</label>
        )}
        <div className="sig-container">
          <canvas ref={canvasRef} id="sig-canvas" width={820} height={160} />
          <div className="sig-placeholder" ref={placeholderRef}>
            ✍ Signez ici
          </div>
        </div>
        <button type="button" className="btn-clear-sig" onClick={handleClearOrRestore}>
          {clearBtnLabel}
        </button>
        <input type="hidden" name="signature" ref={sigInputRef} />
        <p style={{ fontSize: ".75rem", color: "#94a3b8", marginTop: 8 }}>
          Signature manuscrite numérisée — pour usage interne uniquement.
        </p>
      </div>

      {/* Submit */}
      <div className="card">
        <p style={{ fontSize: ".85rem", color: "#64748b", marginBottom: 16 }}>
          En soumettant, vous certifiez que les dépenses déclarées sont exactes et conformes à l&apos;activité de
          l&apos;association.
        </p>
        <button type="submit" className="btn-submit">
          Soumettre et générer l&apos;archive ZIP
        </button>
      </div>

      <style>{`
        .expenses-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .expenses-table th { background: #1e3a5f; color: white; font-size: .75rem; font-weight: 600;
                             padding: 9px 8px; text-align: left; }
        .expenses-table th.right { text-align: right; }
        .expenses-table th.center { text-align: center; }
        .expenses-table td { padding: 5px 5px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .expenses-table tr:nth-child(even) td { background: #f8fafc; }
        .expenses-table input { padding: 7px 8px; font-size: .88rem; }
        .expenses-table input[type=number] { text-align: right; }
        .ref-cell { text-align: center; font-weight: 600; color: #64748b; font-size: .82rem; width: 40px; }
        .btn-del-row { background: none; border: none; cursor: pointer; color: #ef4444; font-size: 1.1rem;
                   padding: 4px 8px; border-radius: 4px; transition: background .15s; }
        .btn-del-row:hover { background: #fee2e2; }
        .btn-add-row { background: none; border: 1.5px dashed #94a3b8; color: #64748b; border-radius: 6px;
                       padding: 7px 14px; font-size: .82rem; cursor: pointer; transition: all .15s;
                       display: inline-flex; align-items: center; gap: 5px; }
        .btn-add-row:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
        .total-bar { display: flex; justify-content: flex-end; align-items: center; gap: 12px;
                     padding: 10px 12px; background: #f8fafc; border-radius: 6px; margin-top: 8px; font-size: .9rem; }
        .total-bar strong { font-size: 1.05rem; color: #1e3a5f; }

        .radio-group { display: flex; gap: 24px; }
        .radio-opt { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .radio-opt input[type=radio] { width: 16px; height: 16px; accent-color: #1e3a5f; }

        .file-zone { border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px;
                     text-align: center; cursor: pointer; transition: all .15s; position: relative; }
        .file-zone:hover { border-color: #3b82f6; background: #eff6ff; }
        .file-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .file-zone p { font-size: .82rem; color: #64748b; }
        #file-list { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
        .file-tag { background: #e0f2fe; color: #0369a1; font-size: .75rem; padding: 3px 10px; border-radius: 20px; }

        .sig-container { position: relative; border: 1.5px solid #d1d5db; border-radius: 8px;
                         background: white; overflow: hidden; }
        #sig-canvas { display: block; cursor: crosshair; touch-action: none; }
        .sig-placeholder { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
                           color: #cbd5e1; font-size: .85rem; pointer-events: none; text-align: center; }
        .sig-placeholder.hidden { display: none; }
        .btn-clear-sig { background: none; border: 1px solid #e2e8f0; border-radius: 5px; padding: 5px 12px;
                         font-size: .78rem; color: #64748b; cursor: pointer; margin-top: 8px;
                         transition: all .15s; }
        .btn-clear-sig:hover { border-color: #ef4444; color: #ef4444; }

        .btn-submit { background: #1e3a5f; color: white; border: none; border-radius: 8px;
                      padding: 13px 32px; font-size: 1rem; font-weight: 600; cursor: pointer;
                      transition: background .15s; width: 100%; }
        .btn-submit:hover { background: #2d5087; }
      `}</style>
    </form>
  );
}
