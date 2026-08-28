/** Día de la semana: 0 = domingo … 6 = sábado, igual que `Date.getDay()`. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Fecha en formato 'YYYY-MM-DD' y hora local. */
export type DayKey = string

export type Task = {
  id: string
  title: string
  /** Repeticiones necesarias para darla por hecha. 1 = tarea simple. */
  target: number
  /** Repeticiones acumuladas hoy, entre 0 y `target`. */
  progress: number
  /** Días en que toca. Vacío = todos los días. */
  weekdays: Weekday[]
  createdAt: number
}

export type TasksState = {
  /** El orden del array es el orden en que se muestran. */
  tasks: Task[]
  lastResetDate: DayKey
  /** Día → ids de las tareas completadas ese día. */
  history: Record<DayKey, string[]>
}

export const MIN_TARGET = 1
export const MAX_TARGET = 99

/** Días de historial que se conservan; más allá no aporta y engorda `localStorage`. */
export const HISTORY_DAYS = 180
