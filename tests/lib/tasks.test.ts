import { describe, expect, it } from 'vitest'

import {
  advanceProgress,
  applyDailyReset,
  countDone,
  createTask,
  decrementProgress,
  groupForToday,
  isTaskDone,
  moveItem,
  normalizeTarget,
  patchTask,
  scheduleOf,
} from '@/lib/tasks'
import type { Task, TasksState } from '@/types'

// 8 January 2024 was a Monday; every other date derives from it.
const MONDAY = new Date(2024, 0, 8)

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Drink water',
    repeats: true,
    target: 1,
    progress: 0,
    weekdays: [],
    createdAt: new Date(2023, 0, 1).getTime(),
    ...overrides,
  }
}

function makeState(overrides: Partial<TasksState> = {}): TasksState {
  return {
    tasks: [],
    lastResetDate: '2024-01-08',
    ...overrides,
  }
}

describe('isTaskDone', () => {
  it('is met once the target is reached', () => {
    expect(isTaskDone(makeTask({ target: 8, progress: 7 }))).toBe(false)
    expect(isTaskDone(makeTask({ target: 8, progress: 8 }))).toBe(true)
  })
})

describe('countDone', () => {
  it('counts only the tasks that met their target', () => {
    const tasks = [
      makeTask({ target: 2, progress: 2 }),
      makeTask({ target: 2, progress: 1 }),
      makeTask({ target: 1, progress: 1 }),
    ]

    expect(countDone(tasks)).toBe(2)
  })
})

describe('advanceProgress', () => {
  it('adds one repetition up to the target, then resets to zero', () => {
    expect(advanceProgress(makeTask({ target: 3, progress: 0 }))).toBe(1)
    expect(advanceProgress(makeTask({ target: 3, progress: 2 }))).toBe(3)
    expect(advanceProgress(makeTask({ target: 3, progress: 3 }))).toBe(0)
  })

  it('behaves like a checkbox when the target is 1', () => {
    expect(advanceProgress(makeTask({ target: 1, progress: 0 }))).toBe(1)
    expect(advanceProgress(makeTask({ target: 1, progress: 1 }))).toBe(0)
  })
})

describe('decrementProgress', () => {
  it('subtracts one and never goes below zero', () => {
    expect(decrementProgress(makeTask({ target: 3, progress: 2 }))).toBe(1)
    expect(decrementProgress(makeTask({ target: 3, progress: 0 }))).toBe(0)
  })
})

describe('normalizeTarget', () => {
  it('clamps to the allowed range and rounds', () => {
    expect(normalizeTarget(0)).toBe(1)
    expect(normalizeTarget(-5)).toBe(1)
    expect(normalizeTarget(1000)).toBe(99)
    expect(normalizeTarget(3.6)).toBe(4)
    expect(normalizeTarget(Number.NaN)).toBe(1)
  })
})

describe('scheduleOf', () => {
  it('keeps the target and sorts the days of a repeating task', () => {
    expect(scheduleOf(true, 3.4, [5, 1])).toEqual({ target: 3, weekdays: [1, 5] })
  })

  it('strips both from a one-off', () => {
    expect(scheduleOf(false, 8, [1, 5])).toEqual({ target: 1, weekdays: [] })
  })
})

describe('createTask', () => {
  it('trims the title and normalizes the schedule', () => {
    const task = createTask(
      { title: '  Drink water  ', target: 8, weekdays: [3, 1] },
      'id-1',
      42,
    )

    expect(task).toEqual({
      id: 'id-1',
      title: 'Drink water',
      repeats: true,
      target: 8,
      progress: 0,
      weekdays: [1, 3],
      createdAt: 42,
    })
  })

  it('creates nothing from a blank title', () => {
    expect(createTask({ title: '   ' })).toBeNull()
  })
})

describe('patchTask', () => {
  it('changes only the fields in the patch', () => {
    const task = makeTask({ target: 8, weekdays: [1] })

    expect(patchTask(task, { title: ' Read ' })).toEqual({ ...task, title: 'Read' })
  })

  it('ignores a blank title and returns the same task', () => {
    const task = makeTask()

    expect(patchTask(task, { title: '   ', target: 5 })).toBe(task)
  })

  it('clamps progress to a lowered target', () => {
    const task = makeTask({ target: 8, progress: 5 })

    expect(patchTask(task, { target: 2 })).toMatchObject({ target: 2, progress: 2 })
  })

  it('turning a habit into a one-off strips its schedule', () => {
    const task = makeTask({ target: 8, progress: 3, weekdays: [1, 3] })

    expect(patchTask(task, { repeats: false })).toMatchObject({
      repeats: false,
      target: 1,
      progress: 1,
      weekdays: [],
    })
  })
})

describe('moveItem', () => {
  it('moves the item to its new position', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c'])
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })

  it('returns the same array when the destination does not exist', () => {
    const items = ['a', 'b']
    expect(moveItem(items, 0, -1)).toBe(items)
    expect(moveItem(items, 1, 2)).toBe(items)
  })
})

describe('groupForToday', () => {
  it('splits habits due today, one-offs and other days, keeping the order', () => {
    const tasks = [
      makeTask({ id: 'daily' }),
      makeTask({ id: 'one-off', repeats: false }),
      makeTask({ id: 'friday', weekdays: [5] }),
      makeTask({ id: 'monday', weekdays: [1] }),
    ]

    const { habits, oneOffs, others } = groupForToday(tasks, 1)

    expect(habits.map((task) => task.id)).toEqual(['daily', 'monday'])
    expect(oneOffs.map((task) => task.id)).toEqual(['one-off'])
    expect(others.map((task) => task.id)).toEqual(['friday'])
  })
})

describe('applyDailyReset', () => {
  it('changes nothing while it is still the same day', () => {
    const state = makeState({ tasks: [makeTask({ progress: 1 })] })
    expect(applyDailyReset(state, MONDAY)).toBe(state)
  })

  it('resets progress to zero on a new day', () => {
    const state = makeState({
      lastResetDate: '2024-01-07',
      tasks: [
        makeTask({ id: 'done', target: 2, progress: 2 }),
        makeTask({ id: 'halfway', target: 2, progress: 1 }),
      ],
    })

    const next = applyDailyReset(state, MONDAY)

    expect(next.lastResetDate).toBe('2024-01-08')
    expect(next.tasks.map((task) => task.progress)).toEqual([0, 0])
  })

  it('drops a one-off that was met and keeps a pending one', () => {
    const state = makeState({
      lastResetDate: '2024-01-07',
      tasks: [
        makeTask({ id: 'one-off-done', repeats: false, progress: 1 }),
        makeTask({ id: 'one-off-pending', repeats: false, progress: 0 }),
      ],
    })

    const next = applyDailyReset(state, MONDAY)

    expect(next.tasks.map((task) => task.id)).toEqual(['one-off-pending'])
  })
})
