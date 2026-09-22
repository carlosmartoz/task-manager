import type { KeyboardEvent } from 'react'
import {
  IconArrowBackUp,
  IconGripVertical,
  IconMinus,
  IconPencil,
  IconPlayerSkipForward,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { canSkip, isTaskDone } from '@/lib/tasks'
import type { Task } from '@/types'

type TaskActionsProps = {
  task: Task
  // Not due today: the counter buttons are left out.
  dimmed: boolean
  onAdvance: (id: string) => void
  onDecrement: (id: string) => void
  onSkip: (id: string) => void
  onUnskip: (id: string) => void
  onStartEdit: (id: string) => void
  onRemove: (id: string) => void
  // Absent when the task is already first in the visible list.
  onMoveUp?: () => void
  // Absent when the task is already last in the visible list.
  onMoveDown?: () => void
}

// The row's buttons; on a wide screen they only show on hover or focus.
export function TaskActions({
  task,
  dimmed,
  onAdvance,
  onDecrement,
  onSkip,
  onUnskip,
  onStartEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: TaskActionsProps) {
  const hasCounter = !dimmed && !task.skipped && task.target > 1

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

  return (
    <div className="flex shrink-0 items-center gap-0.5 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
      {hasCounter && (
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
            disabled={isTaskDone(task)}
            aria-label={`Add one to "${task.title}"`}
          >
            <IconPlus />
          </Button>
        </>
      )}
      {!dimmed && task.skipped && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onUnskip(task.id)}
          aria-label={`Undo skipping "${task.title}"`}
        >
          <IconArrowBackUp />
        </Button>
      )}
      {!dimmed && !task.skipped && canSkip(task) && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onSkip(task.id)}
          aria-label={`Skip "${task.title}" today`}
        >
          <IconPlayerSkipForward />
        </Button>
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
  )
}
