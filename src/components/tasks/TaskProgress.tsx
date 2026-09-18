import { Checkbox } from '@/components/ui/checkbox'
import { isTaskDone, progressPercent } from '@/lib/tasks'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

type TaskProgressProps = {
  task: Task
  onAdvance: () => void
  disabled?: boolean
}

// With `target` 1 it is a checkbox; with a higher target, a read-only "3/8"
// pill: the counter is moved by the + and − buttons of the row.
export function TaskProgress({ task, onAdvance, disabled }: TaskProgressProps) {
  const done = isTaskDone(task)

  if (task.target === 1) {
    return (
      <Checkbox
        checked={done}
        onCheckedChange={onAdvance}
        disabled={disabled}
        aria-label={`Mark "${task.title}" as done`}
      />
    )
  }

  return (
    <span
      title={`${task.progress} of ${task.target} today`}
      className={cn(
        'relative h-6 w-12 shrink-0 overflow-hidden rounded-full border text-xs font-semibold tabular-nums',
        'flex items-center justify-center',
        done
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border-strong bg-muted text-muted-foreground',
      )}
    >
      {!done && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-primary/25 transition-[width]"
          style={{ width: `${progressPercent(task)}%` }}
        />
      )}
      <span className="relative">
        {task.progress}/{task.target}
      </span>
    </span>
  )
}
