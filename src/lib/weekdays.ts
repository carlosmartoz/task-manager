import type { Task, Weekday } from '@/types'

// In reading order, not `Date.getDay()` order: the week starts on Monday.
export const WEEKDAYS: { value: Weekday; short: string; long: string }[] = [
  { value: 1, short: 'Mo', long: 'Monday' },
  { value: 2, short: 'Tu', long: 'Tuesday' },
  { value: 3, short: 'We', long: 'Wednesday' },
  { value: 4, short: 'Th', long: 'Thursday' },
  { value: 5, short: 'Fr', long: 'Friday' },
  { value: 6, short: 'Sa', long: 'Saturday' },
  { value: 0, short: 'Su', long: 'Sunday' },
]

const ALL_DAYS = WEEKDAYS.map(({ value }) => value)

export function getWeekday(date: Date = new Date()): Weekday {
  return date.getDay() as Weekday
}

// A task with no days marked is due every day, and a one-off is due until done.
export function isScheduledOn(task: Task, weekday: Weekday): boolean {
  if (!task.repeats) return true
  return task.weekdays.length === 0 || task.weekdays.includes(weekday)
}

// Readable summary of the marked days: 'Mo · We · Fr' or 'Every day'.
export function formatWeekdays(weekdays: Weekday[]): string {
  if (weekdays.length === 0) return 'Every day'

  return WEEKDAYS.filter(({ value }) => weekdays.includes(value))
    .map(({ short }) => short)
    .join(' · ')
}

// Empty and all seven days mean the same thing, so a full selection is
// normalized back to empty. Dropping to zero days is not allowed.
export function toggleWeekday(weekdays: Weekday[], day: Weekday): Weekday[] {
  const current = weekdays.length === 0 ? ALL_DAYS : weekdays
  const next = current.includes(day)
    ? current.filter((candidate) => candidate !== day)
    : [...current, day]

  if (next.length === 0) return weekdays
  if (next.length === ALL_DAYS.length) return []

  return [...next].sort((a, b) => a - b)
}

// The days the picker should render as active.
export function selectedWeekdays(weekdays: Weekday[]): Weekday[] {
  return weekdays.length === 0 ? ALL_DAYS : weekdays
}
