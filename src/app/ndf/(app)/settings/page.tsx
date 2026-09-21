import { requireRole } from "@/lib/ndf/auth";
import {
  ensureDefaultAssociations,
  getAssociations,
  getAssociationById,
} from "@/lib/ndf/associations";
import ConfirmForm from "@/components/ndf/ConfirmForm";
import DeliverySettingsForm from "@/components/ndf/DeliverySettingsForm";
import { getDeliveryConfig } from "@/lib/ndf/settings";
import {
  saveDeliveryAction,
  saveAssociationAction,
  deleteLogoAction,
  deleteAssociationAction,
} from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string; edit?: string; new?: string }>;
}) {
  await requireRole(["ADMIN", "TRESORIER"]);
  const sp = await searchParams;

  await ensureDefaultAssociations();
  const assocs = await getAssociations();
  const delivery = await getDeliveryConfig();

  const isNew = sp.new !== undefined;
  const editId = sp.edit ?? "";
  const editAssoc = editId ? await getAssociationById(editId) : null;
  const showForm = isNew || !!editAssoc;

  return (
    <div className="page-sm">
      {sp.msg && <div className="alert alert-success mb-6">{sp.msg}</div>}
      {sp.error && <div className="alert alert-error mb-4">⚠ {sp.error}</div>}

      {!showForm ? (
        <>
          <div className="card mb-6">
            <div className="card-header flex items-center justify-between">
              <div className="card-title">Associations</div>
              <a href="/ndf/settings?new=1" className="btn btn-primary btn-sm">
                + Nouvelle
              </a>
            </div>

            {assocs.length === 0 ? (
              <div
                className="card-body text-center py-8"
                style={{ color: "var(--muted-foreground)" }}
              >
                Aucune association configurée.
              </div>
            ) : (
              <div>
                {assocs.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    {a.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/ndf/api/logo/${a.id}`}
                        alt=""
                        className="w-16 h-10 object-contain rounded shrink-0"
                        style={{ border: "1px solid var(--border)", background: "var(--muted)" }}
                      />
                    ) : (
                      <div
                        className="w-16 h-10 rounded flex items-center justify-center text-xs shrink-0"
                        style={{
                          border: "1px dashed var(--border)",
                          background: "var(--muted)",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        Logo
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{a.nom}</div>
                      <div
                        className="text-xs truncate"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {a.email !== "" ? a.email : "Pas d'email"}
                        {a.adresse !== "" ? " · " + a.adresse.split("\n")[0] : ""}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a
                        href={`/ndf/settings?edit=${encodeURIComponent(a.id)}`}
                        className="btn btn-secondary btn-sm"
                      >
                        ✏ Modifier
                      </a>
                      <ConfirmForm
                        action={deleteAssociationAction}
                        confirmMessage={`Supprimer « ${a.nom} » ?`}
                      >
                        <input type="hidden" name="assoc_id" value={a.id} />
                        <button
                          type="submit"
                          className="btn btn-sm"
                          style={{ borderColor: "#fca5a5", color: "#dc2626" }}
                        >
                          ✕
                        </button>
                      </ConfirmForm>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Réception des notes de frais</div>
            </div>
            <DeliverySettingsForm
              action={saveDeliveryAction}
              initialMode={delivery.mode}
              initialTemplate={delivery.nameTemplate}
            />
          </div>
        </>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              {isNew ? "Nouvelle association" : `Modifier : ${editAssoc?.nom}`}
            </div>
          </div>
          <div className="card-body">
            <form
              action={saveAssociationAction}
              encType="multipart/form-data"
              className="field-group"
            >
              <input type="hidden" name="assoc_id" value={editAssoc?.id ?? ""} />

              <div className="field">
                <label className="field-label">
                  Nom <span className="req">*</span>
                </label>
                <input
                  className="input"
                  type="text"
                  name="nom"
                  defaultValue={editAssoc?.nom ?? ""}
                  placeholder="ex : Eglise Connexion"
                  required
                />
              </div>
              <div className="field">
                <label className="field-label">Adresse</label>
                <textarea
                  className="input"
                  name="adresse"
                  rows={2}
                  placeholder={"12 rue de la Paix\n75001 Paris"}
                  defaultValue={editAssoc?.adresse ?? ""}
                />
                <p className="field-description">
                  Affichée sous le nom dans l&apos;en-tête du PDF.
                </p>
              </div>
              <div className="field">
                <label className="field-label">Email du trésorier</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  defaultValue={editAssoc?.email ?? ""}
                  placeholder="tresorier@monasso.fr"
                />
                <p className="field-description">Affiché dans le pied de page du PDF.</p>
              </div>

              <div className="field">
                <label className="field-label">Logo</label>
                {editAssoc?.logoUrl && (
                  <div
                    className="flex items-center gap-4 p-3 rounded-lg mb-3"
                    style={{ border: "1px solid var(--border)", background: "var(--muted)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/ndf/api/logo/${editAssoc.id}`}
                      alt="Logo actuel"
                      className="max-h-12 max-w-32 object-contain"
                    />
                    <div>
                      <p className="text-sm font-medium mb-2">Logo actuel</p>
                      <ConfirmForm action={deleteLogoAction} confirmMessage="Supprimer le logo ?">
                        <input type="hidden" name="assoc_id" value={editAssoc.id} />
                        <button type="submit" className="btn btn-sm btn-destructive">
                          ✕ Supprimer
                        </button>
                      </ConfirmForm>
                    </div>
                  </div>
                )}
                <div className="drop-zone">
                  <label style={{ cursor: "pointer", display: "block" }}>
                    <input type="file" name="logo" accept=".jpg,.jpeg,.png,.gif,.webp" />
                    <div className="text-2xl mb-2">🖼</div>
                    <p className="text-sm font-medium">
                      {editAssoc?.logoUrl ? "Remplacer le logo" : "Choisir un logo"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      JPG, PNG, WebP — 2 Mo max — recommandé 300×120 px
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-primary">
                  💾 Enregistrer
                </button>
                <a href="/ndf/settings" className="btn btn-secondary">
                  Annuler
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
