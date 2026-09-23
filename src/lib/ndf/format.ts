export function formatDateFr(iso: string | Date): string {
  try {
    const dt = typeof iso === "string" ? new Date(iso) : iso;
    return dt.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

/** Année d'une date, à l'heure de Paris (cohérent avec formatDateFr — évite un décalage autour du 31/12-1/1 en UTC). */
export function parisYear(d: string | Date): number {
  const dt = typeof d === "string" ? new Date(d) : d;
  return Number(new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", year: "numeric" }).format(dt));
}

export function formatMontant(m: number): string {
  return (
    m
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €"
  );
}
