import { useState } from 'react'

import { TaskItem } from '@/components/tasks/TaskItem'
import type { Task, TaskPatch } from '@/types'

type TaskListProps = {
  tasks: Task[]
  // Streak by task id; the ones missing render without a streak.
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
  // The task being dragged and the one under the pointer, both by id.
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  function endDrag() {
    setDraggingId(null)
    setOverId(null)
  }

  function drop(targetId: string) {
    if (draggingId && draggingId !== targetId) onSwap(draggingId, targetId)
    endDrag()
  }

  return (
    <ul className="divide-y divide-border">
      {tasks.map((task, index) => {
        // The neighbour is the one in the visible list, not in the full array.
        const previous = tasks[index - 1]
        const next = tasks[index + 1]

        return (
          <TaskItem
            key={task.id}
            task={task}
            streak={streaks[task.id] ?? 0}
            dimmed={dimmed}
            isDragging={draggingId === task.id}
            isDragOver={overId === task.id && draggingId !== task.id}
            onAdvance={onAdvance}
            onDecrement={onDecrement}
            onEdit={onEdit}
            onMoveUp={previous ? () => onSwap(task.id, previous.id) : undefined}
            onMoveDown={next ? () => onSwap(task.id, next.id) : undefined}
            onRemove={onRemove}
            onDragStart={() => setDraggingId(task.id)}
            onDragEnter={() => setOverId(task.id)}
            onDragEnd={endDrag}
            onDrop={() => drop(task.id)}
          />
        )
      })}
    </ul>
  )
}
