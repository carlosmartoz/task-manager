export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const DATE_FMT = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
});

export function formatDate(iso?: string): string {
  if (!iso) return "";
  return DATE_FMT.format(new Date(iso));
}

/** Devuelve la fecha (sin hora) en formato YYYY-MM-DD para inputs date. */
export function toDateInput(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function isOverdue(dueDate?: string, status?: string): boolean {
  if (!dueDate || status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}
