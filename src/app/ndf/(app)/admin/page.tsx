import { requireRole } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { formatDateFr, formatMontant } from "@/lib/ndf/format";
import AdminFilters from "@/components/ndf/AdminFilters";
import { toggleStatusAction } from "./actions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ u?: string; status?: string; assoc?: string }>;
}) {
  await requireRole(["TRESORIER"]);
  const sp = await searchParams;

  const filterUser = sp.u ?? "";
  const filterStatus = sp.status ?? "";
  const filterAssoc = sp.assoc ?? "";

  const users = await prisma.user.findMany({ select: { username: true } });

  const submissions = await prisma.submission.findMany({
    where: {
      ...(filterUser ? { user: { username: filterUser } } : {}),
      ...(filterStatus ? { status: filterStatus } : {}),
      ...(filterAssoc ? { association: filterAssoc } : {}),
    },
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalAll = submissions.reduce((s, sub) => s + Number(sub.total), 0);
  const totalPending = submissions
    .filter((s) => s.status !== "processed")
    .reduce((s, sub) => s + Number(sub.total), 0);
  const totalProcessed = submissions
    .filter((s) => s.status === "processed")
    .reduce((s, sub) => s + Number(sub.total), 0);

  return (
    <div className="container-wide">
      <div className="stats">
        <div className="stat-card">
          <div className="stat-label">Total (filtre actif)</div>
          <div className="stat-value">{formatMontant(totalAll)}</div>
          <div className="stat-sub">{submissions.length} note(s)</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">En attente</div>
          <div className="stat-value">{formatMontant(totalPending)}</div>
          <div className="stat-sub" style={{ color: "#f59e0b" }}>
            à traiter
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Traitées</div>
          <div className="stat-value">{formatMontant(totalProcessed)}</div>
          <div className="stat-sub" style={{ color: "#22c55e" }}>
            remboursées
          </div>
        </div>
      </div>

      <div className="card">
        <AdminFilters
          usernames={users.map((u) => u.username)}
          filterUser={filterUser}
          filterStatus={filterStatus}
          filterAssoc={filterAssoc}
        />

        {submissions.length === 0 ? (
          <div className="empty-state">Aucune note de frais pour ce filtre.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Nom déclaré</th>
                  <th>Période</th>
                  <th>Association</th>
                  <th>PJ</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th>Paiement</th>
                  <th>Statut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const assocCls = sub.association.includes("Connexion") ? "badge-assoc-ec" : "badge-assoc-fc";
                  const pjCount = Array.isArray(sub.pjNames) ? sub.pjNames.length : 0;
                  return (
                    <tr key={sub.id}>
                      <td style={{ whiteSpace: "nowrap", fontSize: ".78rem" }}>{formatDateFr(sub.createdAt)}</td>
                      <td>
                        <span className="user-chip">{sub.user.username}</span>
                      </td>
                      <td>
                        <strong>{sub.nom}</strong>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{sub.periode}</td>
                      <td>
                        {sub.association ? (
                          <span className={`badge ${assocCls}`}>{sub.association}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{pjCount > 0 ? <span className="badge badge-pj">{pjCount}</span> : "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {formatMontant(Number(sub.total))}
                      </td>
                      <td>
                        {sub.paiement === "virement" ? (
                          <span className="badge badge-vir">Virement</span>
                        ) : (
                          <span className="badge badge-chq">Chèque</span>
                        )}
                      </td>
                      <td>
                        {sub.status === "processed" ? (
                          <span className="badge badge-processed">✓ Traitée</span>
                        ) : (
                          <span className="badge badge-pending">En attente</span>
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <a href={`/ndf/api/download/${encodeURIComponent(sub.id)}`} className="btn-dl">
                          ⬇ ZIP
                        </a>
                        <form action={toggleStatusAction} style={{ display: "inline", marginLeft: 6 }}>
                          <input type="hidden" name="sub_id" value={sub.id} />
                          <input type="hidden" name="current_status" value={sub.status} />
                          {sub.status === "processed" ? (
                            <button type="submit" className="btn-status btn-mark-undone">
                              ↩ Annuler
                            </button>
                          ) : (
                            <button type="submit" className="btn-status btn-mark-done">
                              ✓ Traiter
                            </button>
                          )}
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: white; border-radius: 10px; padding: 18px 22px;
                     box-shadow: 0 1px 4px rgba(0,0,0,.08); }
        .stat-label { font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
                      color: #64748b; margin-bottom: 6px; }
        .stat-value { font-size: 1.4rem; font-weight: 700; color: #1e3a5f; }
        .stat-sub   { font-size: .78rem; color: #94a3b8; margin-top: 2px; }
        .btn-status { border: none; border-radius: 5px; padding: 5px 12px; font-size: .78rem; font-weight: 600;
                      cursor: pointer; transition: all .15s; white-space: nowrap; }
        .btn-mark-done   { background: #dcfce7; color: #166534; }
        .btn-mark-done:hover   { background: #bbf7d0; }
        .btn-mark-undone { background: #f1f5f9; color: #475569; }
        .btn-mark-undone:hover { background: #e2e8f0; }
        @media (max-width: 720px) {
          .stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
