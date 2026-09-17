export const MONTH_LABELS: Record<string, string> = {
  "01": "Janvier",
  "02": "Février",
  "03": "Mars",
  "04": "Avril",
  "05": "Mai",
  "06": "Juin",
  "07": "Juillet",
  "08": "Août",
  "09": "Septembre",
  "10": "Octobre",
  "11": "Novembre",
  "12": "Décembre",
};

export function frMonths(): { value: string; label: string }[] {
  return Object.entries(MONTH_LABELS).map(([value, label]) => ({ value, label }));
}

export function selectYears(): { value: string; label: string }[] {
  const current = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = current - 2; y <= current + 3; y++) years.push({ value: String(y), label: String(y) });
  return years;
}

const REVERSE_MONTHS: Record<string, string> = {
  janvier: "01",
  fevrier: "02",
  février: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  aout: "08",
  août: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  decembre: "12",
  décembre: "12",
};

export function parsePeriode(periode: string): { month: string; year: string } {
  const parts = periode.toLowerCase().trim().split(/[\s,]+/);
  let month = "";
  let year = "";
  for (const p of parts) {
    if (REVERSE_MONTHS[p]) month = REVERSE_MONTHS[p];
    if (/^\d{4}$/.test(p)) year = p;
  }
  return { month, year };
}

export function monthLabel(num: string): string {
  return MONTH_LABELS[num] ?? "";
}

export function combinePeriode(month: string, year: string): string {
  if (!month || !year) return "";
  return `${monthLabel(month)} ${year}`;
}
