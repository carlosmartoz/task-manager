import { describe, expect, it } from 'vitest'

import { computeGlobalStreak, computeStreak, streakTier } from '@/lib/streaks'
import type { Task } from '@/types'

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

describe('computeGlobalStreak', () => {
  it('leaves one-off tasks out of the count', () => {
    const tasks = [
      makeTask({ id: 'habit', progress: 1 }),
      makeTask({ id: 'one-off', repeats: false, progress: 0 }),
    ]
    const history = { '2024-01-07': ['habit'] }

    expect(computeGlobalStreak(tasks, history, MONDAY)).toBe(2)
  })

  it('breaks on a past day where any due task was missed', () => {
    const tasks = [
      makeTask({ id: 'water', progress: 1 }),
      makeTask({ id: 'read', progress: 1 }),
    ]
    const history = { '2024-01-07': ['water', 'read'], '2024-01-06': ['water'] }

    expect(computeGlobalStreak(tasks, history, MONDAY)).toBe(2)
  })

  it('skips days where nothing was due', () => {
    const tasks = [makeTask({ weekdays: [1], progress: 1 })]
    const history = { '2024-01-01': ['task-1'] }

    expect(computeGlobalStreak(tasks, history, MONDAY)).toBe(2)
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
