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
      <div className="logo">
        <h1>Notes de frais</h1>
        <p>Eglise Connexion &amp; Family Connect</p>
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

        {error && <div className="alert alert-error">{error}</div>}

        <form action={mode === "register" ? registerAction : loginAction}>
          <label>Identifiant</label>
          <input type="text" name="username" defaultValue={usernameValue} autoComplete="username" required />

          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            required
          />

          {mode === "register" && (
            <>
              <label>Confirmer le mot de passe</label>
              <input type="password" name="confirm" autoComplete="new-password" required />
            </>
          )}

          <button type="submit" className="btn" style={{ width: "100%", marginTop: 4 }}>
            {mode === "register" ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        {mode !== "register" && (
          <p className="hint">
            Première fois ?{" "}
            <Link href="/ndf/login?mode=register" style={{ color: "#3b82f6" }}>
              Créez votre compte
            </Link>
          </p>
        )}
      </div>

      <style>{`
        .login-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .logo { text-align: center; margin-bottom: 28px; }
        .logo h1 { font-size: 1.4rem; color: #1e3a5f; font-weight: 700; }
        .logo p { font-size: .82rem; color: #64748b; margin-top: 4px; }

        .login-card { width: 100%; max-width: 420px; padding: 36px 40px; margin-bottom: 0; }

        .tabs { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 28px; }
        .tab {
          flex: 1; text-align: center; padding: 10px;
          font-size: .88rem; font-weight: 600; color: #64748b;
          cursor: pointer; text-decoration: none;
          border-bottom: 2px solid transparent; margin-bottom: -2px;
          transition: color .15s, border-color .15s;
        }
        .tab.active { color: #1e3a5f; border-bottom-color: #1e3a5f; }

        .login-card label { margin-bottom: 5px; }
        .login-card input { margin-bottom: 16px; }

        .hint { font-size: .78rem; color: #94a3b8; text-align: center; margin-top: 16px; }
      `}</style>
    </div>
  );
}
