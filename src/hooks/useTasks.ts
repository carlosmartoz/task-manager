import { useCallback, useEffect, useRef, useState } from 'react'

import { DAY_CHECK_INTERVAL, UNDO_TIMEOUT } from '@/lib/config'
import { loadState, saveState } from '@/lib/storage'
import {
  advanceProgress,
  applyDailyReset,
  clamp,
  moveItem,
  scheduleOf,
} from '@/lib/tasks'
import type { NewTask, PendingUndo, Task, TaskPatch, TasksState } from '@/types'

export function useTasks() {
  const [state, setState] = useState<TasksState>(() =>
    applyDailyReset(loadState()),
  )
  const [pendingUndo, setPendingUndo] = useState<PendingUndo | null>(null)
  const undoTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    saveState(state)
  }, [state])

  // Catches the day change while the tab is open and when coming back to it.
  useEffect(() => {
    const check = () => setState((prev) => applyDailyReset(prev))

    const interval = window.setInterval(check, DAY_CHECK_INTERVAL)
    window.addEventListener('focus', check)
    document.addEventListener('visibilitychange', check)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', check)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  useEffect(() => () => window.clearTimeout(undoTimer.current), [])

  const dismissUndo = useCallback(() => {
    window.clearTimeout(undoTimer.current)
    undoTimer.current = undefined
    setPendingUndo(null)
  }, [])

  const updateTask = useCallback((id: string, update: (task: Task) => Task) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? update(task) : task)),
    }))
  }, [])

  const addTask = useCallback(
    ({ title, repeats = true, target = 1, weekdays = [] }: NewTask) => {
      const trimmed = title.trim()
      if (!trimmed) return

      const task: Task = {
        id: crypto.randomUUID(),
        title: trimmed,
        repeats,
        ...scheduleOf(repeats, target, weekdays),
        progress: 0,
        createdAt: Date.now(),
      }

      setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }))
    },
    [],
  )

  const editTask = useCallback(
    (id: string, patch: TaskPatch) => {
      updateTask(id, (task) => {
        const title = patch.title === undefined ? task.title : patch.title.trim()
        if (!title) return task

        const repeats = patch.repeats === undefined ? task.repeats : patch.repeats
        const { target, weekdays } = scheduleOf(
          repeats,
          patch.target === undefined ? task.target : patch.target,
          patch.weekdays === undefined ? task.weekdays : patch.weekdays,
        )

        return {
          ...task,
          title,
          repeats,
          target,
          weekdays,
          // Lowering the target must not leave progress above it.
          progress: clamp(task.progress, 0, target),
        }
      })
    },
    [updateTask],
  )

  const advanceTask = useCallback(
    (id: string) => {
      updateTask(id, (task) => ({ ...task, progress: advanceProgress(task) }))
    },
    [updateTask],
  )

  const decrementTask = useCallback(
    (id: string) => {
      updateTask(id, (task) => ({
        ...task,
        progress: Math.max(task.progress - 1, 0),
      }))
    },
    [updateTask],
  )

  // By id, not by position: the caller sees an order that may hide tasks
  // which are not due today.
  const swapTasks = useCallback((id: string, otherId: string) => {
    setState((prev) => {
      const from = prev.tasks.findIndex((task) => task.id === id)
      const to = prev.tasks.findIndex((task) => task.id === otherId)
      if (from === -1 || to === -1) return prev

      const tasks = moveItem(prev.tasks, from, to)
      return tasks === prev.tasks ? prev : { ...prev, tasks }
    })
  }, [])

  const removeTask = useCallback(
    (id: string) => {
      const index = state.tasks.findIndex((task) => task.id === id)
      if (index === -1) return

      const task = state.tasks[index]
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((candidate) => candidate.id !== id),
      }))

      window.clearTimeout(undoTimer.current)
      setPendingUndo({ task, index })
      undoTimer.current = window.setTimeout(
        () => setPendingUndo(null),
        UNDO_TIMEOUT,
      )
    },
    [state.tasks],
  )

  const undoRemove = useCallback(() => {
    if (!pendingUndo) return

    const { task, index } = pendingUndo
    setState((prev) => {
      if (prev.tasks.some((candidate) => candidate.id === task.id)) return prev

      const tasks = [...prev.tasks]
      tasks.splice(Math.min(index, tasks.length), 0, task)
      return { ...prev, tasks }
    })

    dismissUndo()
  }, [pendingUndo, dismissUndo])

  const replaceState = useCallback(
    (next: TasksState) => {
      setState(applyDailyReset(next))
      dismissUndo()
    },
    [dismissUndo],
  )

  return {
    state,
    pendingUndo,
    addTask,
    editTask,
    advanceTask,
    decrementTask,
    swapTasks,
    removeTask,
    undoRemove,
    dismissUndo,
    replaceState,
  }
}
