import type { Weekday } from '@/types/Weekday'

export type Task = {
  id: string
  title: string
  // A habit that comes back every day; `false` is a one-off, done once and gone.
  repeats: boolean
  // Repetitions needed to count it as done. 1 = a plain task.
  target: number
  // Repetitions logged today, between 0 and `target`.
  progress: number
  // Days the task is due. Empty = every day.
  weekdays: Weekday[]
  createdAt: number
}
