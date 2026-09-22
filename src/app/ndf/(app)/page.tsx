import Link from "next/link";
import { requireUser } from "@/lib/ndf/auth";
import { fetchBlob } from "@/lib/ndf/blob";
import { toDataUrl } from "@/lib/ndf/image";
import { prisma } from "@/lib/ndf/db";
import { ensureDefaultAssociations, getAssociations } from "@/lib/ndf/associations";
import { parsePeriode } from "@/lib/ndf/periode";
import NdfForm, { type DraftData } from "@/components/ndf/NdfForm";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; id?: string; error?: string; edit?: string; mailerr?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const success = sp.success === "1";
  const successId = sp.id ?? "";
  const errorMsg = sp.error ?? "";
  const mailErr = sp.mailerr ?? "";

  const prefillNom = `${user.prenom} ${user.nom}`.trim();

  let savedSigDataUrl: string | null = null;
  if (user.signatureUrl) {
    try {
      const buf = await fetchBlob(user.signatureUrl);
      savedSigDataUrl = toDataUrl(buf);
    } catch {
      savedSigDataUrl = null;
    }
  }

  await ensureDefaultAssociations();
  const associations = await getAssociations();

  let draft: DraftData | null = null;
  const editId = (sp.edit ?? "").replace(/[^a-zA-Z0-9_-]/g, "");
  if (editId) {
    const sub = await prisma.submission.findUnique({ where: { id: editId } });
    if (sub && sub.userId === user.id && (sub.status === "draft" || sub.status === "a_completer")) {
      const { month, year } = parsePeriode(sub.periode);
      draft = {
        id: sub.id,
        nom: sub.nom,
        month,
        year: year || String(new Date().getFullYear()),
        association: sub.association,
        contexte: sub.contexte,
        paiement: sub.paiement === "cheque" ? "cheque" : "virement",
        lignes: (sub.lignes as { date: string; description: string; montant: number }[]) ?? [],
        pj: (sub.pjNames as string[]) ?? [],
        status: sub.status,
        reviewComment: sub.reviewComment,
      };
    }
  }

  return (
    <div className="page-sm">
      {success && (
        <div className="alert alert-success mb-4">
          ✓ Note générée avec succès.
          {successId && (
            <a href={`/ndf/api/download/${encodeURIComponent(successId)}`} className="font-semibold underline ml-1">
              Télécharger
            </a>
          )}
        </div>
      )}
      {success && mailErr && (
        <div className="alert alert-error mb-4">
          ⚠ Votre note est bien enregistrée, mais l&apos;e-mail de notification n&apos;a pas pu être envoyé : {mailErr}
        </div>
      )}
      {errorMsg && <div className="alert alert-error mb-4">⚠ {errorMsg}</div>}
      {draft && draft.status === "a_completer" ? (
        <div className="alert alert-error mb-4">
          ↩ Cette note vous a été renvoyée par le trésorier.
          {draft.reviewComment && (
            <>
              {" "}
              Motif : <strong>{draft.reviewComment}</strong>.
            </>
          )}{" "}
          Corrigez-la puis soumettez-la à nouveau.
        </div>
      ) : (
        draft && <div className="alert alert-info mb-4">✏ Modification d&apos;un brouillon — complétez puis soumettez ou ré-enregistrez.</div>
      )}

      <NdfForm
        prefillNom={draft?.nom ?? prefillNom}
        savedSigDataUrl={savedSigDataUrl}
        associations={associations}
        draft={draft}
      />

      <div className="text-center pb-6">
        <Link href="/ndf/history" className="text-sm inline-flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          📋 Voir l&apos;historique de mes notes de frais
        </Link>
      </div>
    </div>
  );
}
