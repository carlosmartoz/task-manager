import { useMemo, useState } from 'react'
import { IconChecklist, IconFlame } from '@tabler/icons-react'

import { DataActions } from '@/components/shell/DataActions'
import { UndoToast } from '@/components/shell/UndoToast'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskList } from '@/components/tasks/TaskList'
import { useTasks } from '@/hooks/useTasks'
import { formatLongDate } from '@/lib/date'
import {
  computeGlobalStreak,
  computeStreak,
  isTaskDone,
  splitByRepeat,
  splitByWeekday,
} from '@/lib/tasks'
import { getWeekday } from '@/lib/weekdays'
import type { TaskPatch } from '@/types'

function App() {
  const {
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
  const [editingId, setEditingId] = useState<string | null>(null)

  const { tasks, history } = state
  // A task deleted while being edited simply sends the form back to creating.
  const editing = tasks.find((task) => task.id === editingId)
  const { today: todayTasks, others: otherTasks } = splitByWeekday(
    tasks,
    getWeekday(),
  )
  // A one-off is always due, so it gets its own card instead of today's.
  const { habits, oneOffs } = splitByRepeat(todayTasks)
  const completed = habits.filter(isTaskDone).length
  const completedOneOffs = oneOffs.filter(isTaskDone).length

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

  function saveEdit(id: string, patch: TaskPatch) {
    editTask(id, patch)
    setEditingId(null)
  }

  const listProps = {
    streaks,
    editingId,
    onAdvance: advanceTask,
    onDecrement: decrementTask,
    onStartEdit: setEditingId,
    onSwap: swapTasks,
    onRemove: removeTask,
  }

  return (
    <main className="min-h-svh p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground">{formatLongDate()}</p>
          </div>

          <div className="flex items-center gap-1">
            {globalStreak > 0 && (
              <span
                className="mr-1 flex items-center gap-1 text-sm font-semibold text-muted-foreground"
                title={`${globalStreak} ${globalStreak === 1 ? 'day' : 'days'} completing every task`}
              >
                <IconFlame className="size-4.5" />
                {globalStreak}
              </span>
            )}
            <DataActions state={state} onImport={replaceState} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
          <section className="card h-fit min-w-0 p-4 sm:p-5 lg:sticky lg:top-8">
            <h2 className="mb-4 text-lg font-bold">
              {editing ? 'Edit task' : 'New task'}
            </h2>
            <TaskForm
              key={editing?.id ?? 'new'}
              editing={editing}
              onAdd={addTask}
              onSave={saveEdit}
              onCancel={() => setEditingId(null)}
            />
          </section>

          <div className="min-w-0 space-y-5">
            {tasks.length === 0 ? (
              <section className="card flex flex-col items-center gap-4 p-8 text-center sm:p-12">
                <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
                  <IconChecklist className="size-7" />
                </span>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    Nothing here yet
                  </h2>
                  <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Use the form to write down the habits you want to keep. What
                    you do today shows up here, and starts over tomorrow.
                  </p>
                </div>

                <p className="text-xs text-subtle-foreground">
                  Already have a backup? Use{' '}
                  <span className="text-muted-foreground">Import</span> at the
                  top.
                </p>
              </section>
            ) : (
              <div className="grid min-w-0 gap-5 xl:grid-cols-2">
                <section className="card h-fit min-w-0 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-bold">Repetitive tasks</h2>
                    <p className="text-sm text-subtle-foreground">
                      {completed} of {habits.length} done
                    </p>
                  </div>

                  {habits.length === 0 ? (
                    <div className="mt-3 grid place-items-center rounded-2xl border border-dashed border-border py-12 text-center text-sm text-subtle-foreground">
                      Nothing is due today. Enjoy the day.
                    </div>
                  ) : (
                    <TaskList tasks={habits} {...listProps} />
                  )}
                </section>

                {oneOffs.length > 0 && (
                  <section className="card h-fit min-w-0 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-lg font-bold">Unique tasks</h2>
                      <p className="text-sm text-subtle-foreground">
                        {completedOneOffs} of {oneOffs.length} done
                      </p>
                    </div>

                    <TaskList tasks={oneOffs} {...listProps} />
                  </section>
                )}
              </div>
            )}

            {otherTasks.length > 0 && (
              <section className="card min-w-0 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold">Other days</h2>
                  <p className="text-sm text-subtle-foreground">
                    {otherTasks.length}{' '}
                    {otherTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>

                <TaskList tasks={otherTasks} dimmed {...listProps} />
              </section>
            )}
          </div>
        </div>

        {pendingUndo && (
          <UndoToast
            title={pendingUndo.task.title}
            onUndo={undoRemove}
            onDismiss={dismissUndo}
          />
        )}
      </div>
    </main>
  )
}

export default App
