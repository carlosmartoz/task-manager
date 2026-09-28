import type { KeyboardEvent } from 'react'
import {
  IconChevronDown,
  IconChevronUp,
  IconGripVertical,
  IconMinus,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { canAdvance } from '@/lib/tasks'
import type { Task } from '@/types'

type TaskActionsProps = {
  task: Task
  // Not due today: the counter buttons are left out.
  dimmed: boolean
  onAdvance: (id: string) => void
  onDecrement: (id: string) => void
  onStartEdit: (id: string) => void
  onRemove: (id: string) => void
  // Absent when the task is already first in the visible list.
  onMoveUp?: () => void
  // Absent when the task is already last in the visible list.
  onMoveDown?: () => void
}

// The row's buttons; on a wide screen they only show on hover or focus. Touch
// fires no native drag, so on a phone arrows take the place of the grip.
export function TaskActions({
  task,
  dimmed,
  onAdvance,
  onDecrement,
  onStartEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: TaskActionsProps) {
  const hasCounter = !dimmed && task.target > 1
  const count = `${task.title}: ${task.progress} of ${task.target}`

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
            aria-label={`${count}. Subtract one`}
          >
            <IconMinus />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onAdvance(task.id)}
            disabled={!canAdvance(task)}
            aria-label={`${count}. Add one`}
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
      {(onMoveUp || onMoveDown) && (
        <div className="flex flex-col sm:hidden">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            aria-label={`Move "${task.title}" up`}
          >
            <IconChevronUp />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            aria-label={`Move "${task.title}" down`}
          >
            <IconChevronDown />
          </Button>
        </div>
      )}
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
