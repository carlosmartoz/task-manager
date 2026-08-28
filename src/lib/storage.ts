import { getTodayKey } from '@/lib/date'
import { normalizeTarget, pruneHistory } from '@/lib/tasks'
import type { DayKey, Task, TasksState, Weekday } from '@/types/task'

const STORAGE_KEY = 'daily-task-manager:v2'
const LEGACY_KEY = 'daily-task-manager:v1'

/** Versión del formato exportado; sube al cambiar la forma de `TasksState`. */
export const BACKUP_VERSION = 2

export function emptyState(): TasksState {
  return { tasks: [], lastResetDate: getTodayKey(), history: {} }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function sanitizeWeekdays(value: unknown): Weekday[] {
  if (!Array.isArray(value)) return []

  const days = value
    .filter((day): day is number => Number.isInteger(day) && day >= 0 && day <= 6)
    .map((day) => day as Weekday)

  return [...new Set(days)].sort()
}

/** Devuelve `null` si el objeto no es recuperable como tarea. */
function sanitizeTask(value: unknown): Task | null {
  if (!isRecord(value)) return null

  const title = typeof value.title === 'string' ? value.title.trim() : ''
  if (!title) return null

  const target = normalizeTarget(
    typeof value.target === 'number' ? value.target : 1,
  )

  // Formato v1: `done: boolean` en lugar de `progress`.
  const rawProgress =
    typeof value.progress === 'number'
      ? value.progress
      : value.done === true
        ? target
        : 0

  return {
    id: typeof value.id === 'string' && value.id ? value.id : crypto.randomUUID(),
    title,
    target,
    progress: Math.min(Math.max(Math.round(rawProgress) || 0, 0), target),
    weekdays: sanitizeWeekdays(value.weekdays),
    createdAt:
      typeof value.createdAt === 'number' ? value.createdAt : Date.now(),
  }
}

function sanitizeHistory(value: unknown): Record<DayKey, string[]> {
  if (!isRecord(value)) return {}

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string[]] =>
      /^\d{4}-\d{2}-\d{2}$/.test(entry[0]) &&
      Array.isArray(entry[1]) &&
      entry[1].every((id) => typeof id === 'string'),
  )

  return pruneHistory(Object.fromEntries(entries))
}

/** Acepta tanto el formato v2 como el v1, que no tenía metas ni historial. */
export function sanitizeState(value: unknown): TasksState {
  if (!isRecord(value)) return emptyState()

  const source = isRecord(value.data) ? value.data : value
  if (!Array.isArray(source.tasks)) return emptyState()

  return {
    tasks: source.tasks
      .map(sanitizeTask)
      .filter((task): task is Task => task !== null),
    lastResetDate:
      typeof source.lastResetDate === 'string'
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
    // localStorage lleno o deshabilitado: la sesión sigue funcionando en memoria.
  }
}

export function serializeBackup(state: TasksState): string {
  return JSON.stringify(
    { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data: state },
    null,
    2,
  )
}

/** Lanza un error con mensaje legible si el archivo no es un respaldo válido. */
export function parseBackup(text: string): TasksState {
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('El archivo no es un JSON válido.')
  }

  const state = sanitizeState(parsed)
  const hasTasks = isRecord(parsed) && (
    Array.isArray(parsed.tasks) ||
    (isRecord(parsed.data) && Array.isArray(parsed.data.tasks))
  )

  if (!hasTasks) {
    throw new Error('El archivo no contiene una lista de tareas.')
  }

  return state
}

export function backupFilename(date: Date = new Date()): string {
  return `tareas-${getTodayKey(date)}.json`
}
