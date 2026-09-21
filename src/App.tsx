import { useMemo, useState } from 'react'

import { DataActions } from '@/components/shell/DataActions'
import { GlobalStreak } from '@/components/shell/GlobalStreak'
import { UndoToast } from '@/components/shell/UndoToast'
import { EmptyState } from '@/components/tasks/EmptyState'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskSection } from '@/components/tasks/TaskSection'
import { useTasks } from '@/hooks/useTasks'
import { formatLongDate } from '@/lib/date'
import { computeGlobalStreak, computeStreak } from '@/lib/streaks'
import { countDone, groupForToday } from '@/lib/tasks'
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
  const { habits, oneOffs, others } = groupForToday(tasks, getWeekday())

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
            <GlobalStreak streak={globalStreak} />
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
              <EmptyState />
            ) : (
              <div className="grid min-w-0 gap-5 xl:grid-cols-2">
                <TaskSection
                  title="Repetitive tasks"
                  summary={`${countDone(habits)} of ${habits.length} done`}
                >
                  {habits.length === 0 ? (
                    <div className="mt-3 grid place-items-center rounded-2xl border border-dashed border-border py-12 text-center text-sm text-subtle-foreground">
                      Nothing is due today. Enjoy the day.
                    </div>
                  ) : (
                    <TaskList tasks={habits} {...listProps} />
                  )}
                </TaskSection>

                {oneOffs.length > 0 && (
                  <TaskSection
                    title="Unique tasks"
                    summary={`${countDone(oneOffs)} of ${oneOffs.length} done`}
                  >
                    <TaskList tasks={oneOffs} {...listProps} />
                  </TaskSection>
                )}
              </div>
            )}

            {others.length > 0 && (
              <TaskSection
                title="Other days"
                summary={`${others.length} ${others.length === 1 ? 'task' : 'tasks'}`}
                collapsible
              >
                <TaskList tasks={others} dimmed {...listProps} />
              </TaskSection>
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
