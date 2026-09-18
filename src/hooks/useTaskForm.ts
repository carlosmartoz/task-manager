import { useState } from 'react'

import { MIN_TARGET } from '@/lib/config'
import type { NewTask, Weekday } from '@/types'

type Draft = {
  title?: string
  repeats?: boolean
  target?: number
  weekdays?: Weekday[]
}

// The fields shared by creating and editing a task. `target` is kept as text
// because the input can sit empty while someone types.
export function useTaskForm(initial: Draft = {}) {
  const [title, setTitle] = useState(initial.title ?? '')
  const [repeats, setRepeats] = useState(initial.repeats ?? false)
  const [target, setTarget] = useState(String(initial.target ?? MIN_TARGET))
  const [weekdays, setWeekdays] = useState<Weekday[]>(initial.weekdays ?? [])

  function reset(next: Draft = {}) {
    setTitle(next.title ?? '')
    setRepeats(next.repeats ?? false)
    setTarget(String(next.target ?? MIN_TARGET))
    setWeekdays(next.weekdays ?? [])
  }

  const values: NewTask = {
    title,
    repeats,
    target: Number(target) || MIN_TARGET,
    weekdays,
  }

  return {
    title,
    setTitle,
    repeats,
    setRepeats,
    target,
    setTarget,
    weekdays,
    setWeekdays,
    reset,
    values,
    isValid: title.trim().length > 0,
  }
}
