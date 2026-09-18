import { HISTORY_DAYS, MAX_TARGET, MIN_TARGET } from '@/lib/config'
import { addDays, endOfDay, getTodayKey } from '@/lib/date'
import { getWeekday, isScheduledOn } from '@/lib/weekdays'
import type { DayKey, Task, TasksState, Weekday } from '@/types'

// `done` derives from `progress`; as a field it would allow the impossible
// state "done with 3 of 8".
export function isTaskDone(task: Task): boolean {
  return task.progress >= task.target
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

  return { target: normalizeTarget(target), weekdays: [...weekdays].sort() }
}

// One gesture for the whole cycle: add one and, once the target is met, reset.
export function advanceProgress(task: Task): number {
  return isTaskDone(task) ? 0 : task.progress + 1
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

// Splits what is due today from what is not, keeping the manual order.
export function splitByWeekday(tasks: Task[], weekday: Weekday) {
  return {
    today: tasks.filter((task) => isScheduledOn(task, weekday)),
    others: tasks.filter((task) => !isScheduledOn(task, weekday)),
  }
}

// Drops the days that fall outside the history window.
export function pruneHistory(
  history: Record<DayKey, string[]>,
  today: Date = new Date(),
): Record<DayKey, string[]> {
  const oldest = getTodayKey(addDays(today, -HISTORY_DAYS))

  return Object.fromEntries(
    Object.entries(history).filter(([day]) => day >= oldest),
  )
}

// Consecutive days meeting the task, counting back from today. Days it was not
// due are skipped, and today never breaks it: there is still time.
export function computeStreak(
  task: Task,
  history: Record<DayKey, string[]>,
  today: Date = new Date(),
): number {
  // A one-off is done once: there is no chain of days to count.
  if (!task.repeats) return 0

  let streak = 0

  for (let offset = 0; offset < HISTORY_DAYS; offset++) {
    const date = addDays(today, -offset)
    if (task.createdAt > endOfDay(date)) break
    if (!isScheduledOn(task, getWeekday(date))) continue

    const completed =
      offset === 0
        ? isTaskDone(task)
        : (history[getTodayKey(date)] ?? []).includes(task.id)

    if (completed) {
      streak++
      continue
    }

    if (offset === 0) continue
    break
  }

  return streak
}

// Consecutive days completing every task that was due. The past is rebuilt from
// today's tasks: a deleted one no longer counts backwards.
export function computeGlobalStreak(
  tasks: Task[],
  history: Record<DayKey, string[]>,
  today: Date = new Date(),
): number {
  let streak = 0

  for (let offset = 0; offset < HISTORY_DAYS; offset++) {
    const date = addDays(today, -offset)
    const limit = endOfDay(date)
    const weekday = getWeekday(date)

    const due = tasks.filter(
      (task) =>
        task.repeats && task.createdAt <= limit && isScheduledOn(task, weekday),
    )
    if (due.length === 0) continue

    const completedIds = history[getTodayKey(date)] ?? []
    const allDone =
      offset === 0
        ? due.every(isTaskDone)
        : due.every((task) => completedIds.includes(task.id))

    if (allDone) {
      streak++
      continue
    }

    if (offset === 0) continue
    break
  }

  return streak
}

// On a day change what was met is archived and progress resets. If the day has
// not changed it returns the same object, to avoid extra renders.
export function applyDailyReset(
  state: TasksState,
  today: Date = new Date(),
): TasksState {
  const todayKey = getTodayKey(today)
  if (state.lastResetDate === todayKey) return state

  const completedIds = state.tasks
    .filter((task) => task.repeats && isTaskDone(task))
    .map((task) => task.id)

  return {
    // A one-off that was met is finished: it does not come back tomorrow.
    tasks: state.tasks
      .filter((task) => task.repeats || !isTaskDone(task))
      .map((task) => ({ ...task, progress: 0 })),
    lastResetDate: todayKey,
    history: pruneHistory(
      { ...state.history, [state.lastResetDate]: completedIds },
      today,
    ),
  }
}
