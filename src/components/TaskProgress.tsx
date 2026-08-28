import { Checkbox } from '@/components/ui/checkbox'
import { isTaskDone } from '@/lib/tasks'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

type TaskProgressProps = {
  task: Task
  onAdvance: () => void
  disabled?: boolean
}

/**
 * Control único para los dos casos: con `target` 1 es un checkbox normal y con
 * meta mayor una píldora «3/8» que se rellena. Un clic siempre avanza; al
 * llegar a la meta, el siguiente vuelve a cero.
 */
export function TaskProgress({ task, onAdvance, disabled }: TaskProgressProps) {
  const done = isTaskDone(task)

  if (task.target === 1) {
    return (
      <Checkbox
        checked={done}
        onCheckedChange={onAdvance}
        disabled={disabled}
        aria-label={`Marcar "${task.title}" como completada`}
      />
    )
  }

  const percent = Math.round((task.progress / task.target) * 100)

  return (
    <button
      type="button"
      onClick={onAdvance}
      disabled={disabled}
      aria-label={`${task.title}: ${task.progress} de ${task.target}. Sumar una`}
      className={cn(
        'relative h-7 w-14 shrink-0 overflow-hidden rounded-full border text-xs font-medium tabular-nums transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        done
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border hover:bg-muted',
      )}
    >
      {!done && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-primary/20 transition-[width]"
          style={{ width: `${percent}%` }}
        />
      )}
      <span className="relative">
        {task.progress}/{task.target}
      </span>
    </button>
  )
}
