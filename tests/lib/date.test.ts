import { describe, expect, it } from 'vitest'

import { currentDay, endOfDay, getTodayKey } from '@/lib/date'

describe('currentDay', () => {
  it('still belongs to yesterday before 5 a.m.', () => {
    expect(getTodayKey(currentDay(new Date(2024, 0, 8, 4, 59)))).toBe('2024-01-07')
  })

  it('turns into the new day at 5 a.m.', () => {
    expect(getTodayKey(currentDay(new Date(2024, 0, 8, 5, 0)))).toBe('2024-01-08')
  })

  it('keeps the calendar date across the rest of the day', () => {
    expect(getTodayKey(currentDay(new Date(2024, 0, 8, 23, 59)))).toBe('2024-01-08')
  })
})

describe('endOfDay', () => {
  it('runs until just before 5 a.m. of the next date', () => {
    const end = new Date(endOfDay(new Date(2024, 0, 7)))

    expect(end.getDate()).toBe(8)
    expect([end.getHours(), end.getMinutes()]).toEqual([4, 59])
  })
})
