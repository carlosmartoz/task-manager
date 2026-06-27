import { Check, Circle, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { TaskItemProps } from "@/src/features/task-groups/types/task-groups";

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={cn(
        "group cyber-clip flex items-center gap-2.5 border p-3 transition-all duration-200",
        task.done
          ? "border-accent/50 bg-accent/10"
          : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <button
        onClick={onToggle}
        title="Toggle done"
        className={cn(
          "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90",
          task.done
            ? "border-accent bg-accent text-inverse"
            : "border-fg-faint text-transparent hover:border-accent",
        )}
      >
        {task.done ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <Circle size={7} className="fill-current" />
        )}
      </button>

      <p
        className={cn(
          "min-w-0 flex-1 truncate text-sm normal-case leading-snug",
          task.done
            ? "font-semibold tracking-wide text-accent-soft"
            : "font-medium text-fg",
        )}
      >
        {task.title}
      </p>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={onDelete}
          className="cursor-pointer rounded-sm p-1.5 text-fg-muted transition hover:bg-danger/10 hover:text-danger-fg"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
