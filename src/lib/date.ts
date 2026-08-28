import type { DayKey, Weekday } from '@/types/task'

/** Clave del día en hora local (YYYY-MM-DD), usada para detectar el cambio de día. */
export function getTodayKey(date: Date = new Date()): DayKey {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatLongDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function getWeekday(date: Date = new Date()): Weekday {
  return date.getDay() as Weekday
}

/** Nueva fecha desplazada `amount` días. No muta la original. */
export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

/** Último instante del día, para saber si una tarea ya existía en esa fecha. */
export function endOfDay(date: Date): number {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result.getTime()
}

/** Etiquetas en orden de `Date.getDay()`: el índice 0 es domingo. */
export const WEEKDAYS: { value: Weekday; short: string; long: string }[] = [
  { value: 1, short: 'L', long: 'lunes' },
  { value: 2, short: 'M', long: 'martes' },
  { value: 3, short: 'X', long: 'miércoles' },
  { value: 4, short: 'J', long: 'jueves' },
  { value: 5, short: 'V', long: 'viernes' },
  { value: 6, short: 'S', long: 'sábado' },
  { value: 0, short: 'D', long: 'domingo' },
]

/** Resumen legible de los días marcados: 'L · X · V' o 'Todos los días'. */
export function formatWeekdays(weekdays: Weekday[]): string {
  if (weekdays.length === 0) return 'Todos los días'

  return WEEKDAYS.filter(({ value }) => weekdays.includes(value))
    .map(({ short }) => short)
    .join(' · ')
}
