import { requireUser } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { formatMontant } from "@/lib/ndf/format";
import HistoryTable, { type HistoryRow } from "@/components/ndf/HistoryTable";
import { deleteSubmissionAction } from "./actions";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; draft_saved?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const deleted = sp.deleted !== undefined;
  const draftSaved = sp.draft_saved !== undefined;

  const submissions = await prisma.submission.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const rows: HistoryRow[] = submissions.map((s) => ({
    id: s.id,
    createdAt: s.createdAt.toISOString(),
    nom: s.nom,
    periode: s.periode,
    association: s.association,
    pjCount: Array.isArray(s.pjNames) ? s.pjNames.length : 0,
    total: Number(s.total),
    paiement: s.paiement,
    status: s.status,
    reviewComment: s.reviewComment,
  }));

  const total = rows.reduce((sum, r) => sum + r.total, 0);
  const nbDraft = rows.filter((r) => r.status === "draft").length;
  const nbRejected = rows.filter((r) => r.status === "a_completer").length;
  const nbPend = rows.filter((r) => r.status === "created").length;
  const nbDone = rows.length - nbPend - nbDraft - nbRejected;

  return (
    <div className="page">
      {deleted && <div className="alert alert-success mb-4">✓ Note de frais supprimée.</div>}
      {draftSaved && (
        <div className="alert alert-info mb-4">💾 Brouillon enregistré — modifiez-le ou soumettez-le quand vous êtes prêt.</div>
      )}
      {nbRejected > 0 && (
        <div className="alert alert-error mb-4">
          ↩ {nbRejected > 1 ? `${nbRejected} notes ont` : "Une note a"} été renvoyée{nbRejected > 1 ? "s" : ""} par le trésorier « à
          compléter » — voir le motif dans le tableau ci-dessous.
        </div>
      )}

      {rows.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card stat-card card-body">
            <div className="stat-label">Total</div>
            <div className="stat-value" style={{ fontSize: "1.125rem" }}>
              {formatMontant(total)}
            </div>
            <div className="stat-sub">{rows.length} note(s)</div>
          </div>
          {nbDraft > 0 && (
            <div className="card stat-card card-body">
              <div className="stat-label">Brouillons</div>
              <div className="stat-value">{nbDraft}</div>
              <div className="stat-sub" style={{ color: "#854d0e" }}>
                à compléter
              </div>
            </div>
          )}
          {nbRejected > 0 && (
            <div className="card stat-card card-body">
              <div className="stat-label">Renvoyées</div>
              <div className="stat-value">{nbRejected}</div>
              <div className="stat-sub" style={{ color: "#991b1b" }}>
                à corriger
              </div>
            </div>
          )}
          <div className="card stat-card card-body">
            <div className="stat-label">En attente</div>
            <div className="stat-value">{nbPend}</div>
            <div className="stat-sub">soumises</div>
          </div>
          <div className="card stat-card card-body">
            <div className="stat-label">Traitées</div>
            <div className="stat-value">{nbDone}</div>
            <div className="stat-sub" style={{ color: "#166534" }}>
              remboursées
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">Mes notes de frais</div>
        </div>

        {rows.length === 0 ? (
          <div className="card-body text-center py-16" style={{ color: "var(--muted-foreground)" }}>
            <div className="text-4xl mb-3">📂</div>
            <p className="mb-4">Aucune note enregistrée.</p>
            <a href="/ndf" className="btn btn-primary">
              Créer ma première note de frais
            </a>
          </div>
        ) : (
          <HistoryTable rows={rows} deleteAction={deleteSubmissionAction} />
        )}
      </div>
    </div>
  );
}
