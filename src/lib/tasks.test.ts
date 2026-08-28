import { describe, expect, it } from 'vitest'

import {
  advanceProgress,
  applyDailyReset,
  computeStreak,
  isScheduledOn,
  isTaskDone,
  moveItem,
  normalizeTarget,
  pruneHistory,
} from '@/lib/tasks'
import type { Task, TasksState } from '@/types/task'

// 8 de enero de 2024 fue lunes; el resto de fechas se derivan de esa.
const MONDAY = new Date(2024, 0, 8)

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Beber agua',
    target: 1,
    progress: 0,
    weekdays: [],
    createdAt: new Date(2023, 0, 1).getTime(),
    ...overrides,
  }
}

function makeState(overrides: Partial<TasksState> = {}): TasksState {
  return { tasks: [], lastResetDate: '2024-01-08', history: {}, ...overrides }
}

describe('isTaskDone', () => {
  it('se cumple al alcanzar la meta', () => {
    expect(isTaskDone(makeTask({ target: 8, progress: 7 }))).toBe(false)
    expect(isTaskDone(makeTask({ target: 8, progress: 8 }))).toBe(true)
  })
})

describe('advanceProgress', () => {
  it('suma una repetición hasta la meta y luego vuelve a cero', () => {
    expect(advanceProgress(makeTask({ target: 3, progress: 0 }))).toBe(1)
    expect(advanceProgress(makeTask({ target: 3, progress: 2 }))).toBe(3)
    expect(advanceProgress(makeTask({ target: 3, progress: 3 }))).toBe(0)
  })

  it('con meta 1 se comporta como un checkbox', () => {
    expect(advanceProgress(makeTask({ target: 1, progress: 0 }))).toBe(1)
    expect(advanceProgress(makeTask({ target: 1, progress: 1 }))).toBe(0)
  })
})

describe('normalizeTarget', () => {
  it('recorta al rango permitido y redondea', () => {
    expect(normalizeTarget(0)).toBe(1)
    expect(normalizeTarget(-5)).toBe(1)
    expect(normalizeTarget(1000)).toBe(99)
    expect(normalizeTarget(3.6)).toBe(4)
    expect(normalizeTarget(Number.NaN)).toBe(1)
  })
})

describe('isScheduledOn', () => {
  it('sin días marcados toca todos los días', () => {
    const task = makeTask({ weekdays: [] })
    expect(isScheduledOn(task, 0)).toBe(true)
    expect(isScheduledOn(task, 3)).toBe(true)
  })

  it('con días marcados solo toca esos', () => {
    const task = makeTask({ weekdays: [1, 3] })
    expect(isScheduledOn(task, 1)).toBe(true)
    expect(isScheduledOn(task, 2)).toBe(false)
  })
})

describe('moveItem', () => {
  it('mueve el elemento a la nueva posición', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c'])
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })

  it('devuelve el mismo array si el destino no existe', () => {
    const items = ['a', 'b']
    expect(moveItem(items, 0, -1)).toBe(items)
    expect(moveItem(items, 1, 2)).toBe(items)
  })
})

describe('pruneHistory', () => {
  it('descarta los días fuera de la ventana', () => {
    const history = { '2024-01-07': ['task-1'], '2020-01-01': ['task-1'] }
    expect(pruneHistory(history, MONDAY)).toEqual({ '2024-01-07': ['task-1'] })
  })
})

describe('applyDailyReset', () => {
  it('no toca nada si sigue siendo el mismo día', () => {
    const state = makeState({ tasks: [makeTask({ progress: 1 })] })
    expect(applyDailyReset(state, MONDAY)).toBe(state)
  })

  it('archiva lo cumplido y pone el progreso a cero', () => {
    const state = makeState({
      lastResetDate: '2024-01-07',
      tasks: [
        makeTask({ id: 'hecha', target: 2, progress: 2 }),
        makeTask({ id: 'a-medias', target: 2, progress: 1 }),
      ],
    })

    const next = applyDailyReset(state, MONDAY)

    expect(next.lastResetDate).toBe('2024-01-08')
    expect(next.tasks.map((task) => task.progress)).toEqual([0, 0])
    expect(next.history['2024-01-07']).toEqual(['hecha'])
  })
})

describe('computeStreak', () => {
  it('cuenta los días consecutivos cumplidos hacia atrás', () => {
    const task = makeTask({ progress: 1 })
    const history = { '2024-01-07': ['task-1'], '2024-01-06': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(3)
  })

  it('el día en curso sin completar no rompe la racha', () => {
    const task = makeTask({ progress: 0 })
    const history = { '2024-01-07': ['task-1'], '2024-01-06': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(2)
  })

  it('un día perdido la corta', () => {
    const task = makeTask({ progress: 1 })
    const history = { '2024-01-07': ['task-1'], '2024-01-05': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(2)
  })

  it('los días en que no tocaba se saltan sin romperla', () => {
    const task = makeTask({ weekdays: [1], progress: 1 })
    const history = { '2024-01-01': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(2)
  })

  it('no cuenta días anteriores a la creación de la tarea', () => {
    const task = makeTask({ progress: 1, createdAt: new Date(2024, 0, 8).getTime() })

    expect(computeStreak(task, {}, MONDAY)).toBe(1)
  })
})
