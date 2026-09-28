import type { DayKey } from '@/types/DayKey'
import type { Task } from '@/types/Task'
import type { TasksState } from '@/types/TasksState'

// What the undo notice can still bring back: a deleted task, with its original
// position and the day it was deleted on, or the whole state an import replaced.
export type PendingUndo =
  | { kind: 'remove'; task: Task; index: number; day: DayKey }
  | { kind: 'import'; previous: TasksState }
