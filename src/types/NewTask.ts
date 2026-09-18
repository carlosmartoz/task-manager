import type { Weekday } from '@/types/Weekday'

// What it takes to create a task; `addTask` fills in the rest.
export type NewTask = {
  title: string
  repeats?: boolean
  target?: number
  weekdays?: Weekday[]
}
