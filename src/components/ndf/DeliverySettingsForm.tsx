"use client";

import { useRef, useState } from "react";
import { DEFAULT_NAME_TEMPLATE, EXAMPLE_CONTEXT, NAME_TAGS, renderFilename } from "@/lib/ndf/naming";

const SEPARATORS = [
  { label: "tiret  -", value: "-" },
  { label: "underscore  _", value: "_" },
  { label: "point  .", value: "." },
  { label: "espace", value: " " },
];

export default function DeliverySettingsForm({
  action,
  initialMode,
  initialTemplate,
}: {
  action: (formData: FormData) => void | Promise<void>;
  initialMode: "zip" | "pdf";
  initialTemplate: string;
}) {
  const [mode, setMode] = useState<"zip" | "pdf">(initialMode);
  const [template, setTemplate] = useState(initialTemplate);
  const inputRef = useRef<HTMLInputElement>(null);

  function insert(text: string) {
    const el = inputRef.current;
    const start = el?.selectionStart ?? template.length;
    const end = el?.selectionEnd ?? template.length;
    const next = template.slice(0, start) + text + template.slice(end);
    setTemplate(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + text.length, start + text.length);
    });
  }

  const hasUuid = template.includes("{uuid}");
  const preview = renderFilename(template, EXAMPLE_CONTEXT);

  return (
    <form action={action} className="card-body field-group">
      <div className="field">
        <label className="field-label">Format de réception</label>
        <div className="field-group" style={{ gap: ".5rem" }}>
          <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer" style={{ border: "1px solid var(--border)" }}>
            <input type="radio" name="mode" value="zip" checked={mode === "zip"} onChange={() => setMode("zip")} className="mt-1" />
            <span>
              <span className="text-sm font-medium block">Archive ZIP</span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Un ZIP contenant le PDF de la NDF, un fichier texte avec les coordonnées bancaires et les pièces jointes en fichiers séparés.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer" style={{ border: "1px solid var(--border)" }}>
            <input type="radio" name="mode" value="pdf" checked={mode === "pdf"} onChange={() => setMode("pdf")} className="mt-1" />
            <span>
              <span className="text-sm font-medium block">PDF unique</span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Un seul PDF : la NDF en page 1 (avec l&apos;IBAN du demandeur), puis toutes les pièces justificatives dans les pages suivantes.
              </span>
            </span>
          </label>
        </div>
        <p className="field-description">Ce format s&apos;applique à l&apos;e-mail reçu et au bouton « Télécharger » de l&apos;historique et de la gestion des NDF.</p>
      </div>

      <div className="field">
        <label className="field-label">Nom du fichier</label>
        <input
          ref={inputRef}
          className="input"
          type="text"
          name="template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          maxLength={100}
          spellCheck={false}
          style={{ fontFamily: "ui-monospace, monospace" }}
        />

        <div className="mt-2">
          <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
            Cliquez pour insérer à l&apos;endroit du curseur :
          </p>
          <div className="flex flex-wrap gap-1.5">
            {NAME_TAGS.map((t) => (
              <button key={t.tag} type="button" className="btn btn-secondary btn-sm" onClick={() => insert(`{${t.tag}}`)} title={`Exemple : ${t.example}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 items-center">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Séparateurs :
            </span>
            {SEPARATORS.map((s) => (
              <button key={s.label} type="button" className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--border)" }} onClick={() => insert(s.value)}>
                {s.label}
              </button>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTemplate(DEFAULT_NAME_TEMPLATE)}>
              ↺ Par défaut
            </button>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Aperçu
          </p>
          <p className="text-sm font-medium" style={{ fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>
            {preview}.pdf
          </p>
        </div>
        {!hasUuid && (
          <p className="field-description">
            L&apos;identifiant unique est ajouté automatiquement à la fin (il évite que deux NDF portent le même nom).
          </p>
        )}
      </div>

      <div>
        <button type="submit" className="btn btn-primary">
          💾 Enregistrer
        </button>
      </div>
    </form>
  );
}
