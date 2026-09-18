import type { DayKey } from '@/types'

// Local-time day key (YYYY-MM-DD), used to detect the day change.
export function getTodayKey(date: Date = new Date()): DayKey {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatLongDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

// A new date shifted by `amount` days. Does not mutate the original.
export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

// Last instant of the day, to tell whether a task already existed then.
export function endOfDay(date: Date): number {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result.getTime()
}
