import type { DayKey } from '@/types/DayKey'
import type { Task } from '@/types/Task'

export type TasksState = {
  // Array order is display order.
  tasks: Task[]
  lastResetDate: DayKey
  // Day → ids of the tasks completed that day.
  history: Record<DayKey, string[]>
}
