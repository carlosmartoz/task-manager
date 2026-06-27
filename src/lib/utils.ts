// Generate Id
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Joins class names into a single string, dropping any falsy values
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Date Format
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();

  const m = String(d.getMonth() + 1).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}
