import type { Weekday } from '@/types/Weekday'

// Editable fields of a task. Whatever is missing stays as it was.
export type TaskPatch = {
  title?: string
  repeats?: boolean
  target?: number
  weekdays?: Weekday[]
}
