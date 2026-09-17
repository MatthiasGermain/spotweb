import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/ndf/auth";
import { loginAction, registerAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; username?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/ndf");

  const sp = await searchParams;
  const mode = sp.mode === "register" ? "register" : "login";
  const error = sp.error ?? "";
  const usernameValue = sp.username ?? "";

  return (
    <div className="login-shell">
      <div className="mb-8 text-center">
        <div
          className="inline-flex items-center justify-center rounded-lg mb-3"
          style={{ width: "2.5rem", height: "2.5rem", background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          🧾
        </div>
        <h1 className="text-xl font-semibold">Notes de frais</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Gestion des remboursements
        </p>
      </div>

      <div className="card login-card">
        <div className="tabs">
          <Link href="/ndf/login?mode=login" className={`tab${mode !== "register" ? " active" : ""}`}>
            Se connecter
          </Link>
          <Link href="/ndf/login?mode=register" className={`tab${mode === "register" ? " active" : ""}`}>
            Créer un compte
          </Link>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-error mb-4">{error}</div>}

          <form action={mode === "register" ? registerAction : loginAction} className="field-group">
            <div className="field">
              <label className="field-label">Identifiant</label>
              <input className="input" type="text" name="username" defaultValue={usernameValue} autoComplete="username" required />
            </div>

            <div className="field">
              <label className="field-label">Mot de passe</label>
              <input
                className="input"
                type="password"
                name="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                required
              />
            </div>

            {mode === "register" && (
              <div className="field">
                <label className="field-label">Confirmer le mot de passe</label>
                <input className="input" type="password" name="confirm" autoComplete="new-password" required />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg w-full">
              {mode === "register" ? "Créer mon compte" : "Se connecter"}
            </button>
          </form>

          {mode !== "register" && (
            <p className="mt-4 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
              Première fois ?{" "}
              <Link href="/ndf/login?mode=register" style={{ color: "var(--primary)", fontWeight: 500 }}>
                Créez votre compte
              </Link>
            </p>
          )}
        </div>
      </div>

      <style>{`
        .login-shell {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .login-card { width: 100%; max-width: 24rem; margin-bottom: 0; }
        .tabs { display: flex; border-bottom: 1px solid var(--border); }
        .tab {
          flex: 1; text-align: center; padding: .75rem;
          font-size: .875rem; font-weight: 500; color: var(--muted-foreground);
          cursor: pointer; text-decoration: none;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: color .15s, border-color .15s;
        }
        .tab.active { color: var(--foreground); border-bottom-color: var(--primary); }
      `}</style>
    </div>
  );
}
