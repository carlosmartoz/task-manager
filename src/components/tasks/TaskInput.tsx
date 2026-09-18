import { useRef, type FormEvent } from 'react'

import { WeekdayPicker } from '@/components/tasks/WeekdayPicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useTaskForm } from '@/hooks/useTaskForm'
import { MAX_TARGET, MIN_TARGET } from '@/lib/config'
import type { NewTask } from '@/types'

type TaskInputProps = {
  onAdd: (task: NewTask) => void
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const form = useTaskForm()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
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
            aria-label="New task"
          />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
        <Checkbox checked={form.repeats} onCheckedChange={form.setRepeats} />
        Repeats every day
      </label>

      {form.repeats && (
        <div className="flex flex-wrap gap-3">
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
                aria-label="Repetitions per day"
              />
            </div>
          </div>

          <div className="min-w-56 flex-1">
            <span className="stat-label">Days</span>
            <div className="mt-1">
              <WeekdayPicker
                value={form.weekdays}
                onChange={form.setWeekdays}
              />
            </div>
          </div>
        </div>
      )}

      <Button type="submit" disabled={!form.isValid} className="w-full">
        Add task
      </Button>
    </form>
  )
}
