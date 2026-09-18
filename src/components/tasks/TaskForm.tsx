import { useRef, type FormEvent } from 'react'

import { WeekdayPicker } from '@/components/tasks/WeekdayPicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useTaskForm } from '@/hooks/useTaskForm'
import { MAX_TARGET, MIN_TARGET } from '@/lib/config'
import { cn } from '@/lib/utils'
import type { NewTask, Task, TaskPatch } from '@/types'

type TaskFormProps = {
  // The task being edited; absent, the form creates a new one.
  editing?: Task
  onAdd: (task: NewTask) => void
  onSave: (id: string, patch: TaskPatch) => void
  onCancel: () => void
}

// The repeat options stay in place while switched off, only dimmed, so the
// form never jumps as the checkbox is used.
export function TaskForm({ editing, onAdd, onSave, onCancel }: TaskFormProps) {
  const form = useTaskForm(editing)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (editing) {
      onSave(editing.id, form.values)
      return
    }

    onAdd(form.values)
    form.reset()

    // Handing focus back lets someone chain several tasks without the mouse.
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <span className="stat-label">Task</span>
        <div className="mt-1">
          <Input
            ref={inputRef}
            value={form.title}
            onChange={(event) => form.setTitle(event.target.value)}
            placeholder="e.g. Drink water, Read…"
            aria-label={editing ? 'Edit task' : 'New task'}
          />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
        <Checkbox checked={form.repeats} onCheckedChange={form.setRepeats} />
        Repeats every day
      </label>

      <div
        aria-hidden={!form.repeats}
        className={cn(
          'flex flex-wrap gap-3 transition-opacity',
          !form.repeats && 'pointer-events-none opacity-40',
        )}
      >
        <div className="w-24 shrink-0">
          <span className="stat-label">Per day</span>
          <div className="mt-1">
            <Input
              type="number"
              inputMode="numeric"
              min={MIN_TARGET}
              max={MAX_TARGET}
              value={form.target}
              onChange={(event) => form.setTarget(event.target.value)}
              disabled={!form.repeats}
              aria-label="Repetitions per day"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 basis-56">
          <span className="stat-label">Days</span>
          <div className="mt-1">
            <WeekdayPicker
              value={form.weekdays}
              onChange={form.setWeekdays}
              disabled={!form.repeats}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={!form.isValid} className="flex-1">
          {editing ? 'Save changes' : 'Add task'}
        </Button>

        {editing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
