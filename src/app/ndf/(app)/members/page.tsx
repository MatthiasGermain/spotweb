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
    <div className="page">
      {sp.ok && <div className="alert alert-success mb-4">✓ {sp.ok}</div>}
      {sp.error && <div className="alert alert-error mb-4">⚠ {sp.error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card stat-card card-body">
          <div className="stat-label">Membres</div>
          <div className="stat-value">{totalMembers}</div>
        </div>
        <div className="card stat-card card-body">
          <div className="stat-label">Actifs</div>
          <div className="stat-value">{activeMembers}</div>
        </div>
        <div className="card stat-card card-body">
          <div className="stat-label">Avec IBAN</div>
          <div className="stat-value">{withIban}</div>
        </div>
        <div className="card stat-card card-body">
          <div className="stat-label">Notes NDF</div>
          <div className="stat-value">{totalNdf}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between gap-4">
          <div className="card-title">
            Liste des membres
            {iAmTresorier && !iAmAdmin && (
              <span
                className="badge badge-secondary ml-2"
                style={{ textTransform: "none", letterSpacing: 0, fontSize: ".7rem" }}
              >
                lecture seule
              </span>
            )}
          </div>
        </div>

        <div className="card-body">
          {iAmTresorier && !iAmAdmin && (
            <p className="text-sm mb-3" style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>
              Vous consultez les fiches membres en lecture seule.
            </p>
          )}

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
      </div>
    </div>
  );
}
