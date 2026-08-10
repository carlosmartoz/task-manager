import { useState, type KeyboardEvent } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onEdit: (id: string, title: string) => void
  onRemove: (id: string) => void
}

export function TaskItem({ task, onToggle, onEdit, onRemove }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  function startEditing() {
    setDraft(task.title)
    setIsEditing(true)
  }

  function save() {
    onEdit(task.id, draft)
    setIsEditing(false)
  }

  function cancel() {
    setDraft(task.title)
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') save()
    if (event.key === 'Escape') cancel()
  }

  return (
    <li className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/40">
      <Checkbox
        checked={task.done}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={`Marcar "${task.title}" como completada`}
        disabled={isEditing}
      />

      {isEditing ? (
        <>
          <Input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Editar tarea"
          />
          <div className="flex items-center gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={save}
              disabled={!draft.trim()}
              aria-label="Guardar cambios"
            >
              <Check />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={cancel}
              aria-label="Cancelar edición"
            >
              <X />
            </Button>
          </div>
        </>
      ) : (
        <>
          <span
            onClick={() => onToggle(task.id)}
            className={cn(
              'flex-1 cursor-pointer text-sm break-words',
              task.done && 'text-muted-foreground line-through',
            )}
          >
            {task.title}
          </span>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={startEditing}
              aria-label={`Editar "${task.title}"`}
            >
              <Pencil />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onRemove(task.id)}
              aria-label={`Eliminar "${task.title}"`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>
        </>
      )}
    </li>
  )
}
