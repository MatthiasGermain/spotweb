"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ShadSelect from "./ShadSelect";

export default function AdminFilters({
  usernames,
  associations,
  filterUser,
  filterStatus,
  filterAssoc,
}: {
  usernames: string[];
  associations: string[];
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
    <div className="flex items-center gap-2 flex-wrap">
      <ShadSelect
        name="__fu"
        options={[{ value: "", label: "Tous les utilisateurs" }, ...usernames.map((u) => ({ value: u, label: u }))]}
        defaultValue={filterUser}
        placeholder="Utilisateur"
        onValueChange={(v) => applyFilter("u", v)}
      />
      <ShadSelect
        name="__fs"
        options={[
          { value: "", label: "Tous les statuts" },
          { value: "created", label: "En attente" },
          { value: "processed", label: "Traitées" },
          { value: "a_completer", label: "À compléter" },
          { value: "draft", label: "Brouillons" },
        ]}
        defaultValue={filterStatus}
        placeholder="Statut"
        onValueChange={(v) => applyFilter("status", v)}
      />
      <ShadSelect
        name="__fa"
        options={[{ value: "", label: "Toutes les associations" }, ...associations.map((a) => ({ value: a, label: a }))]}
        defaultValue={filterAssoc}
        placeholder="Association"
        onValueChange={(v) => applyFilter("assoc", v)}
      />
      {!isDefault && (
        <a href="/ndf/admin" className="btn btn-ghost btn-sm" style={{ color: "var(--muted-foreground)" }}>
          <X className="size-3.5" /> Réinit.
        </a>
      )}
    </div>
  );
}
