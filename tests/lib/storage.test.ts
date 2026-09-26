import { describe, expect, it } from 'vitest'

import { getTodayKey } from '@/lib/date'
import { parseBackup, sanitizeState, serializeBackup } from '@/lib/storage'
import type { TasksState } from '@/types'

const TODAY = getTodayKey()

describe('sanitizeState', () => {
  it('migrates the v1 format, which stored `done` instead of `progress`', () => {
    const v1 = {
      lastResetDate: '2024-01-08',
      tasks: [
        { id: 'a', title: 'Done', done: true, createdAt: 1 },
        { id: 'b', title: 'Pending', done: false, createdAt: 2 },
      ],
    }

    const state = sanitizeState(v1)

    expect(state.tasks).toEqual([
      {
        id: 'a',
        title: 'Done',
        repeats: true,
        target: 1,
        progress: 1,
        weekdays: [],
        createdAt: 1,
      },
      {
        id: 'b',
        title: 'Pending',
        repeats: true,
        target: 1,
        progress: 0,
        weekdays: [],
        createdAt: 2,
      },
    ])
  })

  it('a stored one-off keeps neither target nor days', () => {
    const state = sanitizeState({
      tasks: [
        { id: 'a', title: 'Renew passport', repeats: false, target: 8, weekdays: [1] },
      ],
    })

    expect(state.tasks[0]).toMatchObject({
      repeats: false,
      target: 1,
      weekdays: [],
    })
  })

  it('clamps the progress of a stored one-off to its target of 1', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: 'Renew passport', repeats: false, target: 8, progress: 5 }],
    })

    expect(state.tasks[0]).toMatchObject({ target: 1, progress: 1 })
  })

  it('replaces a malformed last reset date with today', () => {
    expect(sanitizeState({ tasks: [], lastResetDate: 'yesterday' }).lastResetDate).toBe(
      TODAY,
    )
  })

  it('drops tasks with no usable title', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: '   ' }, { id: 'b' }, { id: 'c', title: 'Valid' }],
    })

    expect(state.tasks.map((task) => task.title)).toEqual(['Valid'])
  })

  it('clamps progress above the target and targets out of range', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: 'Water', target: 500, progress: 900 }],
    })

    expect(state.tasks[0].target).toBe(99)
    expect(state.tasks[0].progress).toBe(99)
  })

  it('ignores invalid weekdays and removes duplicates', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: 'Gym', weekdays: [1, 1, 9, -2, 'monday', 3] }],
    })

    expect(state.tasks[0].weekdays).toEqual([1, 3])
  })

  it('returns an empty state for unrecognisable data', () => {
    expect(sanitizeState(null).tasks).toEqual([])
    expect(sanitizeState({ tasks: 'nope' }).tasks).toEqual([])
  })

  it('drops the streak data of older versions', () => {
    const state = sanitizeState({
      tasks: [{ id: 'a', title: 'Read', skipped: true }],
      lastResetDate: TODAY,
      history: { [TODAY]: ['a'] },
      skipHistory: { [TODAY]: ['a'] },
    })

    expect(state).toEqual({
      tasks: [expect.not.objectContaining({ skipped: expect.anything() })],
      lastResetDate: TODAY,
    })
  })
})

describe('parseBackup', () => {
  const state: TasksState = {
    tasks: [
      {
        id: 'a',
        title: 'Water',
        repeats: true,
        target: 8,
        progress: 3,
        weekdays: [1, 5],
        createdAt: 1,
      },
    ],
    lastResetDate: TODAY,
  }

  it('restores a backup produced by the app itself', () => {
    expect(parseBackup(serializeBackup(state))).toEqual(state)
  })

  it('also accepts the state without its wrapper', () => {
    expect(parseBackup(JSON.stringify(state))).toEqual(state)
  })

  it('rejects a file that is not JSON', () => {
    expect(() => parseBackup('this is not json')).toThrow('not valid JSON')
  })

  it('rejects JSON with no task list', () => {
    expect(() => parseBackup('{"something":"else"}')).toThrow('does not contain a task list')
  })
})
