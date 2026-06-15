import type { Frequency, Routine } from "../types";

/** Fecha local en formato YYYY-MM-DD (sin desfase de zona horaria). */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Clave del periodo al que pertenece una fecha, según la frecuencia. */
export function periodKey(freq: Frequency, d: Date = new Date()): string {
  switch (freq) {
    case "daily":
      return dayKey(d);
    case "weekly": {
      // Semana ISO empezando en lunes
      const tmp = new Date(d);
      tmp.setHours(0, 0, 0, 0);
      const day = (tmp.getDay() + 6) % 7; // lunes = 0
      tmp.setDate(tmp.getDate() - day);
      return `W-${dayKey(tmp)}`;
    }
    case "monthly":
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
}

/** ¿La rutina ya se completó en el periodo actual? */
export function isDoneThisPeriod(routine: Routine, now: Date = new Date()): boolean {
  const current = periodKey(routine.frequency, now);
  return routine.history.some((d) => periodKey(routine.frequency, new Date(d)) === current);
}

/** Racha de periodos consecutivos completados (incluye el actual si está hecho). */
export function streak(routine: Routine, now: Date = new Date()): number {
  if (routine.history.length === 0) return 0;
  const completed = new Set(
    routine.history.map((d) => periodKey(routine.frequency, new Date(d)))
  );

  let count = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  // Si el periodo actual no está hecho, empezamos a contar desde el anterior.
  if (!completed.has(periodKey(routine.frequency, cursor))) {
    step(routine.frequency, cursor, -1);
  }

  while (completed.has(periodKey(routine.frequency, cursor))) {
    count++;
    step(routine.frequency, cursor, -1);
  }
  return count;
}

function step(freq: Frequency, d: Date, dir: number) {
  if (freq === "daily") d.setDate(d.getDate() + dir);
  else if (freq === "weekly") d.setDate(d.getDate() + 7 * dir);
  else d.setMonth(d.getMonth() + dir);
}

/** Cuántas veces se completó en total (periodos únicos). */
export function totalCompletions(routine: Routine): number {
  return new Set(
    routine.history.map((d) => periodKey(routine.frequency, new Date(d)))
  ).size;
}
