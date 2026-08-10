import { TaskItem } from '@/components/TaskItem'
import type { Task } from '@/types/task'

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onEdit: (id: string, title: string) => void
  onRemove: (id: string) => void
}

export function TaskList({ tasks, onToggle, onEdit, onRemove }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No hay tareas todavía. Añade la primera arriba.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}
