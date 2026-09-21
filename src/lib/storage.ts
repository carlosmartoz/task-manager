import {
  BACKUP_VERSION,
  LEGACY_KEY,
  MIN_TARGET,
  STORAGE_KEY,
} from '@/lib/config'
import { getTodayKey, isDayKey } from '@/lib/date'
import { clamp, pruneHistory, scheduleOf } from '@/lib/tasks'
import { sortWeekdays } from '@/lib/weekdays'
import type { Task, TaskHistory, TasksState, Weekday } from '@/types'

function emptyState(): TasksState {
  return { tasks: [], lastResetDate: getTodayKey(), history: {} }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function sanitizeWeekdays(value: unknown): Weekday[] {
  if (!Array.isArray(value)) return []

  return sortWeekdays(
    value.filter(
      (day): day is Weekday => Number.isInteger(day) && day >= 0 && day <= 6,
    ),
  )
}

// Returns `null` when the value cannot be recovered as a task.
function sanitizeTask(value: unknown): Task | null {
  if (!isRecord(value)) return null

  const title = typeof value.title === 'string' ? value.title.trim() : ''
  if (!title) return null

  // Anything stored before one-off tasks existed was a habit.
  const repeats = value.repeats !== false
  // The same rule as creating and editing, so a one-off loses its schedule here too.
  const { target, weekdays } = scheduleOf(
    repeats,
    typeof value.target === 'number' ? value.target : MIN_TARGET,
    sanitizeWeekdays(value.weekdays),
  )

  // v1 format: `done: boolean` instead of `progress`.
  const rawProgress =
    typeof value.progress === 'number'
      ? value.progress
      : value.done === true
        ? target
        : 0

  return {
    id: typeof value.id === 'string' && value.id ? value.id : crypto.randomUUID(),
    title,
    repeats,
    target,
    // Clamped against the final target, which a one-off lowers to 1.
    progress: clamp(Math.round(rawProgress) || 0, 0, target),
    weekdays,
    createdAt: typeof value.createdAt === 'number' ? value.createdAt : Date.now(),
  }
}

function sanitizeHistory(value: unknown): TaskHistory {
  if (!isRecord(value)) return {}

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string[]] =>
      isDayKey(entry[0]) &&
      Array.isArray(entry[1]) &&
      entry[1].every((id) => typeof id === 'string'),
  )

  return pruneHistory(Object.fromEntries(entries))
}

// Accepts both the v2 format and v1, which had no targets and no history.
export function sanitizeState(value: unknown): TasksState {
  if (!isRecord(value)) return emptyState()

  const source = isRecord(value.data) ? value.data : value
  if (!Array.isArray(source.tasks)) return emptyState()

  return {
    tasks: source.tasks
      .map(sanitizeTask)
      .filter((task): task is Task => task !== null),
    // A malformed date would be archived as a history key that is never pruned.
    lastResetDate: isDayKey(source.lastResetDate)
      ? source.lastResetDate
      : getTodayKey(),
    history: sanitizeHistory(source.history),
  }
}

export function loadState(): TasksState {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY)
    if (!raw) return emptyState()

    return sanitizeState(JSON.parse(raw))
  } catch {
    return emptyState()
  }
}

export function saveState(state: TasksState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or disabled: the session carries on in memory.
  }
}

export function serializeBackup(state: TasksState): string {
  const backup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: state,
  }

  return JSON.stringify(backup, null, 2)
}

// Throws a readable error when the file is not a valid backup.
export function parseBackup(text: string): TasksState {
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('The file is not valid JSON.')
  }

  const hasTasks =
    isRecord(parsed) &&
    (Array.isArray(parsed.tasks) ||
      (isRecord(parsed.data) && Array.isArray(parsed.data.tasks)))

  if (!hasTasks) {
    throw new Error('The file does not contain a task list.')
  }

  return sanitizeState(parsed)
}

export function backupFilename(date: Date = new Date()): string {
  return `tasks-${getTodayKey(date)}.json`
}
