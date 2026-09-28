import { useCallback, useEffect, useRef, useState } from 'react'

import { DAY_CHECK_INTERVAL, STORAGE_KEY, UNDO_TIMEOUT } from '@/lib/config'
import { loadState, parseStoredState, saveState } from '@/lib/storage'
import {
  advanceProgress,
  applyDailyReset,
  createTask,
  decrementProgress,
  moveItem,
  patchTask,
  restoreTask,
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

  // Another tab saved: adopt its state, or our next save would overwrite it.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || event.newValue === null) return
      setState(applyDailyReset(parseStoredState(event.newValue)))
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
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

  const addTask = useCallback((input: NewTask) => {
    const task = createTask(input)
    if (!task) return

    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }))
  }, [])

  const editTask = useCallback(
    (id: string, patch: TaskPatch) => {
      updateTask(id, (task) => patchTask(task, patch))
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
      updateTask(id, (task) => ({ ...task, progress: decrementProgress(task) }))
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

  // One notice at a time: offering a new undo drops the previous one.
  const offerUndo = useCallback((undo: PendingUndo) => {
    window.clearTimeout(undoTimer.current)
    setPendingUndo(undo)
    undoTimer.current = window.setTimeout(
      () => setPendingUndo(null),
      UNDO_TIMEOUT,
    )
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

      offerUndo({ kind: 'remove', task, index, day: state.lastResetDate })
    },
    [state, offerUndo],
  )

  // An import replaces everything, so it can be undone like a deletion.
  const replaceState = useCallback(
    (next: TasksState) => {
      setState(applyDailyReset(next))
      offerUndo({ kind: 'import', previous: state })
    },
    [state, offerUndo],
  )

  const undo = useCallback(() => {
    if (!pendingUndo) return

    if (pendingUndo.kind === 'import') {
      setState(applyDailyReset(pendingUndo.previous))
    } else {
      setState((prev) => restoreTask(prev, pendingUndo))
    }

    dismissUndo()
  }, [pendingUndo, dismissUndo])

  return {
    state,
    pendingUndo,
    addTask,
    editTask,
    advanceTask,
    decrementTask,
    swapTasks,
    removeTask,
    undo,
    dismissUndo,
    replaceState,
  }
}
