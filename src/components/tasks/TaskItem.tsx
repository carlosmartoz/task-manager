import type { DragEvent, KeyboardEvent } from 'react'
import {
  IconFlame,
  IconGripVertical,
  IconMinus,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'

import { TaskProgress } from '@/components/tasks/TaskProgress'
import { Button } from '@/components/ui/button'
import { isTaskDone, streakTier } from '@/lib/tasks'
import { cn } from '@/lib/utils'
import { formatWeekdays } from '@/lib/weekdays'
import type { StreakTier, Task } from '@/types'

// A longer streak earns a warmer colour; at zero it stays as quiet as the rest.
const STREAK_TONE: Record<StreakTier, string> = {
  none: '',
  started: 'text-foreground',
  week: 'text-streak',
  month: 'text-streak-strong',
}

type TaskItemProps = {
  task: Task
  streak: number
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
  streak,
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
  const counter = task.target > 1

  // Reordering without a mouse: the grip moves the task with the arrow keys.
  function handleGripKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowUp' && onMoveUp) {
      event.preventDefault()
      onMoveUp()
    }
    if (event.key === 'ArrowDown' && onMoveDown) {
      event.preventDefault()
      onMoveDown()
    }
  }

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
          onClick={() => !dimmed && onAdvance(task.id)}
          // The full title on hover, since a long one is cut with an ellipsis.
          title={task.title}
          className={cn(
            'truncate text-sm font-medium text-foreground',
            !dimmed && 'cursor-pointer',
            done && 'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </span>

        {task.repeats && (
          <p className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                'flex shrink-0 items-center gap-1 font-semibold tabular-nums',
                STREAK_TONE[streakTier(streak)],
              )}
              title={`${streak}-day streak`}
            >
              <IconFlame className="size-4" />
              {streak}
            </span>
            <span className="min-w-0 truncate">
              {formatWeekdays(task.weekdays)}
            </span>
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        {!dimmed && counter && (
          <>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onDecrement(task.id)}
              disabled={task.progress === 0}
              aria-label={`Subtract one from "${task.title}"`}
            >
              <IconMinus />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onAdvance(task.id)}
              disabled={done}
              aria-label={`Add one to "${task.title}"`}
            >
              <IconPlus />
            </Button>
          </>
        )}
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onStartEdit(task.id)}
          aria-label={`Edit "${task.title}"`}
        >
          <IconPencil />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onRemove(task.id)}
          aria-label={`Delete "${task.title}"`}
        >
          <IconTrash />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onKeyDown={handleGripKeyDown}
          aria-label={`Reorder "${task.title}". Use the arrow keys`}
          className="hidden cursor-grab active:cursor-grabbing sm:inline-flex"
        >
          <IconGripVertical />
        </Button>
      </div>
    </li>
  )
}
