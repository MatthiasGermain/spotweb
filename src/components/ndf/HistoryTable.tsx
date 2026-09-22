"use client";

import { useState } from "react";
import { Download, Pencil, Trash2, Clock, Undo2 } from "lucide-react";
import { formatDateFr, formatMontant } from "@/lib/ndf/format";

export interface HistoryRow {
  id: string;
  createdAt: string;
  nom: string;
  periode: string;
  association: string;
  pjCount: number;
  total: number;
  paiement: string;
  status: string;
  reviewComment: string;
}

type SortKey = "createdAt" | "nom" | "periode" | "association" | "pjCount" | "total" | "paiement" | "status";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "createdAt", label: "Date" },
  { key: "nom", label: "Nom" },
  { key: "periode", label: "Période" },
  { key: "association", label: "Association" },
  { key: "pjCount", label: "PJ" },
  { key: "total", label: "Total", align: "right" },
  { key: "paiement", label: "Paiement" },
  { key: "status", label: "Statut" },
];

export default function HistoryTable({
  rows,
  deleteAction,
}: {
  rows: HistoryRow[];
  deleteAction: (formData: FormData) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1) as 1 | -1);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    let cmp: number;
    if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
    else cmp = String(av).localeCompare(String(bv), "fr", { sensitivity: "base" });
    return cmp * sortDir;
  });

  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                data-col={col.key}
                className={sortKey === col.key ? (sortDir === 1 ? "sort-asc" : "sort-desc") : ""}
                style={col.align === "right" ? { textAlign: "right" } : undefined}
                onClick={() => toggleSort(col.key)}
              >
                {col.label}
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((sub) => {
            const assocCls = sub.association.includes("Connexion") ? "badge-purple" : "badge-pink";
            return (
              <tr key={sub.id}>
                <td className="text-muted-foreground" style={{ fontSize: ".8rem", color: "var(--muted-foreground)" }}>
                  {formatDateFr(sub.createdAt)}
                </td>
                <td>
                  <span className="font-medium">{sub.nom}</span>
                  {sub.status === "a_completer" && sub.reviewComment && (
                    <div className="text-xs mt-0.5" style={{ color: "#991b1b" }}>
                      Motif : {sub.reviewComment}
                    </div>
                  )}
                </td>
                <td>{sub.periode}</td>
                <td>{sub.association ? <span className={`badge ${assocCls}`}>{sub.association}</span> : "—"}</td>
                <td>{sub.pjCount > 0 ? <span className="badge badge-blue">{sub.pjCount} fich.</span> : "—"}</td>
                <td className="font-semibold" style={{ textAlign: "right" }}>
                  {formatMontant(sub.total)}
                </td>
                <td>
                  {sub.paiement === "virement" ? (
                    <span className="badge badge-success">Virement</span>
                  ) : (
                    <span className="badge badge-warning">Chèque</span>
                  )}
                </td>
                <td>
                  {sub.status === "processed" ? (
                    <span className="badge badge-success">✓ Traitée</span>
                  ) : sub.status === "draft" ? (
                    <span className="badge badge-warning">✏ Brouillon</span>
                  ) : sub.status === "a_completer" ? (
                    <span className="badge badge-warning" style={{ color: "#92400e" }}>
                      <Undo2 className="size-3" /> À compléter
                    </span>
                  ) : (
                    <span className="badge badge-secondary">
                      <Clock className="size-3" /> En attente
                    </span>
                  )}
                </td>
                <td>
                  <div className="btn-group" style={{ justifyContent: "flex-end" }}>
                    <a
                      href={`/ndf/api/download/${encodeURIComponent(sub.id)}`}
                      className="btn btn-outline btn-sm btn-icon"
                      data-tip="Télécharger l'archive ZIP"
                      aria-label="Télécharger"
                    >
                      <Download className="size-4" />
                    </a>
                    {(sub.status === "draft" || sub.status === "a_completer") && (
                      <a
                        href={`/ndf?edit=${encodeURIComponent(sub.id)}`}
                        className="btn btn-outline btn-sm btn-icon"
                        data-tip={sub.status === "draft" ? "Modifier ce brouillon" : "Corriger et renvoyer"}
                        aria-label="Modifier"
                      >
                        <Pencil className="size-4" />
                      </a>
                    )}
                    {(sub.status === "draft" || sub.status === "created" || sub.status === "a_completer") && (
                      <form
                        action={deleteAction}
                        style={{ display: "contents" }}
                        onSubmit={(e) => {
                          const msg = sub.status === "draft" ? "Supprimer ce brouillon ?" : "Supprimer cette note ? Action irréversible.";
                          if (!confirm(msg)) e.preventDefault();
                        }}
                      >
                        <input type="hidden" name="id" value={sub.id} />
                        <button
                          type="submit"
                          className="btn btn-outline btn-sm btn-icon"
                          data-tip={sub.status === "draft" ? "Supprimer le brouillon" : "Supprimer"}
                          aria-label="Supprimer"
                          style={{ color: "var(--destructive)", borderColor: "oklch(0.92 0.05 25)" }}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
