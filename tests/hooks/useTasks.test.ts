import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useTasks } from '@/hooks/useTasks'

function setup(titles: string[] = []) {
  const view = renderHook(() => useTasks())

  for (const title of titles) {
    act(() => view.result.current.addTask({ title }))
  }

  return view
}

describe('useTasks', () => {
  it('añade una tarea con su meta y sus días', () => {
    const { result } = setup()

    act(() =>
      result.current.addTask({
        title: '  Beber agua  ',
        target: 8,
        weekdays: [3, 1],
      }),
    )

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0]).toMatchObject({
      title: 'Beber agua',
      target: 8,
      progress: 0,
      weekdays: [1, 3],
    })
  })

  it('ignora los títulos en blanco', () => {
    const { result } = setup()

    act(() => result.current.addTask({ title: '   ' }))

    expect(result.current.tasks).toEqual([])
  })

  it('avanza el progreso y vuelve a cero al pasar la meta', () => {
    const { result } = setup()
    act(() => result.current.addTask({ title: 'Agua', target: 2 }))
    const id = result.current.tasks[0].id

    act(() => result.current.advanceTask(id))
    expect(result.current.tasks[0].progress).toBe(1)

    act(() => result.current.advanceTask(id))
    expect(result.current.tasks[0].progress).toBe(2)

    act(() => result.current.advanceTask(id))
    expect(result.current.tasks[0].progress).toBe(0)
  })

  it('no deja el progreso por encima de una meta rebajada', () => {
    const { result } = setup()
    act(() => result.current.addTask({ title: 'Agua', target: 8 }))
    const id = result.current.tasks[0].id

    act(() => result.current.advanceTask(id))
    act(() => result.current.advanceTask(id))
    act(() => result.current.editTask(id, { target: 1 }))

    expect(result.current.tasks[0]).toMatchObject({ target: 1, progress: 1 })
  })

  it('reordena intercambiando dos tareas por id', () => {
    const { result } = setup(['Una', 'Dos', 'Tres'])
    const [, second, third] = result.current.tasks

    act(() => result.current.swapTasks(third.id, second.id))

    expect(result.current.tasks.map((task) => task.title)).toEqual([
      'Una',
      'Tres',
      'Dos',
    ])
  })

  it('devuelve la tarea eliminada a su posición original', () => {
    const { result } = setup(['Una', 'Dos', 'Tres'])
    const middle = result.current.tasks[1]

    act(() => result.current.removeTask(middle.id))
    expect(result.current.tasks.map((task) => task.title)).toEqual(['Una', 'Tres'])
    expect(result.current.pendingUndo?.task.title).toBe('Dos')

    act(() => result.current.undoRemove())
    expect(result.current.tasks.map((task) => task.title)).toEqual([
      'Una',
      'Dos',
      'Tres',
    ])
    expect(result.current.pendingUndo).toBeNull()
  })

  it('guarda el estado en localStorage', () => {
    const { result } = setup(['Persistente'])

    const raw = localStorage.getItem('daily-task-manager:v2')
    expect(raw).toContain('Persistente')
    expect(result.current.tasks).toHaveLength(1)
  })
})
