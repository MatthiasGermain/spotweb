import { requireRole, isAdmin as checkIsAdmin, isTresorier as checkIsTresorier } from "@/lib/ndf/auth";
import { prisma } from "@/lib/ndf/db";
import MembersTable, { type MemberRow } from "@/components/ndf/MembersTable";
import { setRoleAction, toggleDisabledAction, deleteUserAction } from "./actions";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const me = await requireRole(["ADMIN", "TRESORIER"]);
  const sp = await searchParams;

  const iAmAdmin = checkIsAdmin(me);
  const iAmTresorier = checkIsTresorier(me);

  const users = await prisma.user.findMany({
    include: { submissions: { select: { total: true } } },
    orderBy: { createdAt: "asc" },
  });

  const members: MemberRow[] = users.map((u) => ({
    username: u.username,
    prenom: u.prenom,
    nom: u.nom,
    email: u.email,
    iban: u.iban,
    hasSig: !!u.signatureUrl,
    ndfCount: u.submissions.length,
    ndfTotal: u.submissions.reduce((s, sub) => s + Number(sub.total), 0),
    role: u.role,
    disabled: u.disabled,
  }));

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => !m.disabled).length;
  const withIban = members.filter((m) => m.iban.trim() !== "").length;
  const totalNdf = members.reduce((s, m) => s + m.ndfCount, 0);

  return (
    <div className="container-medium">
      {sp.ok && <div className="alert alert-success">✓ {sp.ok}</div>}
      {sp.error && <div className="alert alert-error">⚠ {sp.error}</div>}

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Membres inscrits</div>
          <div className="stat-value">{totalMembers}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Comptes actifs</div>
          <div className="stat-value">{activeMembers}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Avec IBAN</div>
          <div className="stat-value">{withIban}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Notes de frais</div>
          <div className="stat-value">{totalNdf}</div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">
          Liste des membres
          {iAmTresorier && !iAmAdmin && (
            <span style={{ fontSize: ".75rem", color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              lecture seule
            </span>
          )}
        </div>

        {iAmTresorier && !iAmAdmin && <p className="info-note">Vous consultez les fiches membres en lecture seule.</p>}

        <MembersTable
          members={members}
          meUsername={me.username}
          isAdmin={iAmAdmin}
          isTresorier={iAmTresorier}
          setRoleAction={setRoleAction}
          toggleDisabledAction={toggleDisabledAction}
          deleteUserAction={deleteUserAction}
        />
      </div>

      <style>{`
        .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
        .stat { background: white; border-radius: 10px; padding: 16px 22px;
                box-shadow: 0 1px 4px rgba(0,0,0,.08); min-width: 140px; }
        .stat-label { font-size: .72rem; font-weight: 700; letter-spacing: .06em;
                      text-transform: uppercase; color: #64748b; margin-bottom: 5px; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: #1e3a5f; }
        .info-note { font-size: .82rem; color: #64748b; font-style: italic; margin-bottom: 14px; }
      `}</style>
    </div>
  );
}
