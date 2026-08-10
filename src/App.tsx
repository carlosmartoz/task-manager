import { TaskInput } from '@/components/TaskInput'
import { TaskList } from '@/components/TaskList'
import { useTasks } from '@/hooks/useTasks'
import { formatLongDate } from '@/lib/date'

function App() {
  const { tasks, addTask, editTask, toggleTask, removeTask } = useTasks()
  const completed = tasks.filter((task) => task.done).length

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-6 px-4 py-10 sm:py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tareas de hoy</h1>
        <p className="text-sm text-muted-foreground first-letter:uppercase">
          {formatLongDate()}
          {tasks.length > 0 && ` · ${completed} de ${tasks.length} completadas`}
        </p>
      </header>

      <TaskInput onAdd={addTask} />

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onEdit={editTask}
        onRemove={removeTask}
      />
    </main>
  )
}

export default App
