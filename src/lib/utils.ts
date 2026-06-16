// Shared formatter instance (created once and reused) — building an
// Intl.DateTimeFormat on every call would be wasteful.
const DATE_FMT = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
});

/**
 * Formats an ISO date string into a short, human-readable label (e.g. "05 Jun").
 * Returns an empty string when no date is provided.
 */
export function formatDate(iso?: string): string {
  if (!iso) return "";

  return DATE_FMT.format(new Date(iso));
}

/**
 * Generates a short, reasonably unique id by combining the current timestamp
 * with a random suffix (both base-36 encoded). Good enough for local client-side
 * ids; not cryptographically secure.
 */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Joins class names into a single string, dropping any falsy values
 * (`false`, `null`, `undefined`). Handy for conditional Tailwind classes.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Converts an ISO date string into the `YYYY-MM-DD` format expected by
 * `<input type="date">`. Returns an empty string when no date is provided.
 */
export function toDateInput(iso?: string): string {
  if (!iso) return "";

  return new Date(iso).toISOString().slice(0, 10);
}

/**
 * Returns `true` when a task's due date is before today and the task is not
 * already done. Time is ignored (the comparison is done at the start of the day).
 */
export function isOverdue(dueDate?: string, status?: string): boolean {
  if (!dueDate || status === "done") return false;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return new Date(dueDate) < today;
}
