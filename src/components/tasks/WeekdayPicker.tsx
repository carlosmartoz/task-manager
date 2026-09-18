import { cn } from '@/lib/utils'
import { WEEKDAYS, selectedWeekdays, toggleWeekday } from '@/lib/weekdays'
import type { Weekday } from '@/types'

type WeekdayPickerProps = {
  value: Weekday[]
  onChange: (weekdays: Weekday[]) => void
}

export function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  const selected = selectedWeekdays(value)

  return (
    <div
      role="group"
      aria-label="Days the task is due"
      className="grid grid-cols-7 gap-1 rounded-xl bg-muted p-1"
    >
      {WEEKDAYS.map(({ value: day, short, long }) => {
        const active = selected.includes(day)

        return (
          <button
            key={day}
            type="button"
            onClick={() => onChange(toggleWeekday(value, day))}
            aria-pressed={active}
            aria-label={long}
            className={cn(
              'rounded-lg py-2 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-subtle-foreground/40 focus-visible:outline-none',
              active
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {short}
          </button>
        )
      })}
    </div>
  )
}
