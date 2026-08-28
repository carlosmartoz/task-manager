import { useCallback, useEffect, useRef, useState } from 'react'

import { loadState, saveState } from '@/lib/storage'
import {
  advanceProgress,
  applyDailyReset,
  clamp,
  moveItem,
  normalizeTarget,
} from '@/lib/tasks'
import type { Task, TasksState, Weekday } from '@/types/task'

const DAY_CHECK_INTERVAL = 30_000
const UNDO_TIMEOUT = 6_000

export type NewTask = {
  title: string
  target?: number
  weekdays?: Weekday[]
}

export type TaskPatch = {
  title?: string
  target?: number
  weekdays?: Weekday[]
}

/** Tarea eliminada que todavía se puede recuperar, con su posición original. */
export type PendingUndo = {
  task: Task
  index: number
}

export function useTasks() {
  const [state, setState] = useState<TasksState>(() =>
    applyDailyReset(loadState()),
  )
  const [pendingUndo, setPendingUndo] = useState<PendingUndo | null>(null)
  const undoTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    saveState(state)
  }, [state])

  // Detecta el cambio de día con la pestaña abierta y al volver a ella.
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

  const updateTask = useCallback(
    (id: string, update: (task: Task) => Task) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === id ? update(task) : task)),
      }))
    },
    [],
  )

  const addTask = useCallback(
    ({ title, target = 1, weekdays = [] }: NewTask) => {
      const trimmed = title.trim()
      if (!trimmed) return

      const task: Task = {
        id: crypto.randomUUID(),
        title: trimmed,
        target: normalizeTarget(target),
        progress: 0,
        weekdays: [...weekdays].sort(),
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

        const target =
          patch.target === undefined ? task.target : normalizeTarget(patch.target)

        return {
          ...task,
          title,
          target,
          // Bajar la meta no puede dejar el progreso por encima de ella.
          progress: clamp(task.progress, 0, target),
          weekdays:
            patch.weekdays === undefined
              ? task.weekdays
              : [...patch.weekdays].sort(),
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

  /**
   * Intercambia dos tareas por id, no por posición: quien llama conoce el orden
   * que se está viendo, que puede tener tareas ocultas por no tocar hoy.
   */
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
    tasks: state.tasks,
    history: state.history,
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
