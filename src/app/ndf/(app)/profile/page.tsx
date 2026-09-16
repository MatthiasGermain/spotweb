import { requireUser } from "@/lib/ndf/auth";
import { fetchBlob } from "@/lib/ndf/blob";
import ConfirmForm from "@/components/ndf/ConfirmForm";
import IbanInput from "@/components/ndf/IbanInput";
import { updateProfileAction, changePasswordAction, updateSignatureAction } from "./actions";

function ibanFormat(iban: string): string {
  return (iban.replace(/\s+/g, "").match(/.{1,4}/g) ?? []).join(" ");
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ first?: string; success?: string; pwok?: string; pwerror?: string; sigok?: string; sigerror?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const firstLogin = sp.first !== undefined;
  const success = sp.success === "1";
  const pwOk = sp.pwok === "1";
  const pwError = sp.pwerror ?? "";
  const sigOk = sp.sigok === "1";
  const sigError = sp.sigerror ?? "";

  let sigDataUrl: string | null = null;
  if (user.signatureUrl) {
    try {
      const buf = await fetchBlob(user.signatureUrl);
      sigDataUrl = `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      sigDataUrl = null;
    }
  }

  return (
    <div className="container-narrow">
      {firstLogin && (
        <div className="welcome-banner">
          <h2>Bienvenue ! Complétez votre profil</h2>
          <p>
            Renseignez vos coordonnées pour qu&apos;elles soient pré-remplies dans vos notes de frais et incluses
            dans les archives ZIP.
          </p>
        </div>
      )}

      {success && <div className="alert alert-success">✓ Profil mis à jour avec succès.</div>}

      {/* Profil */}
      <div className="card">
        <div className="section-title">Informations personnelles</div>
        <form action={updateProfileAction}>
          <div className="form-row">
            <div>
              <label>Prénom</label>
              <input type="text" name="prenom" defaultValue={user.prenom} />
            </div>
            <div>
              <label>Nom</label>
              <input type="text" name="nom" defaultValue={user.nom} />
            </div>
          </div>
          <div className="form-row full">
            <div>
              <label>Email</label>
              <input type="email" name="email" defaultValue={user.email} />
            </div>
          </div>
          <div className="form-row full">
            <div>
              <label>Adresse postale</label>
              <textarea name="adresse" defaultValue={user.adresse} />
            </div>
          </div>
          <div className="form-row full">
            <div>
              <label>IBAN (pour virement)</label>
              <IbanInput defaultValue={ibanFormat(user.iban)} />
              <p className="iban-hint">L&apos;IBAN sera inclus dans les archives ZIP et dans le PDF (paiement par virement).</p>
            </div>
          </div>
          <button type="submit" className="btn">
            Enregistrer le profil
          </button>
        </form>
      </div>

      {/* Signature */}
      <div className="card">
        <div className="section-title">Signature enregistrée</div>

        {sigOk && <div className="alert alert-success">✓ Signature mise à jour.</div>}
        {sigError && <div className="alert alert-error">⚠ {sigError}</div>}

        {sigDataUrl && (
          <div className="sig-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sigDataUrl} alt="Signature enregistrée" />
          </div>
        )}

        <form action={updateSignatureAction}>
          <div className="form-row full" style={{ marginBottom: 14 }}>
            <div>
              <label>{sigDataUrl ? "Remplacer la signature" : "Importer une signature"}</label>
              <input type="file" name="sig_img" accept="image/jpeg,image/png,image/gif,image/webp" />
              <p className="sig-hint">
                Fichier image (JPG, PNG) sur fond blanc. Elle sera pré-chargée dans le formulaire NDF.
              </p>
            </div>
          </div>
          <div className="btn-row">
            <button type="submit" className="btn">
              Enregistrer la signature
            </button>
          </div>
        </form>

        {sigDataUrl && (
          <ConfirmForm
            action={updateSignatureAction}
            confirmMessage="Supprimer la signature enregistrée ?"
            style={{ marginTop: 10 }}
          >
            <input type="hidden" name="delete_sig" value="1" />
            <button type="submit" className="btn btn-danger">
              Supprimer la signature
            </button>
          </ConfirmForm>
        )}
      </div>

      {/* Mot de passe */}
      <div className="card">
        <div className="section-title">Changer le mot de passe</div>
        {pwError && <div className="alert alert-error">⚠ {pwError}</div>}
        {pwOk && <div className="alert alert-success">✓ Mot de passe modifié.</div>}
        <form action={changePasswordAction}>
          <div className="form-row full">
            <div>
              <label>Ancien mot de passe</label>
              <input type="password" name="old_pwd" />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Nouveau mot de passe</label>
              <input type="password" name="new_pwd" />
            </div>
            <div>
              <label>Confirmer</label>
              <input type="password" name="new_pwd2" />
            </div>
          </div>
          <button type="submit" className="btn">
            Changer le mot de passe
          </button>
        </form>
      </div>

      <style>{`
        .welcome-banner { background: linear-gradient(135deg, #1e3a5f, #2d5087);
                          color: white; border-radius: 10px; padding: 24px 28px; margin-bottom: 24px; }
        .welcome-banner h2 { font-size: 1.1rem; margin-bottom: 6px; }
        .welcome-banner p  { font-size: .85rem; opacity: .85; }
        .iban-input { font-family: 'Courier New', monospace; letter-spacing: .05em; }
        .iban-hint { font-size: .75rem; color: #94a3b8; margin-top: 4px; }
        .sig-preview { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;
                       background: white; margin-bottom: 14px; text-align: center; padding: 8px; }
        .sig-preview img { max-height: 100px; max-width: 100%; object-fit: contain; }
        .sig-hint { font-size: .75rem; color: #94a3b8; margin-top: 4px; }
      `}</style>
    </div>
  );
}
