import { describe, expect, it } from 'vitest'

import { getTodayKey } from '@/lib/date'
import { parseBackup, sanitizeState, serializeBackup } from '@/lib/storage'
import type { TasksState } from '@/types/task'

const TODAY = getTodayKey()

describe('sanitizeState', () => {
  it('migra el formato v1, que guardaba `done` en vez de `progress`', () => {
    const v1 = {
      lastResetDate: '2024-01-08',
      tasks: [
        { id: 'a', title: 'Hecha', done: true, createdAt: 1 },
        { id: 'b', title: 'Pendiente', done: false, createdAt: 2 },
      ],
    }

    const state = sanitizeState(v1)

    expect(state.tasks).toEqual([
      { id: 'a', title: 'Hecha', target: 1, progress: 1, weekdays: [], createdAt: 1 },
      { id: 'b', title: 'Pendiente', target: 1, progress: 0, weekdays: [], createdAt: 2 },
    ])
  })

  it('descarta las tareas sin título utilizable', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: '   ' }, { id: 'b' }, { id: 'c', title: 'Válida' }],
    })

    expect(state.tasks.map((task) => task.title)).toEqual(['Válida'])
  })

  it('recorta el progreso que exceda la meta y las metas fuera de rango', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: 'Agua', target: 500, progress: 900 }],
    })

    expect(state.tasks[0].target).toBe(99)
    expect(state.tasks[0].progress).toBe(99)
  })

  it('ignora días de la semana inválidos y quita duplicados', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: 'Gym', weekdays: [1, 1, 9, -2, 'lunes', 3] }],
    })

    expect(state.tasks[0].weekdays).toEqual([1, 3])
  })

  it('devuelve un estado vacío ante datos irreconocibles', () => {
    expect(sanitizeState(null).tasks).toEqual([])
    expect(sanitizeState({ tasks: 'nope' }).tasks).toEqual([])
  })

  it('conserva el historial con claves de fecha válidas', () => {
    const state = sanitizeState({ tasks: [], history: { [TODAY]: ['a'], nope: ['b'] } })

    expect(state.history).toEqual({ [TODAY]: ['a'] })
  })
})

describe('parseBackup', () => {
  const state: TasksState = {
    tasks: [
      {
        id: 'a',
        title: 'Agua',
        target: 8,
        progress: 3,
        weekdays: [1, 5],
        createdAt: 1,
      },
    ],
    lastResetDate: TODAY,
    history: { [TODAY]: ['a'] },
  }

  it('recupera un respaldo generado por la propia app', () => {
    expect(parseBackup(serializeBackup(state))).toEqual(state)
  })

  it('acepta también el estado sin envoltorio', () => {
    expect(parseBackup(JSON.stringify(state))).toEqual(state)
  })

  it('rechaza un archivo que no es JSON', () => {
    expect(() => parseBackup('esto no es json')).toThrow('JSON válido')
  })

  it('rechaza un JSON sin lista de tareas', () => {
    expect(() => parseBackup('{"otra":"cosa"}')).toThrow('lista de tareas')
  })
})
