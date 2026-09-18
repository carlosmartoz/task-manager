import { useState, type DragEvent, type KeyboardEvent } from 'react'
import {
  IconCheck,
  IconFlame,
  IconGripVertical,
  IconMinus,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'

import { TaskProgress } from '@/components/tasks/TaskProgress'
import { WeekdayPicker } from '@/components/tasks/WeekdayPicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useTaskForm } from '@/hooks/useTaskForm'
import { MAX_TARGET, MIN_TARGET } from '@/lib/config'
import { isTaskDone } from '@/lib/tasks'
import { cn } from '@/lib/utils'
import { formatWeekdays } from '@/lib/weekdays'
import type { Task, TaskPatch } from '@/types'

type TaskItemProps = {
  task: Task
  streak: number
  // The task is not due today: shown dimmed and without the progress control.
  dimmed?: boolean
  // The task being dragged right now, and the one it would land on.
  isDragging?: boolean
  isDragOver?: boolean
  onAdvance: (id: string) => void
  onDecrement: (id: string) => void
  onEdit: (id: string, patch: TaskPatch) => void
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
  isDragging = false,
  isDragOver = false,
  onAdvance,
  onDecrement,
  onEdit,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const form = useTaskForm(task)

  const done = isTaskDone(task)
  const counter = task.target > 1

  function startEditing() {
    form.reset(task)
    setIsEditing(true)
  }

  function save() {
    onEdit(task.id, form.values)
    setIsEditing(false)
  }

  function cancel() {
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') save()
    if (event.key === 'Escape') cancel()
  }

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
      draggable={!isEditing}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
      className={cn(
        'group flex items-center gap-3 py-3 transition-colors',
        dimmed && 'opacity-60',
        isDragging && 'opacity-40',
        isDragOver && 'bg-muted/50',
      )}
    >
      <span className="flex w-12 shrink-0 items-center">
        {dimmed ? (
          <span className="size-4.5 rounded-md border border-dashed border-border-strong" />
        ) : (
          <TaskProgress
            task={task}
            onAdvance={() => onAdvance(task.id)}
            disabled={isEditing}
          />
        )}
      </span>

      {isEditing ? (
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              value={form.title}
              onChange={(event) => form.setTitle(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Edit task"
            />
            {form.repeats && (
              <Input
                type="number"
                inputMode="numeric"
                min={MIN_TARGET}
                max={MAX_TARGET}
                value={form.target}
                onChange={(event) => form.setTarget(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Repetitions per day"
                className="w-20"
              />
            )}
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={save}
              disabled={!form.isValid}
              aria-label="Save changes"
            >
              <IconCheck />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={cancel}
              aria-label="Cancel editing"
            >
              <IconX />
            </Button>
          </div>

          <label className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
            <Checkbox checked={form.repeats} onCheckedChange={form.setRepeats} />
            Repeats every day
          </label>

          {form.repeats && (
            <WeekdayPicker value={form.weekdays} onChange={form.setWeekdays} />
          )}
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 flex-col">
            <span
              onClick={() => !dimmed && onAdvance(task.id)}
              className={cn(
                'text-sm font-medium wrap-break-word text-foreground',
                !dimmed && 'cursor-pointer',
                done && 'text-muted-foreground line-through',
              )}
            >
              {task.title}
            </span>

            {(streak > 0 || !task.repeats || task.weekdays.length > 0) && (
              <p className="mt-0.5 flex items-center gap-2 truncate text-xs text-muted-foreground">
                {streak > 0 && (
                  <span
                    className="flex items-center gap-1 font-semibold tabular-nums"
                    title={`${streak}-day streak`}
                  >
                    <IconFlame className="size-4" />
                    {streak}
                  </span>
                )}
                {!task.repeats ? (
                  <span>Once</span>
                ) : (
                  task.weekdays.length > 0 && (
                    <span>{formatWeekdays(task.weekdays)}</span>
                  )
                )}
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
              onClick={startEditing}
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
              className="cursor-grab active:cursor-grabbing"
            >
              <IconGripVertical />
            </Button>
          </div>
        </>
      )}
    </li>
  )
}
