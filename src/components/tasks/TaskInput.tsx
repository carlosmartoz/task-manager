import { useRef, useState, type FormEvent } from 'react'
import { IconAdjustmentsHorizontal, IconPlus } from '@tabler/icons-react'

import { WeekdayPicker } from '@/components/WeekdayPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { NewTask } from '@/hooks/useTasks'
import { MAX_TARGET, MIN_TARGET, type Weekday } from '@/types/task'

type TaskInputProps = {
  onAdd: (task: NewTask) => void
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('1')
  const [weekdays, setWeekdays] = useState<Weekday[]>([])
  const [showOptions, setShowOptions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onAdd({ title, target: Number(target) || MIN_TARGET, weekdays })

    setTitle('')
    setTarget('1')
    setWeekdays([])
    // Devolver el foco permite encadenar varias tareas sin tocar el ratón.
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="¿Qué tienes que hacer hoy?"
          aria-label="Nueva tarea"
          className="h-10"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={() => setShowOptions((prev) => !prev)}
          aria-expanded={showOptions}
          aria-label="Meta diaria y días de la semana"
          className="h-10"
        >
          <IconAdjustmentsHorizontal />
        </Button>
        <Button type="submit" size="lg" disabled={!title.trim()} className="h-10">
          <IconPlus />
          Añadir
        </Button>
      </div>

      {showOptions && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-dashed border-border px-3 py-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Repeticiones al día
            <Input
              type="number"
              inputMode="numeric"
              min={MIN_TARGET}
              max={MAX_TARGET}
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="w-16"
            />
          </label>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Días
            <WeekdayPicker value={weekdays} onChange={setWeekdays} />
          </div>
        </div>
      )}
    </form>
  )
}
