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
 * Local date as `YYYY-MM-DD` (no timezone offset). Used to know whether a daily
 * task was completed "today" — the check resets automatically on date change.
 */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();

  const m = String(d.getMonth() + 1).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}
