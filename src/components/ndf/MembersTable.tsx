"use client";

import { useMemo, useState } from "react";
import { formatMontant } from "@/lib/ndf/format";

export interface MemberRow {
  username: string;
  prenom: string;
  nom: string;
  email: string;
  iban: string;
  hasSig: boolean;
  ndfCount: number;
  ndfTotal: number;
  role: "MEMBER" | "TRESORIER" | "ADMIN";
  disabled: boolean;
}

const ROLE_INFO: Record<MemberRow["role"], { label: string; cls: string }> = {
  ADMIN: { label: "Admin", cls: "badge-admin" },
  TRESORIER: { label: "Trésorier", cls: "badge-tresorier" },
  MEMBER: { label: "Membre", cls: "badge-member" },
};

function ibanFormat(iban: string): string {
  return (iban.replace(/\s+/g, "").match(/.{1,4}/g) ?? []).join(" ");
}

export default function MembersTable({
  members,
  meUsername,
  isAdmin,
  isTresorier,
  setRoleAction,
  toggleDisabledAction,
  deleteUserAction,
}: {
  members: MemberRow[];
  meUsername: string;
  isAdmin: boolean;
  isTresorier: boolean;
  setRoleAction: (formData: FormData) => void;
  toggleDisabledAction: (formData: FormData) => void;
  deleteUserAction: (formData: FormData) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (q === "") return members;
    return members.filter((m) =>
      `${m.username} ${m.prenom} ${m.nom} ${m.email}`.toLowerCase().includes(q)
    );
  }, [members, query]);

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par identifiant, nom, email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Prénom / Nom</th>
              <th>Email</th>
              <th>IBAN</th>
              <th style={{ textAlign: "center" }}>Signature</th>
              <th style={{ textAlign: "center" }}>NDF</th>
              {isTresorier && <th style={{ textAlign: "right" }}>Total NDF</th>}
              <th style={{ textAlign: "center" }}>Rôle</th>
              <th style={{ textAlign: "center" }}>Statut</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const roleInfo = ROLE_INFO[m.role];
              const fullname = `${m.prenom} ${m.nom}`.trim();
              const ibanFormatted = m.iban.trim() !== "" ? ibanFormat(m.iban) : "";
              const isProtected = m.role === "ADMIN" || m.username === meUsername;

              return (
                <tr key={m.username} className={m.disabled ? "row-disabled" : ""}>
                  <td>
                    <span className="user-chip">{m.username}</span>
                  </td>
                  <td>{fullname !== "" ? fullname : <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                  <td>
                    {m.email !== "" ? (
                      <a href={`mailto:${m.email}`} style={{ color: "#3b82f6", textDecoration: "none" }}>
                        {m.email}
                      </a>
                    ) : (
                      <span style={{ color: "#cbd5e1" }}>—</span>
                    )}
                  </td>
                  <td className="iban-cell">
                    {ibanFormatted !== "" ? ibanFormatted : <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {m.hasSig ? <span className="check">✓</span> : <span className="cross">—</span>}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>
                    {m.ndfCount > 0 ? m.ndfCount : <span style={{ color: "#cbd5e1" }}>0</span>}
                  </td>
                  {isTresorier && (
                    <td style={{ textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {m.ndfTotal > 0 ? formatMontant(m.ndfTotal) : <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>
                  )}
                  <td style={{ textAlign: "center" }}>
                    {isAdmin && !isProtected ? (
                      <form
                        action={setRoleAction}
                        onChange={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}
                      >
                        <input type="hidden" name="username" value={m.username} />
                        <select name="role" className="role-select" defaultValue={m.role}>
                          <option value="MEMBER">Membre</option>
                          <option value="TRESORIER">Trésorier</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </form>
                    ) : (
                      <span className={`badge ${roleInfo.cls}`}>{roleInfo.label}</span>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {m.disabled ? (
                      <span className="badge badge-disabled">Désactivé</span>
                    ) : (
                      <span style={{ color: "#22c55e", fontSize: ".82rem", fontWeight: 600 }}>Actif</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      {!isProtected ? (
                        <div className="actions">
                          <form
                            action={toggleDisabledAction}
                            onSubmit={(e) => {
                              if (
                                !m.disabled &&
                                !confirm(`Désactiver le compte « ${m.username} » ? Il ne pourra plus se connecter.`)
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="username" value={m.username} />
                            <input type="hidden" name="current_disabled" value={m.disabled ? "1" : "0"} />
                            {m.disabled ? (
                              <button type="submit" className="btn-enable">
                                ↺ Réactiver
                              </button>
                            ) : (
                              <button type="submit" className="btn-disable">
                                ⏸ Désactiver
                              </button>
                            )}
                          </form>
                          <form
                            action={deleteUserAction}
                            onSubmit={(e) => {
                              if (
                                !confirm(
                                  `Supprimer définitivement le compte « ${m.username} » et toutes ses données ? Cette action est irréversible.`
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="username" value={m.username} />
                            <button type="submit" className="btn-del">
                              ✕ Supprimer
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="protected">protégé</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .search-bar { margin-bottom: 16px; }
        .search-bar input { width: 100%; max-width: 400px; padding: 8px 12px;
                            border: 1px solid #d1d5db; border-radius: 6px;
                            font-size: .88rem; color: #1e293b; }
        .search-bar input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
        .check { color: #22c55e; font-weight: 700; }
        .cross { color: #cbd5e1; }
        .iban-cell { font-family: monospace; font-size: .78rem; color: #475569; letter-spacing: .04em; }
        select.role-select { padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 5px;
                             font-size: .78rem; color: #374151; background: white; cursor: pointer; }
        select.role-select:focus { outline: none; border-color: #3b82f6; }
        .actions { display: flex; gap: 6px; align-items: center; }
        .btn-disable { background: none; border: 1px solid #d1d5db; border-radius: 6px;
                       padding: 4px 9px; font-size: .73rem; font-weight: 600;
                       color: #64748b; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .btn-disable:hover { background: #f1f5f9; border-color: #94a3b8; }
        .btn-enable { background: none; border: 1px solid #86efac; border-radius: 6px;
                      padding: 4px 9px; font-size: .73rem; font-weight: 600;
                      color: #166534; cursor: pointer; transition: all .15s; white-space: nowrap; }
        .btn-enable:hover { background: #dcfce7; border-color: #4ade80; }
        .protected { color: #cbd5e1; font-size: .78rem; }
      `}</style>
    </>
  );
}
