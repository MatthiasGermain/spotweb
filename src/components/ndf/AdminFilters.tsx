"use client";

import { useRouter } from "next/navigation";

export default function AdminFilters({
  usernames,
  filterUser,
  filterStatus,
  filterAssoc,
}: {
  usernames: string[];
  filterUser: string;
  filterStatus: string;
  filterAssoc: string;
}) {
  const router = useRouter();

  function applyFilter(key: string, value: string) {
    const url = new URL(window.location.href);
    if (value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    router.push(url.pathname + url.search);
  }

  const isDefault = filterUser === "" && filterStatus === "" && filterAssoc === "";

  return (
    <div className="filters">
      <select value={filterUser} onChange={(e) => applyFilter("u", e.target.value)}>
        <option value="">Tous les utilisateurs</option>
        {usernames.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <select value={filterStatus} onChange={(e) => applyFilter("status", e.target.value)}>
        <option value="">Tous les statuts</option>
        <option value="created">En attente</option>
        <option value="processed">Traitées</option>
      </select>

      <select value={filterAssoc} onChange={(e) => applyFilter("assoc", e.target.value)}>
        <option value="">Toutes les associations</option>
        <option value="Eglise Connexion">Eglise Connexion</option>
        <option value="Family Connect">Family Connect</option>
      </select>

      <a href="/ndf/admin" className={isDefault ? "active" : ""}>
        ✕ Réinitialiser
      </a>

      <style>{`
        .filters { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
        .filters select, .filters a { padding: 7px 12px; border: 1px solid #d1d5db; border-radius: 6px;
                                      font-size: .83rem; background: white; color: #374151; text-decoration: none; }
        .filters select:focus { outline: none; border-color: #3b82f6; }
        .filters a.active { background: #1e3a5f; color: white; border-color: #1e3a5f; }
      `}</style>
    </div>
  );
}
