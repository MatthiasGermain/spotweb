/** Identifiant de soumission, même format que la version PHP : Ymd-His-xxxxxx */
export function generateSubmissionId(): string {
  const now = new Date();
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  const datePart =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const rand = Math.random().toString(16).slice(2, 8).padEnd(6, "0");
  return `${datePart}-${rand}`;
}
