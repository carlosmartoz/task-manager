import { describe, expect, it } from 'vitest'

import {
  advanceProgress,
  applyDailyReset,
  computeGlobalStreak,
  computeStreak,
  isTaskDone,
  moveItem,
  normalizeTarget,
  pruneHistory,
  scheduleOf,
  splitByRepeat,
  streakTier,
} from '@/lib/tasks'
import type { Task, TasksState } from '@/types'

// 8 January 2024 was a Monday; every other date derives from it.
const MONDAY = new Date(2024, 0, 8)

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Beber agua',
    repeats: true,
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
  it('is met once the target is reached', () => {
    expect(isTaskDone(makeTask({ target: 8, progress: 7 }))).toBe(false)
    expect(isTaskDone(makeTask({ target: 8, progress: 8 }))).toBe(true)
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

describe('normalizeTarget', () => {
  it('clamps to the allowed range and rounds', () => {
    expect(normalizeTarget(0)).toBe(1)
    expect(normalizeTarget(-5)).toBe(1)
    expect(normalizeTarget(1000)).toBe(99)
    expect(normalizeTarget(3.6)).toBe(4)
    expect(normalizeTarget(Number.NaN)).toBe(1)
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

describe('pruneHistory', () => {
  it('drops the days outside the window', () => {
    const history = { '2024-01-07': ['task-1'], '2020-01-01': ['task-1'] }
    expect(pruneHistory(history, MONDAY)).toEqual({ '2024-01-07': ['task-1'] })
  })
})

describe('streakTier', () => {
  it('grows with the streak, and nothing below one day', () => {
    expect(streakTier(0)).toBe('none')
    expect(streakTier(1)).toBe('started')
    expect(streakTier(6)).toBe('started')
    expect(streakTier(7)).toBe('week')
    expect(streakTier(29)).toBe('week')
    expect(streakTier(30)).toBe('month')
  })
})

describe('splitByRepeat', () => {
  it('separates habits from one-offs, keeping the order', () => {
    const tasks = [
      makeTask({ id: 'a' }),
      makeTask({ id: 'b', repeats: false }),
      makeTask({ id: 'c' }),
    ]

    const { habits, oneOffs } = splitByRepeat(tasks)

    expect(habits.map((task) => task.id)).toEqual(['a', 'c'])
    expect(oneOffs.map((task) => task.id)).toEqual(['b'])
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

describe('applyDailyReset', () => {
  it('changes nothing while it is still the same day', () => {
    const state = makeState({ tasks: [makeTask({ progress: 1 })] })
    expect(applyDailyReset(state, MONDAY)).toBe(state)
  })

  it('archives what was met and resets progress to zero', () => {
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

  it('drops a one-off that was met and keeps a pending one', () => {
    const state = makeState({
      lastResetDate: '2024-01-07',
      tasks: [
        makeTask({ id: 'suelta-hecha', repeats: false, progress: 1 }),
        makeTask({ id: 'suelta-pendiente', repeats: false, progress: 0 }),
      ],
    })

    const next = applyDailyReset(state, MONDAY)

    expect(next.tasks.map((task) => task.id)).toEqual(['suelta-pendiente'])
    // A one-off has no streak, so it is not worth archiving either.
    expect(next.history['2024-01-07']).toEqual([])
  })
})

describe('computeGlobalStreak', () => {
  it('leaves one-off tasks out of the count', () => {
    const tasks = [
      makeTask({ id: 'habito', progress: 1 }),
      makeTask({ id: 'suelta', repeats: false, progress: 0 }),
    ]
    const history = { '2024-01-07': ['habito'] }

    expect(computeGlobalStreak(tasks, history, MONDAY)).toBe(2)
  })
})

describe('computeStreak', () => {
  it('is always zero for a one-off', () => {
    const task = makeTask({ repeats: false, progress: 1 })
    const history = { '2024-01-07': ['task-1'], '2024-01-06': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(0)
  })

  it('counts consecutive met days backwards', () => {
    const task = makeTask({ progress: 1 })
    const history = { '2024-01-07': ['task-1'], '2024-01-06': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(3)
  })

  it('an unfinished current day does not break the streak', () => {
    const task = makeTask({ progress: 0 })
    const history = { '2024-01-07': ['task-1'], '2024-01-06': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(2)
  })

  it('a missed day cuts it', () => {
    const task = makeTask({ progress: 1 })
    const history = { '2024-01-07': ['task-1'], '2024-01-05': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(2)
  })

  it('days it was not due are skipped without breaking it', () => {
    const task = makeTask({ weekdays: [1], progress: 1 })
    const history = { '2024-01-01': ['task-1'] }

    expect(computeStreak(task, history, MONDAY)).toBe(2)
  })

  it('does not count days before the task existed', () => {
    const task = makeTask({ progress: 1, createdAt: new Date(2024, 0, 8).getTime() })

    expect(computeStreak(task, {}, MONDAY)).toBe(1)
  })
})
