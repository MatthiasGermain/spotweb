"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ShadSelect from "./ShadSelect";

export default function HistoryFilters({
  years,
  filterYear,
  filterStatus,
}: {
  years: number[];
  filterYear: string;
  filterStatus: string;
}) {
  const router = useRouter();

  function applyFilter(key: string, value: string) {
    const url = new URL(window.location.href);
    if (value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    router.push(url.pathname + url.search);
  }

  const isDefault = filterYear === "" && filterStatus === "";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ShadSelect
        name="__hy"
        options={[{ value: "", label: "Toutes les années" }, ...years.map((y) => ({ value: String(y), label: String(y) }))]}
        defaultValue={filterYear}
        placeholder="Année"
        onValueChange={(v) => applyFilter("y", v)}
      />
      <ShadSelect
        name="__hs"
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
      {!isDefault && (
        <a href="/ndf/history" className="btn btn-ghost btn-sm" style={{ color: "var(--muted-foreground)" }}>
          <X className="size-3.5" /> Réinit.
        </a>
      )}
    </div>
  );
}
