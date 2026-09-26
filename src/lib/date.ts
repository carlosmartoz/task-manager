import { DAY_START_HOUR } from '@/lib/config'
import type { DayKey } from '@/types'

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/

// The day the app is living in, which starts at `DAY_START_HOUR` and not at
// midnight: at 2 a.m. it is still yesterday.
export function currentDay(now: Date = new Date()): Date {
  return now.getHours() < DAY_START_HOUR ? addDays(now, -1) : new Date(now)
}

// Local-time day key (YYYY-MM-DD), used to detect the day change.
export function getTodayKey(date: Date = currentDay()): DayKey {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// External data claims to hold day keys; this is how it is checked.
export function isDayKey(value: unknown): value is DayKey {
  return typeof value === 'string' && DAY_KEY.test(value)
}

export function formatLongDate(date: Date = currentDay()): string {
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

