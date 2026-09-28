import type { DragEvent } from 'react'

import { TaskActions } from '@/components/tasks/TaskActions'
import { TaskProgress } from '@/components/tasks/TaskProgress'
import { canAdvance, isTaskDone } from '@/lib/tasks'
import { cn } from '@/lib/utils'
import { formatWeekdays } from '@/lib/weekdays'
import type { Task } from '@/types'

type TaskItemProps = {
  task: Task
  // The task is not due today: shown dimmed and without the progress control.
  dimmed?: boolean
  // The task the form is editing right now.
  isEditing?: boolean
  // The task being dragged right now, and the one it would land on.
  isDragging?: boolean
  isDragOver?: boolean
  onAdvance: (id: string) => void
  onDecrement: (id: string) => void
  onStartEdit: (id: string) => void
  // Absent when the task is already first in the visible list.
  onMoveUp?: () => void
  // Absent when the task is already last in the visible list.
  onMoveDown?: () => void
  onRemove: (id: string) => void
  onDragStart: () => void
  onDragEnter: () => void
  onDragEnd: () => void
  onDrop: () => void
}

export function TaskItem({
  task,
  dimmed = false,
  isEditing = false,
  isDragging = false,
  isDragOver = false,
  onAdvance,
  onDecrement,
  onStartEdit,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
}: TaskItemProps) {
  const done = isTaskDone(task)
  // Not due today, or a met counter: clicking the title has nothing to advance.
  const isClickable = !dimmed && canAdvance(task)

  function handleDrop(event: DragEvent<HTMLLIElement>) {
    event.preventDefault()
    onDrop()
  }

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
      className={cn(
        'group flex items-center gap-2 py-3 transition-colors sm:gap-3',
        dimmed && 'opacity-60',
        isDragging && 'opacity-40',
        isDragOver && 'bg-muted/50',
        isEditing && 'bg-muted/40',
      )}
    >
      <span className="flex w-12 shrink-0 items-center">
        {dimmed ? (
          <span className="size-4.5 rounded-md border border-dashed border-border-strong" />
        ) : (
          <TaskProgress task={task} onAdvance={() => onAdvance(task.id)} />
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <span
          onClick={() => isClickable && onAdvance(task.id)}
          // The full title on hover, since a long one is cut with an ellipsis.
          title={task.title}
          className={cn(
            'truncate text-sm font-medium text-foreground',
            isClickable && 'cursor-pointer',
            done && 'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </span>

        {task.repeats && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {formatWeekdays(task.weekdays)}
          </p>
        )}
      </div>

      <TaskActions
        task={task}
        dimmed={dimmed}
        onAdvance={onAdvance}
        onDecrement={onDecrement}
        onStartEdit={onStartEdit}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    </li>
  )
}
