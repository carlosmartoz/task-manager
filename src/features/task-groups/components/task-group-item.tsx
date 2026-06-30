import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/button";
import { Check, Circle, Trash2 } from "lucide-react";
import type { TaskItemProps } from "@/src/features/task-groups/types/task-groups";

export function TaskGroupItem({ task, onToggle, onDelete }: TaskItemProps) {
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
          "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2",
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
          "min-w-0 flex-1 text-sm",
          task.done
            ? "font-medium text-accent-soft"
            : "font-medium text-foreground",
        )}
      >
        {task.title}
      </p>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button
          icon={Trash2}
          iconSize={16}
          variant="delete"
          onClick={onDelete}
          ariaLabel="Delete"
        />
      </div>
    </div>
  );
}
