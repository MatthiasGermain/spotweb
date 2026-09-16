"use client";

import { useState } from "react";
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
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`sortable${sortKey === col.key ? (sortDir === 1 ? " sort-asc" : " sort-desc") : ""}`}
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
            const assocCls = sub.association.includes("Connexion") ? "badge-assoc-ec" : "badge-assoc-fc";
            return (
              <tr key={sub.id}>
                <td style={{ fontSize: ".8rem", color: "#64748b" }}>{formatDateFr(sub.createdAt)}</td>
                <td>
                  <strong>{sub.nom}</strong>
                </td>
                <td className="wrap">{sub.periode}</td>
                <td>
                  {sub.association ? (
                    <span className={`badge ${assocCls}`}>{sub.association}</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{sub.pjCount > 0 ? <span className="badge badge-pj">{sub.pjCount} fich.</span> : "—"}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{formatMontant(sub.total)}</td>
                <td>
                  {sub.paiement === "virement" ? (
                    <span className="badge badge-vir">Virement</span>
                  ) : (
                    <span className="badge badge-chq">Chèque</span>
                  )}
                </td>
                <td>
                  {sub.status === "processed" ? (
                    <span className="badge" style={{ background: "#dcfce7", color: "#166534" }}>
                      ✓ Traitée
                    </span>
                  ) : (
                    <span className="badge" style={{ background: "#f1f5f9", color: "#64748b" }}>
                      En attente
                    </span>
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <a href={`/ndf/api/download/${encodeURIComponent(sub.id)}`} className="btn-dl">
                    ⬇ ZIP
                  </a>
                  {sub.status === "created" && (
                    <form
                      action={deleteAction}
                      style={{ display: "inline" }}
                      onSubmit={(e) => {
                        if (!confirm("Supprimer cette note de frais ? Cette action est irréversible.")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={sub.id} />
                      <button type="submit" className="btn-del" style={{ marginLeft: 6 }}>
                        ✕ Supprimer
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
