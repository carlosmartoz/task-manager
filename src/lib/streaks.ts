import { HISTORY_DAYS, STREAK_MONTH, STREAK_WEEK } from '@/lib/config'
import { addDays, endOfDay, getTodayKey } from '@/lib/date'
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

// Today is read from the live progress; past days, from the archive.
function isMetOn(
  task: Task,
  history: TaskHistory,
  date: Date,
  isToday: boolean,
): boolean {
  if (isToday) return isTaskDone(task)
  return (history[getTodayKey(date)] ?? []).includes(task.id)
}

// Walks back from today counting met days. A skipped day neither counts nor
// breaks the chain, and today never breaks it: there is still time.
function countStreak(
  today: Date,
  outcomeOn: (date: Date, isToday: boolean) => DayOutcome,
): number {
  let streak = 0

  for (let offset = 0; offset < HISTORY_DAYS; offset++) {
    const outcome = outcomeOn(addDays(today, -offset), offset === 0)

    if (outcome === 'met') streak++
    else if (outcome === 'missed' && offset > 0) break
  }

  return streak
}

// Consecutive days meeting the task. Days it was not due are skipped.
export function computeStreak(
  task: Task,
  history: TaskHistory,
  today: Date = new Date(),
): number {
  return countStreak(today, (date, isToday) => {
    if (!isDueOn(task, date)) return 'skipped'
    return isMetOn(task, history, date, isToday) ? 'met' : 'missed'
  })
}

// Consecutive days completing every task that was due. The past is rebuilt from
// today's tasks: a deleted one no longer counts backwards.
export function computeGlobalStreak(
  tasks: Task[],
  history: TaskHistory,
  today: Date = new Date(),
): number {
  return countStreak(today, (date, isToday) => {
    const due = tasks.filter((task) => isDueOn(task, date))
    if (due.length === 0) return 'skipped'

    const allMet = due.every((task) => isMetOn(task, history, date, isToday))
    return allMet ? 'met' : 'missed'
  })
}

// How much a streak stands out: none, just started, a week or a month.
export function streakTier(streak: number): StreakTier {
  if (streak <= 0) return 'none'
  if (streak < STREAK_WEEK) return 'started'
  if (streak < STREAK_MONTH) return 'week'
  return 'month'
}
