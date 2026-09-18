import { useState, type KeyboardEvent } from 'react'
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconFlame,
  IconMinus,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react'

import { TaskProgress } from '@/components/TaskProgress'
import { WeekdayPicker } from '@/components/WeekdayPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TaskPatch } from '@/hooks/useTasks'
import { formatWeekdays } from '@/lib/date'
import { isTaskDone } from '@/lib/tasks'
import { cn } from '@/lib/utils'
import { MAX_TARGET, MIN_TARGET, type Task, type Weekday } from '@/types/task'

type TaskItemProps = {
  task: Task
  streak: number
  /** La tarea no toca hoy: se muestra apagada y sin control de progreso. */
  dimmed?: boolean
  onAdvance: (id: string) => void
  onDecrement: (id: string) => void
  onEdit: (id: string, patch: TaskPatch) => void
  /** Ausente cuando la tarea ya es la primera de la lista visible. */
  onMoveUp?: () => void
  /** Ausente cuando la tarea ya es la última de la lista visible. */
  onMoveDown?: () => void
  onRemove: (id: string) => void
}

export function TaskItem({
  task,
  streak,
  dimmed = false,
  onAdvance,
  onDecrement,
  onEdit,
  onMoveUp,
  onMoveDown,
  onRemove,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [target, setTarget] = useState(String(task.target))
  const [weekdays, setWeekdays] = useState<Weekday[]>(task.weekdays)

  const done = isTaskDone(task)

  function startEditing() {
    setTitle(task.title)
    setTarget(String(task.target))
    setWeekdays(task.weekdays)
    setIsEditing(true)
  }

  function save() {
    onEdit(task.id, {
      title,
      target: Number(target) || MIN_TARGET,
      weekdays,
    })
    setIsEditing(false)
  }

  function cancel() {
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') save()
    if (event.key === 'Escape') cancel()
  }

  return (
    <li
      className={cn(
        'group flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/40',
        dimmed && 'opacity-60',
      )}
    >
      {dimmed ? (
        <span className="mt-1 size-4 shrink-0 rounded-full border border-dashed border-border" />
      ) : (
        <div className="mt-0.5">
          <TaskProgress
            task={task}
            onAdvance={() => onAdvance(task.id)}
            disabled={isEditing}
          />
        </div>
      )}

      {isEditing ? (
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Editar tarea"
            />
            <Input
              type="number"
              inputMode="numeric"
              min={MIN_TARGET}
              max={MAX_TARGET}
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Repeticiones al día"
              className="w-16"
            />
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={save}
              disabled={!title.trim()}
              aria-label="Guardar cambios"
            >
              <IconCheck />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={cancel}
              aria-label="Cancelar edición"
            >
              <IconX />
            </Button>
          </div>

          <WeekdayPicker value={weekdays} onChange={setWeekdays} />
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
              onClick={() => !dimmed && onAdvance(task.id)}
              className={cn(
                'text-sm wrap-break-word',
                !dimmed && 'cursor-pointer',
                done && 'text-muted-foreground line-through',
              )}
            >
              {task.title}
            </span>

            {(streak > 0 || task.weekdays.length > 0) && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                {streak > 0 && (
                  <span
                    className="flex items-center gap-0.5"
                    title={`Racha de ${streak} ${streak === 1 ? 'día' : 'días'}`}
                  >
                    <IconFlame className="size-3.5" />
                    {streak}
                  </span>
                )}
                {task.weekdays.length > 0 && (
                  <span>{formatWeekdays(task.weekdays)}</span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {!dimmed && task.target > 1 && task.progress > 0 && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => onDecrement(task.id)}
                aria-label={`Restar una a "${task.title}"`}
              >
                <IconMinus />
              </Button>
            )}
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onMoveUp}
              disabled={!onMoveUp}
              aria-label={`Subir "${task.title}"`}
            >
              <IconChevronUp />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onMoveDown}
              disabled={!onMoveDown}
              aria-label={`Bajar "${task.title}"`}
            >
              <IconChevronDown />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={startEditing}
              aria-label={`Editar "${task.title}"`}
            >
              <IconPencil />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onRemove(task.id)}
              aria-label={`Eliminar "${task.title}"`}
              className="text-muted-foreground hover:text-destructive"
            >
              <IconTrash />
            </Button>
          </div>
        </>
      )}
    </li>
  )
}
