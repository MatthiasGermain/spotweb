import { requireUser } from "@/lib/ndf/auth";
import { fetchBlob } from "@/lib/ndf/blob";
import { toDataUrl } from "@/lib/ndf/image";
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
      sigDataUrl = toDataUrl(buf);
    } catch {
      sigDataUrl = null;
    }
  }

  return (
    <div className="page-sm">
      {firstLogin && (
        <div className="rounded-lg mb-6 p-5" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          <h2 className="font-semibold text-base mb-1">Bienvenue ! Complétez votre profil</h2>
          <p className="text-sm" style={{ opacity: 0.85 }}>
            Renseignez vos coordonnées pour pré-remplir vos notes de frais.
          </p>
        </div>
      )}

      {success && <div className="alert alert-success mb-4">✓ Profil mis à jour.</div>}

      {/* Profil */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title">Informations personnelles</div>
        </div>
        <div className="card-body">
          <form action={updateProfileAction} className="field-group">
            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="field-label">Prénom</label>
                <input className="input" type="text" name="prenom" defaultValue={user.prenom} />
              </div>
              <div className="field">
                <label className="field-label">Nom</label>
                <input className="input" type="text" name="nom" defaultValue={user.nom} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Email</label>
              <input className="input" type="email" name="email" defaultValue={user.email} />
            </div>
            <div className="field">
              <label className="field-label">Adresse postale</label>
              <textarea className="input" name="adresse" rows={2} defaultValue={user.adresse} />
            </div>
            <div className="field">
              <label className="field-label">IBAN (pour virement)</label>
              <IbanInput defaultValue={ibanFormat(user.iban)} />
              <p className="field-description">Inclus dans les archives ZIP et dans le PDF (virement).</p>
            </div>
            <button type="submit" className="btn btn-primary">
              Enregistrer le profil
            </button>
          </form>
        </div>
      </div>

      {/* Signature */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title">Signature enregistrée</div>
        </div>
        <div className="card-body field-group">
          {sigOk && <div className="alert alert-success">✓ Signature mise à jour.</div>}
          {sigError && <div className="alert alert-error">⚠ {sigError}</div>}

          {sigDataUrl && (
            <div className="rounded-lg p-4 text-center" style={{ border: "1px solid var(--border)", background: "var(--muted)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sigDataUrl} alt="Signature" className="mx-auto object-contain" style={{ maxHeight: 80 }} />
            </div>
          )}

          <form action={updateSignatureAction} className="field-group" style={{ gap: ".75rem" }}>
            <div className="field">
              <label className="field-label">{sigDataUrl ? "Remplacer la signature" : "Importer une signature"}</label>
              <input className="input" type="file" name="sig_img" accept="image/jpeg,image/png,image/gif,image/webp" />
              <p className="field-description">Image sur fond blanc, JPG ou PNG. Elle sera pré-chargée dans le formulaire NDF.</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary btn-sm">
                Enregistrer
              </button>
              {sigDataUrl && (
                <ConfirmForm action={updateSignatureAction} confirmMessage="Supprimer la signature enregistrée ?">
                  <input type="hidden" name="delete_sig" value="1" />
                  <button type="submit" className="btn btn-destructive btn-sm">
                    Supprimer
                  </button>
                </ConfirmForm>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Mot de passe */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Changer le mot de passe</div>
        </div>
        <div className="card-body field-group">
          {pwError && <div className="alert alert-error">⚠ {pwError}</div>}
          {pwOk && <div className="alert alert-success">✓ Mot de passe modifié.</div>}
          <form action={changePasswordAction} className="field-group">
            <div className="field">
              <label className="field-label">Ancien mot de passe</label>
              <input className="input" type="password" name="old_pwd" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="field-label">Nouveau</label>
                <input className="input" type="password" name="new_pwd" />
              </div>
              <div className="field">
                <label className="field-label">Confirmer</label>
                <input className="input" type="password" name="new_pwd2" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
