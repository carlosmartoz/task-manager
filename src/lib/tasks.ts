import { MAX_TARGET, MIN_TARGET } from '@/lib/config'
import { currentDay, getTodayKey } from '@/lib/date'
import { isScheduledOn, sortWeekdays } from '@/lib/weekdays'
import type { NewTask, Task, TaskPatch, TasksState, Weekday } from '@/types'

// `done` derives from `progress`; as a field it would allow the impossible
// state "done with 3 of 8".
export function isTaskDone(task: Task): boolean {
  return task.progress >= task.target
}

export function countDone(tasks: Task[]): number {
  return tasks.filter(isTaskDone).length
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function normalizeTarget(value: number): number {
  if (!Number.isFinite(value)) return MIN_TARGET
  return clamp(Math.round(value), MIN_TARGET, MAX_TARGET)
}

// A one-off carries no schedule and no counter: both belong to a habit.
export function scheduleOf(
  repeats: boolean,
  target: number,
  weekdays: Weekday[],
): { target: number; weekdays: Weekday[] } {
  if (!repeats) return { target: MIN_TARGET, weekdays: [] }

  return { target: normalizeTarget(target), weekdays: sortWeekdays(weekdays) }
}

// `null` when the title is blank: there is nothing to create.
export function createTask(
  { title, repeats = true, target = MIN_TARGET, weekdays = [] }: NewTask,
  id: string = crypto.randomUUID(),
  now: number = Date.now(),
): Task | null {
  const trimmed = title.trim()
  if (!trimmed) return null

  return {
    id,
    title: trimmed,
    repeats,
    ...scheduleOf(repeats, target, weekdays),
    progress: 0,
    createdAt: now,
  }
}

// A blank title leaves the task as it was.
export function patchTask(task: Task, patch: TaskPatch): Task {
  const title = patch.title?.trim() ?? task.title
  if (!title) return task

  const repeats = patch.repeats ?? task.repeats
  const { target, weekdays } = scheduleOf(
    repeats,
    patch.target ?? task.target,
    patch.weekdays ?? task.weekdays,
  )

  return {
    ...task,
    title,
    repeats,
    target,
    weekdays,
    // Lowering the target must not leave progress above it.
    progress: clamp(task.progress, 0, target),
  }
}

// One gesture for the whole cycle: add one and, once the target is met, reset.
export function advanceProgress(task: Task): number {
  return isTaskDone(task) ? 0 : task.progress + 1
}

export function decrementProgress(task: Task): number {
  return Math.max(task.progress - 1, 0)
}

export function progressPercent(task: Task): number {
  return Math.round((task.progress / task.target) * 100)
}

// Returns the same array when the move changes nothing.
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const outOfRange = from < 0 || to < 0 || from >= items.length || to >= items.length
  if (from === to || outOfRange) return items

  const result = [...items]
  const [moved] = result.splice(from, 1)
  result.splice(to, 0, moved)
  return result
}

// The three lists on screen, each keeping the manual order. A one-off is always
// due, so it never lands in `others`.
export function groupForToday(tasks: Task[], weekday: Weekday) {
  const due = tasks.filter((task) => isScheduledOn(task, weekday))

  return {
    habits: due.filter((task) => task.repeats),
    oneOffs: due.filter((task) => !task.repeats),
    others: tasks.filter((task) => !isScheduledOn(task, weekday)),
  }
}

// On a day change progress resets. If the day has not changed it returns the
// same object, to avoid extra renders.
export function applyDailyReset(
  state: TasksState,
  today: Date = currentDay(),
): TasksState {
  const todayKey = getTodayKey(today)
  if (state.lastResetDate === todayKey) return state

  return {
    // A one-off that was met is finished: it does not come back tomorrow.
    tasks: state.tasks
      .filter((task) => task.repeats || !isTaskDone(task))
      .map((task) => ({ ...task, progress: 0 })),
    lastResetDate: todayKey,
  }
}
