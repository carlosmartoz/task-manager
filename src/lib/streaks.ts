import { HISTORY_DAYS, STREAK_MONTH, STREAK_WEEK } from '@/lib/config'
import { addDays, currentDay, endOfDay, getTodayKey } from '@/lib/date'
import { isTaskDone } from '@/lib/tasks'
import { getWeekday, isScheduledOn } from '@/lib/weekdays'
import type { StreakTier, Task, TaskHistory } from '@/types'

type DayOutcome = 'met' | 'missed' | 'skipped'

// Only a habit has a chain of days, and only from the day it was created.
function isDueOn(task: Task, date: Date): boolean {
  return (
    task.repeats &&
    task.createdAt <= endOfDay(date) &&
    isScheduledOn(task, getWeekday(date))
  )
}

function isArchivedOn(task: Task, archive: TaskHistory, date: Date): boolean {
  return (archive[getTodayKey(date)] ?? []).includes(task.id)
}

// A day the task was not due, or was skipped, neither counts nor breaks it.
// Today is read from the live task; past days, from the archive.
function outcomeOn(
  task: Task,
  history: TaskHistory,
  skipHistory: TaskHistory,
  date: Date,
  isToday: boolean,
): DayOutcome {
  if (!isDueOn(task, date)) return 'skipped'

  const skipped = isToday ? task.skipped : isArchivedOn(task, skipHistory, date)
  if (skipped) return 'skipped'

  const met = isToday ? isTaskDone(task) : isArchivedOn(task, history, date)
  return met ? 'met' : 'missed'
}

// Walks back from today counting met days. A skipped day neither counts nor
// breaks the chain, and today never breaks it: there is still time.
function countStreak(
  today: Date,
  outcomeOnDay: (date: Date, isToday: boolean) => DayOutcome,
): number {
  let streak = 0

  for (let offset = 0; offset < HISTORY_DAYS; offset++) {
    const outcome = outcomeOnDay(addDays(today, -offset), offset === 0)

    if (outcome === 'met') streak++
    else if (outcome === 'missed' && offset > 0) break
  }

  return streak
}

// Consecutive days meeting the task. Days it was not due or was skipped are
// passed over.
export function computeStreak(
  task: Task,
  history: TaskHistory,
  skipHistory: TaskHistory,
  today: Date = currentDay(),
): number {
  return countStreak(today, (date, isToday) =>
    outcomeOn(task, history, skipHistory, date, isToday),
  )
}

// Consecutive days completing every task that was due and not skipped. The
// past is rebuilt from today's tasks: a deleted one no longer counts backwards.
export function computeGlobalStreak(
  tasks: Task[],
  history: TaskHistory,
  skipHistory: TaskHistory,
  today: Date = currentDay(),
): number {
  return countStreak(today, (date, isToday) => {
    const outcomes = tasks.map((task) =>
      outcomeOn(task, history, skipHistory, date, isToday),
    )

    if (outcomes.includes('missed')) return 'missed'
    return outcomes.includes('met') ? 'met' : 'skipped'
  })
}

// How much a streak stands out: none, just started, a week or a month.
export function streakTier(streak: number): StreakTier {
  if (streak <= 0) return 'none'
  if (streak < STREAK_WEEK) return 'started'
  if (streak < STREAK_MONTH) return 'week'
  return 'month'
}
