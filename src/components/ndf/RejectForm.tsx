"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

/**
 * Bouton « Renvoyer » (icône) qui ouvre une petite boîte de dialogue pour saisir
 * le motif, avant de soumettre l'action serveur `rejectSubmissionAction`.
 */
export default function RejectForm({
  subId,
  nom,
  action,
}: {
  subId: string;
  nom: string;
  action: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);
  // Empêche l'envoi de plusieurs e-mails identiques si le trésorier clique plusieurs fois
  // en attendant la réponse (la connexion SMTP peut prendre quelques secondes).
  const [sending, setSending] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn-outline btn-sm btn-icon"
        data-tip="Renvoyer au demandeur (à compléter)"
        aria-label="Renvoyer"
        style={{ color: "#92400e", borderColor: "oklch(0.90 0.08 80)" }}
        onClick={() => setOpen(true)}
      >
        <RotateCcw className="size-4" />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={`Renvoyer la note de ${nom}`}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
      onClick={() => setOpen(false)}
    >
      <form
        action={action}
        className="card"
        style={{ width: "100%", maxWidth: "28rem" }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={() => setSending(true)}
      >
        <div className="card-header">
          <div className="card-title">Renvoyer la note de {nom}</div>
        </div>
        <div className="card-body field-group">
          <input type="hidden" name="sub_id" value={subId} />
          <div className="field">
            <label className="field-label">Motif (envoyé par e-mail au demandeur)</label>
            <textarea
              className="input"
              name="comment"
              rows={4}
              required
              autoFocus
              disabled={sending}
              placeholder="Ex. : merci de joindre le ticket de caisse manquant pour la ligne du 12/03."
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Envoi…" : "Renvoyer à compléter"}
            </button>
            <button type="button" className="btn btn-secondary" disabled={sending} onClick={() => setOpen(false)}>
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
