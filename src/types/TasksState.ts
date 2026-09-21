import type { DayKey } from '@/types/DayKey'
import type { Task } from '@/types/Task'
import type { TaskHistory } from '@/types/TaskHistory'

export type TasksState = {
  // Array order is display order.
  tasks: Task[]
  lastResetDate: DayKey
  history: TaskHistory
}
