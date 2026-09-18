import { TaskItem } from '@/components/TaskItem'
import type { TaskPatch } from '@/hooks/useTasks'
import type { Task } from '@/types/task'

type TaskListProps = {
  tasks: Task[]
  /** Racha por id de tarea; las que faltan se muestran sin racha. */
  streaks: Record<string, number>
  dimmed?: boolean
  onAdvance: (id: string) => void
  onDecrement: (id: string) => void
  onEdit: (id: string, patch: TaskPatch) => void
  onSwap: (id: string, otherId: string) => void
  onRemove: (id: string) => void
}

export function TaskList({
  tasks,
  streaks,
  dimmed,
  onAdvance,
  onDecrement,
  onEdit,
  onSwap,
  onRemove,
}: TaskListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task, index) => {
        // El vecino es el de la lista visible, no el del array completo.
        const previous = tasks[index - 1]
        const next = tasks[index + 1]

        return (
          <TaskItem
            key={task.id}
            task={task}
            streak={streaks[task.id] ?? 0}
            dimmed={dimmed}
            onAdvance={onAdvance}
            onDecrement={onDecrement}
            onEdit={onEdit}
            onMoveUp={previous ? () => onSwap(task.id, previous.id) : undefined}
            onMoveDown={next ? () => onSwap(task.id, next.id) : undefined}
            onRemove={onRemove}
          />
        )
      })}
    </ul>
  )
}
