import { useState } from 'react'

import { MIN_TARGET } from '@/lib/config'
import type { NewTask, TaskPatch, Weekday } from '@/types'

// The fields shared by creating and editing a task. `target` is kept as text
// because the input can sit empty while someone types.
export function useTaskForm(initial: TaskPatch = {}) {
  const [title, setTitle] = useState(initial.title ?? '')
  const [repeats, setRepeats] = useState(initial.repeats ?? false)
  const [target, setTarget] = useState(String(initial.target ?? MIN_TARGET))
  const [weekdays, setWeekdays] = useState<Weekday[]>(initial.weekdays ?? [])

  // Back to a blank draft, after a task has been added.
  function reset() {
    setTitle('')
    setRepeats(false)
    setTarget(String(MIN_TARGET))
    setWeekdays([])
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
