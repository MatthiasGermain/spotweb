import Link from "next/link";
import { requireUser } from "@/lib/ndf/auth";
import { fetchBlob } from "@/lib/ndf/blob";
import NdfForm from "@/components/ndf/NdfForm";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; id?: string; error?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const success = sp.success === "1";
  const successId = sp.id ?? "";
  const errorMsg = sp.error ?? "";

  const prefillNom = `${user.prenom} ${user.nom}`.trim();

  let savedSigDataUrl: string | null = null;
  if (user.signatureUrl) {
    try {
      const buf = await fetchBlob(user.signatureUrl);
      savedSigDataUrl = `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      savedSigDataUrl = null;
    }
  }

  return (
    <div className="container">
      {success && (
        <div className="alert alert-success">
          ✓ Note de frais enregistrée.
          {successId && (
            <a
              href={`/ndf/api/download/${encodeURIComponent(successId)}`}
              className="btn-dl"
              style={{ marginLeft: 8 }}
            >
              ⬇ Télécharger le ZIP
            </a>
          )}
        </div>
      )}
      {errorMsg && <div className="alert alert-error">⚠ {errorMsg}</div>}

      {!user.iban && (
        <div className="iban-notice">
          💡 Votre IBAN n&apos;est pas renseigné —{" "}
          <Link href="/ndf/profile" style={{ color: "#15803d", fontWeight: 600 }}>
            complétez votre profil
          </Link>{" "}
          pour qu&apos;il apparaisse dans les archives ZIP.
        </div>
      )}

      <NdfForm prefillNom={prefillNom} savedSigDataUrl={savedSigDataUrl} />

      <div className="card" style={{ textAlign: "center", padding: "20px 28px" }}>
        <Link
          href="/ndf/history"
          style={{ color: "#1e3a5f", fontWeight: 600, fontSize: ".95rem", textDecoration: "none" }}
        >
          📋 Voir l&apos;historique de mes notes de frais →
        </Link>
      </div>

      <style>{`
        .iban-notice {
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 7px;
          padding: 10px 14px; font-size: .8rem; color: #166534; margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
