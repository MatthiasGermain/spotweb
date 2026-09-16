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

export function formatMontant(m: number): string {
  return (
    m
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €"
  );
}
