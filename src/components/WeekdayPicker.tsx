import { WEEKDAYS } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { Weekday } from '@/types/task'

type WeekdayPickerProps = {
  value: Weekday[]
  onChange: (weekdays: Weekday[]) => void
}

const ALL_DAYS = WEEKDAYS.map(({ value }) => value)

/**
 * Una lista vacía significa «todos los días», así que aquí se muestran los
 * siete marcados y se normaliza de vuelta a vacío cuando el usuario los activa
 * todos. Nunca se permite dejar cero días: sería indistinguible de «todos».
 */
export function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  const selected = value.length === 0 ? ALL_DAYS : value

  function toggle(day: Weekday) {
    const next = selected.includes(day)
      ? selected.filter((candidate) => candidate !== day)
      : [...selected, day]

    if (next.length === 0) return
    onChange(next.length === ALL_DAYS.length ? [] : next.sort((a, b) => a - b))
  }

  return (
    <div
      role="group"
      aria-label="Días en que toca la tarea"
      className="flex items-center gap-1"
    >
      {WEEKDAYS.map(({ value: day, short, long }) => {
        const active = selected.includes(day)

        return (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            aria-pressed={active}
            aria-label={long}
            className={cn(
              'size-7 rounded-md border text-xs font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:bg-muted',
            )}
          >
            {short}
          </button>
        )
      })}
    </div>
  )
}
