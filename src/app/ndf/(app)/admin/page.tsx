import { requireRole } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { ensureDefaultAssociations, getAssociations } from "@/lib/ndf/associations";
import { formatDateFr, formatMontant, parisYear } from "@/lib/ndf/format";
import AdminFilters from "@/components/ndf/AdminFilters";
import RejectForm from "@/components/ndf/RejectForm";
import { Download, CircleCheck, Undo2 } from "lucide-react";
import { toggleStatusAction, rejectSubmissionAction } from "./actions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    u?: string;
    status?: string;
    assoc?: string;
    y?: string;
    rejected?: string;
    mailerr?: string;
    error?: string;
  }>;
}) {
  await requireRole(["TRESORIER"]);
  const sp = await searchParams;

  const filterUser = sp.u ?? "";
  const filterStatus = sp.status ?? "";
  const filterAssoc = sp.assoc ?? "";
  const filterYear = sp.y ?? "";

  const users = await prisma.user.findMany({
    select: { username: true, prenom: true, nom: true },
    orderBy: [{ prenom: "asc" }, { nom: "asc" }],
  });
  await ensureDefaultAssociations();
  const assocList = await getAssociations();

  // Années disponibles pour le sélecteur : indépendantes des autres filtres actifs.
  const allDates = await prisma.submission.findMany({ select: { createdAt: true } });
  const years = [...new Set(allDates.map((d) => parisYear(d.createdAt)))].sort((a, b) => b - a);

  const submissionsRaw = await prisma.submission.findMany({
    where: {
      ...(filterUser ? { user: { username: filterUser } } : {}),
      ...(filterStatus ? { status: filterStatus } : {}),
      ...(filterAssoc ? { association: filterAssoc } : {}),
    },
    include: { user: { select: { username: true, prenom: true, nom: true } } },
    orderBy: { createdAt: "desc" },
  });
  const submissions = filterYear
    ? submissionsRaw.filter((s) => String(parisYear(s.createdAt)) === filterYear)
    : submissionsRaw;

  const totalAll = submissions.reduce((s, sub) => s + Number(sub.total), 0);
  const totalPending = submissions
    .filter((s) => s.status !== "processed")
    .reduce((s, sub) => s + Number(sub.total), 0);
  const totalProcessed = submissions
    .filter((s) => s.status === "processed")
    .reduce((s, sub) => s + Number(sub.total), 0);

  return (
    <div className="page">
      {sp.rejected && <div className="alert alert-success mb-4">✓ Note renvoyée au demandeur.</div>}
      {sp.mailerr && (
        <div className="alert alert-error mb-4">
          ⚠ La note a bien été renvoyée « à compléter », mais l&apos;e-mail au demandeur n&apos;a pas pu être envoyé : {sp.mailerr}
        </div>
      )}
      {sp.error && <div className="alert alert-error mb-4">⚠ {sp.error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card stat-card card-body">
          <div className="stat-label">Total (filtre)</div>
          <div className="stat-value">{formatMontant(totalAll)}</div>
          <div className="stat-sub">{submissions.length} note(s)</div>
        </div>
        <div className="card stat-card card-body">
          <div className="stat-label">En attente</div>
          <div className="stat-value">{formatMontant(totalPending)}</div>
          <div className="stat-sub" style={{ color: "#d97706" }}>
            à traiter
          </div>
        </div>
        <div className="card stat-card card-body">
          <div className="stat-label">Traitées</div>
          <div className="stat-value">{formatMontant(totalProcessed)}</div>
          <div className="stat-sub" style={{ color: "#166534" }}>
            remboursées
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between gap-4 flex-wrap">
          <div className="card-title">Notes de frais</div>
          <AdminFilters
            people={users.map((u) => ({ value: u.username, label: `${u.prenom} ${u.nom}`.trim() || u.username }))}
            associations={assocList.map((a) => a.nom)}
            years={years}
            filterUser={filterUser}
            filterStatus={filterStatus}
            filterAssoc={filterAssoc}
            filterYear={filterYear}
          />
        </div>

        {submissions.length === 0 ? (
          <div className="card-body text-center py-12" style={{ color: "var(--muted-foreground)" }}>
            Aucune note de frais pour ce filtre.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
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
                  const assocCls = sub.association.includes("Connexion") ? "badge-purple" : "badge-pink";
                  const pjCount = Array.isArray(sub.pjNames) ? sub.pjNames.length : 0;
                  return (
                    <tr key={sub.id}>
                      <td className="text-muted-foreground" style={{ whiteSpace: "nowrap", fontSize: ".8rem", color: "var(--muted-foreground)" }}>
                        {formatDateFr(sub.createdAt)}
                      </td>
                      <td>
                        <span
                          className="font-mono"
                          style={{ background: "var(--muted)", padding: "2px 8px", borderRadius: 4, fontSize: ".75rem" }}
                        >
                          {sub.user.username}
                        </span>
                      </td>
                      <td className="font-medium">{sub.nom}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{sub.periode}</td>
                      <td>{sub.association ? <span className={`badge ${assocCls}`}>{sub.association}</span> : "—"}</td>
                      <td>{pjCount > 0 ? <span className="badge badge-blue">{pjCount}</span> : "—"}</td>
                      <td className="font-semibold" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        {formatMontant(Number(sub.total))}
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
                          <span className="badge badge-warning" title={sub.reviewComment} style={{ color: "#92400e" }}>
                            ↩ À compléter
                          </span>
                        ) : (
                          <span className="badge badge-secondary">En attente</span>
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
                          <form action={toggleStatusAction} style={{ display: "contents" }}>
                            <input type="hidden" name="sub_id" value={sub.id} />
                            <input type="hidden" name="current_status" value={sub.status} />
                            {sub.status === "processed" ? (
                              <button type="submit" className="btn btn-outline btn-sm btn-icon" data-tip="Annuler le traitement" aria-label="Annuler">
                                <Undo2 className="size-4" />
                              </button>
                            ) : sub.status !== "draft" && sub.status !== "a_completer" ? (
                              <button
                                type="submit"
                                className="btn btn-outline btn-sm btn-icon"
                                data-tip="Marquer comme traitée"
                                aria-label="Traiter"
                                style={{ color: "oklch(0.38 0.10 152)", borderColor: "oklch(0.90 0.05 152)" }}
                              >
                                <CircleCheck className="size-4" />
                              </button>
                            ) : null}
                          </form>
                          {sub.status === "created" && (
                            <RejectForm subId={sub.id} nom={sub.nom} action={rejectSubmissionAction} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
