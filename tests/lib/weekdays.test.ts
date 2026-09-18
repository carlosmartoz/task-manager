import { describe, expect, it } from 'vitest'

import {
  formatWeekdays,
  isScheduledOn,
  selectedWeekdays,
  toggleWeekday,
} from '@/lib/weekdays'
import type { Task, Weekday } from '@/types'

const ALL: Weekday[] = [1, 2, 3, 4, 5, 6, 0]

function makeTask(weekdays: Weekday[], repeats = true): Task {
  return {
    id: 'task-1',
    title: 'Beber agua',
    repeats,
    target: 1,
    progress: 0,
    weekdays,
    createdAt: 0,
  }
}

describe('isScheduledOn', () => {
  it('a one-off is due every day until it is done', () => {
    expect(isScheduledOn(makeTask([], false), 3)).toBe(true)
  })

  it('is due every day when no days are marked', () => {
    const task = makeTask([])
    expect(isScheduledOn(task, 0)).toBe(true)
    expect(isScheduledOn(task, 3)).toBe(true)
  })

  it('is only due on the marked days', () => {
    const task = makeTask([1, 3])
    expect(isScheduledOn(task, 1)).toBe(true)
    expect(isScheduledOn(task, 2)).toBe(false)
  })
})

describe('toggleWeekday', () => {
  it('starts from all seven days when the list is empty', () => {
    expect(toggleWeekday([], 1).sort()).toEqual([0, 2, 3, 4, 5, 6])
  })

  it('collapses back to empty when all seven are marked', () => {
    const six: Weekday[] = [1, 2, 3, 4, 5, 6]
    expect(toggleWeekday(six, 0)).toEqual([])
  })

  it('refuses to drop the last day, indistinguishable from every day', () => {
    expect(toggleWeekday([1], 1)).toEqual([1])
  })

  it('returns the days sorted', () => {
    expect(toggleWeekday([5, 1], 3)).toEqual([1, 3, 5])
  })
})

describe('selectedWeekdays', () => {
  it('shows all seven days when none are marked', () => {
    expect(selectedWeekdays([]).sort()).toEqual([...ALL].sort())
  })

  it('respects the selection when there is one', () => {
    expect(selectedWeekdays([2, 4])).toEqual([2, 4])
  })
})

describe('formatWeekdays', () => {
  it('summarises an empty list as every day', () => {
    expect(formatWeekdays([])).toBe('Every day')
  })

  it('uses the short labels in reading order', () => {
    expect(formatWeekdays([5, 1, 3])).toBe('Mo · We · Fr')
  })
})
