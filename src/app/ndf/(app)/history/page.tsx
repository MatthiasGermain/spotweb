import Link from "next/link";
import { requireUser } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import { formatMontant } from "@/lib/ndf/format";
import HistoryTable, { type HistoryRow } from "@/components/ndf/HistoryTable";
import { deleteSubmissionAction } from "./actions";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const deleted = sp.deleted !== undefined;

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
  }));

  const total = rows.reduce((sum, r) => sum + r.total, 0);
  const nbPend = rows.filter((r) => r.status === "created").length;
  const nbDone = rows.length - nbPend;

  return (
    <div className="container-wide">
      {deleted && <div className="alert alert-success">✓ Note de frais supprimée.</div>}

      {rows.length > 0 && (
        <div className="summary">
          <div className="sum-chip">
            {rows.length} note(s) — total <strong>{formatMontant(total)}</strong>
          </div>
          <div className="sum-chip">
            ⏳ En attente : <strong>{nbPend}</strong>
          </div>
          <div className="sum-chip">
            ✓ Traitées : <strong>{nbDone}</strong>
          </div>
        </div>
      )}

      <div className="card">
        <div className="section-title">Mes notes de frais</div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <div>📂</div>
            <p>Aucune note enregistrée.</p>
            <p style={{ marginTop: 10 }}>
              <Link href="/ndf" style={{ color: "#3b82f6" }}>
                Créer ma première note de frais →
              </Link>
            </p>
          </div>
        ) : (
          <HistoryTable rows={rows} deleteAction={deleteSubmissionAction} />
        )}
      </div>
    </div>
  );
}
