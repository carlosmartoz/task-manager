import { useCallback, useEffect, useState } from 'react'

import { getTodayKey } from '@/lib/date'
import type { Task } from '@/types/task'

const STORAGE_KEY = 'daily-task-manager:v1'
const DAY_CHECK_INTERVAL = 30_000

type TasksState = {
  tasks: Task[]
  lastResetDate: string
}

function emptyState(): TasksState {
  return { tasks: [], lastResetDate: getTodayKey() }
}

/**
 * Las tareas son recurrentes: se conservan de un día para otro, pero al
 * cambiar el día se les quita el estado de completada.
 */
function applyDailyReset(state: TasksState): TasksState {
  const today = getTodayKey()
  if (state.lastResetDate === today) return state

  return {
    lastResetDate: today,
    tasks: state.tasks.map((task) => ({ ...task, done: false })),
  }
}

function loadState(): TasksState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()

    const parsed = JSON.parse(raw) as Partial<TasksState>
    if (!Array.isArray(parsed.tasks)) return emptyState()

    return applyDailyReset({
      tasks: parsed.tasks,
      lastResetDate: parsed.lastResetDate ?? getTodayKey(),
    })
  } catch {
    return emptyState()
  }
}

export function useTasks() {
  const [state, setState] = useState<TasksState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Detecta el cambio de día con la pestaña abierta y al volver a ella.
  useEffect(() => {
    const check = () => setState(applyDailyReset)

    const interval = window.setInterval(check, DAY_CHECK_INTERVAL)
    window.addEventListener('focus', check)
    document.addEventListener('visibilitychange', check)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', check)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      done: false,
      createdAt: Date.now(),
    }

    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }))
  }, [])

  const editTask = useCallback((id: string, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, title: trimmed } : task,
      ),
    }))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    }))
  }, [])

  const removeTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }))
  }, [])

  return { tasks: state.tasks, addTask, editTask, toggleTask, removeTask }
}
