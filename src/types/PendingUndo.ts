import type { Task } from '@/types/Task'

// A deleted task that can still be restored, with its original position.
export type PendingUndo = {
  task: Task
  index: number
}
