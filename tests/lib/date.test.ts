import { describe, expect, it } from 'vitest'

import { currentDay, getTodayKey } from '@/lib/date'

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
