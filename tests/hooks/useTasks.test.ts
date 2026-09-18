import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useTasks } from '@/hooks/useTasks'
import { STORAGE_KEY } from '@/lib/config'

function setup(titles: string[] = []) {
  const view = renderHook(() => useTasks())

  for (const title of titles) {
    act(() => view.result.current.addTask({ title }))
  }

  return view
}

describe('useTasks', () => {
  it('adds a task with its target and its days', () => {
    const { result } = setup()

    act(() =>
      result.current.addTask({
        title: '  Beber agua  ',
        target: 8,
        weekdays: [3, 1],
      }),
    )

    expect(result.current.state.tasks).toHaveLength(1)
    expect(result.current.state.tasks[0]).toMatchObject({
      title: 'Beber agua',
      target: 8,
      progress: 0,
      weekdays: [1, 3],
    })
  })

  it('adds a one-off without target or days, whatever is passed in', () => {
    const { result } = setup()

    act(() =>
      result.current.addTask({
        title: 'Renovar el DNI',
        repeats: false,
        target: 8,
        weekdays: [1, 3],
      }),
    )

    expect(result.current.state.tasks[0]).toMatchObject({
      repeats: false,
      target: 1,
      weekdays: [],
    })
  })

  it('turning a task into a one-off clears its target and its days', () => {
    const { result } = setup()
    act(() =>
      result.current.addTask({ title: 'Agua', target: 8, weekdays: [1, 3] }),
    )
    const id = result.current.state.tasks[0].id

    act(() => result.current.editTask(id, { repeats: false }))

    expect(result.current.state.tasks[0]).toMatchObject({
      repeats: false,
      target: 1,
      weekdays: [],
      progress: 0,
    })
  })

  it('ignores blank titles', () => {
    const { result } = setup()

    act(() => result.current.addTask({ title: '   ' }))

    expect(result.current.state.tasks).toEqual([])
  })

  it('advances progress and resets to zero past the target', () => {
    const { result } = setup()
    act(() => result.current.addTask({ title: 'Agua', target: 2 }))
    const id = result.current.state.tasks[0].id

    act(() => result.current.advanceTask(id))
    expect(result.current.state.tasks[0].progress).toBe(1)

    act(() => result.current.advanceTask(id))
    expect(result.current.state.tasks[0].progress).toBe(2)

    act(() => result.current.advanceTask(id))
    expect(result.current.state.tasks[0].progress).toBe(0)
  })

  it('never leaves progress above a lowered target', () => {
    const { result } = setup()
    act(() => result.current.addTask({ title: 'Agua', target: 8 }))
    const id = result.current.state.tasks[0].id

    act(() => result.current.advanceTask(id))
    act(() => result.current.advanceTask(id))
    act(() => result.current.editTask(id, { target: 1 }))

    expect(result.current.state.tasks[0]).toMatchObject({ target: 1, progress: 1 })
  })

  it('reorders by swapping two tasks by id', () => {
    const { result } = setup(['Una', 'Dos', 'Tres'])
    const [, second, third] = result.current.state.tasks

    act(() => result.current.swapTasks(third.id, second.id))

    expect(result.current.state.tasks.map((task) => task.title)).toEqual([
      'Una',
      'Tres',
      'Dos',
    ])
  })

  it('returns a deleted task to its original position', () => {
    const { result } = setup(['Una', 'Dos', 'Tres'])
    const middle = result.current.state.tasks[1]

    act(() => result.current.removeTask(middle.id))
    expect(result.current.state.tasks.map((task) => task.title)).toEqual(['Una', 'Tres'])
    expect(result.current.pendingUndo?.task.title).toBe('Dos')

    act(() => result.current.undoRemove())
    expect(result.current.state.tasks.map((task) => task.title)).toEqual([
      'Una',
      'Dos',
      'Tres',
    ])
    expect(result.current.pendingUndo).toBeNull()
  })

  it('saves the state to localStorage', () => {
    const { result } = setup(['Persistente'])

    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).toContain('Persistente')
    expect(result.current.state.tasks).toHaveLength(1)
  })
})
