import { useMemo, useState } from 'react'
import { IconFlame } from '@tabler/icons-react'

import { DataActions } from '@/components/DataActions'
import { TaskInput } from '@/components/TaskInput'
import { TaskList } from '@/components/TaskList'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UndoToast } from '@/components/UndoToast'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/useTasks'
import { useTheme } from '@/hooks/useTheme'
import { formatLongDate, getWeekday } from '@/lib/date'
import {
  computeGlobalStreak,
  computeStreak,
  isScheduledOn,
  isTaskDone,
} from '@/lib/tasks'

function App() {
  const {
    tasks,
    history,
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
  } = useTasks()
  const { theme, cycleTheme } = useTheme()
  const [showOthers, setShowOthers] = useState(false)

  const weekday = getWeekday()
  const todayTasks = tasks.filter((task) => isScheduledOn(task, weekday))
  const otherTasks = tasks.filter((task) => !isScheduledOn(task, weekday))
  const completed = todayTasks.filter(isTaskDone).length

  const streaks = useMemo(
    () =>
      Object.fromEntries(
        tasks.map((task) => [task.id, computeStreak(task, history)]),
      ),
    [tasks, history],
  )
  const globalStreak = useMemo(
    () => computeGlobalStreak(tasks, history),
    [tasks, history],
  )

  const listProps = {
    streaks,
    onAdvance: advanceTask,
    onDecrement: decrementTask,
    onEdit: editTask,
    onSwap: swapTasks,
    onRemove: removeTask,
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-6 px-4 py-10 sm:py-16">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Tareas de hoy</h1>
          <p className="text-sm text-muted-foreground first-letter:uppercase">
            {formatLongDate()}
            {todayTasks.length > 0 &&
              ` · ${completed} de ${todayTasks.length} completadas`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {globalStreak > 0 && (
            <span
              className="mr-1 flex items-center gap-1 text-sm text-muted-foreground"
              title={`${globalStreak} ${globalStreak === 1 ? 'día' : 'días'} cumpliendo todas las tareas`}
            >
              <IconFlame className="size-4" />
              {globalStreak}
            </span>
          )}
          <ThemeToggle theme={theme} onCycle={cycleTheme} />
          <DataActions state={state} onImport={replaceState} />
        </div>
      </header>

      <TaskInput onAdd={addTask} />

      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No hay tareas todavía. Añade la primera arriba.
        </p>
      ) : todayTasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Hoy no toca ninguna tarea. Disfruta el día.
        </p>
      ) : (
        <TaskList tasks={todayTasks} {...listProps} />
      )}

      {otherTasks.length > 0 && (
        <section className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOthers((prev) => !prev)}
            aria-expanded={showOthers}
            className="self-start text-muted-foreground"
          >
            {showOthers ? 'Ocultar' : 'Mostrar'} {otherTasks.length}{' '}
            {otherTasks.length === 1 ? 'tarea' : 'tareas'} de otros días
          </Button>

          {showOthers && <TaskList tasks={otherTasks} dimmed {...listProps} />}
        </section>
      )}

      {pendingUndo && (
        <UndoToast
          title={pendingUndo.task.title}
          onUndo={undoRemove}
          onDismiss={dismissUndo}
        />
      )}
    </main>
  )
}

export default App
