import { addDays, endOfDay, getTodayKey, getWeekday } from '@/lib/date'
import {
  HISTORY_DAYS,
  MAX_TARGET,
  MIN_TARGET,
  type DayKey,
  type Task,
  type TasksState,
  type Weekday,
} from '@/types/task'

/**
 * `done` no se almacena: se deriva de `progress`. Guardarlo como campo aparte
 * permitiría el estado imposible «completada con 3 de 8».
 */
export function isTaskDone(task: Task): boolean {
  return task.progress >= task.target
}

/** Una tarea sin días marcados toca todos los días. */
export function isScheduledOn(task: Task, weekday: Weekday): boolean {
  return task.weekdays.length === 0 || task.weekdays.includes(weekday)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function normalizeTarget(value: number): number {
  if (!Number.isFinite(value)) return MIN_TARGET
  return clamp(Math.round(value), MIN_TARGET, MAX_TARGET)
}

/**
 * Un único gesto para todo el ciclo: suma una repetición y, una vez alcanzada
 * la meta, el siguiente avance vuelve a cero. Con `target: 1` equivale a
 * marcar y desmarcar un checkbox.
 */
export function advanceProgress(task: Task): number {
  return isTaskDone(task) ? 0 : task.progress + 1
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items
  }

  const result = [...items]
  const [moved] = result.splice(from, 1)
  result.splice(to, 0, moved)
  return result
}

/** Descarta los días que ya caen fuera de la ventana de historial. */
export function pruneHistory(
  history: Record<DayKey, string[]>,
  today: Date = new Date(),
): Record<DayKey, string[]> {
  const oldest = getTodayKey(addDays(today, -HISTORY_DAYS))

  return Object.fromEntries(
    Object.entries(history).filter(([day]) => day >= oldest),
  )
}

/**
 * Días consecutivos cumpliendo la tarea, hacia atrás desde hoy. Los días en que
 * no tocaba se saltan sin romperla, y el día en curso tampoco la rompe mientras
 * siga sin completarse: aún hay tiempo.
 */
export function computeStreak(
  task: Task,
  history: Record<DayKey, string[]>,
  today: Date = new Date(),
): number {
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

/**
 * Días consecutivos completando *todas* las tareas que tocaban. Para los días
 * pasados se reconstruye con las tareas que existen hoy: una tarea eliminada ya
 * no cuenta hacia atrás.
 */
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
      (task) => task.createdAt <= limit && isScheduledOn(task, weekday),
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

/**
 * Las tareas son recurrentes: se conservan de un día para otro, pero al cambiar
 * el día se archiva lo cumplido y el progreso vuelve a cero. Devuelve el mismo
 * objeto si no ha cambiado el día, para no provocar renderizados de más.
 */
export function applyDailyReset(
  state: TasksState,
  today: Date = new Date(),
): TasksState {
  const todayKey = getTodayKey(today)
  if (state.lastResetDate === todayKey) return state

  const completedIds = state.tasks.filter(isTaskDone).map((task) => task.id)

  return {
    tasks: state.tasks.map((task) => ({ ...task, progress: 0 })),
    lastResetDate: todayKey,
    history: pruneHistory(
      { ...state.history, [state.lastResetDate]: completedIds },
      today,
    ),
  }
}
