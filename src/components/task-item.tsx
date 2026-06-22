import { useState } from "react";
import { Check, Circle, Pencil, Trash2 } from "lucide-react";
import type { TaskItemProps } from "@/src/types";
import { cn } from "@/src/lib/utils";

export default function TaskItem({
  task,
  onToggle,
  onRename,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== task.title) onRename(next);
    else setDraft(task.title);
    setEditing(false);
  };

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

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(task.title);
              setEditing(false);
            }
          }}
          className="cyber-clip min-w-0 flex-1 border border-accent bg-surface-raised px-2 py-1 text-sm text-fg normal-case outline-none focus:ring-2 focus:ring-accent/30"
        />
      ) : (
        <p
          onDoubleClick={() => setEditing(true)}
          className={cn(
            "min-w-0 flex-1 cursor-pointer truncate text-sm normal-case leading-snug",
            task.done
              ? "font-semibold tracking-wide text-accent-soft"
              : "font-medium text-fg",
          )}
        >
          {task.title}
        </p>
      )}

      {!editing && (
        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="cursor-pointer rounded-sm p-1.5 text-fg-muted transition hover:bg-surface-raised hover:text-fg"
            aria-label="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="cursor-pointer rounded-sm p-1.5 text-fg-muted transition hover:bg-danger/10 hover:text-danger-fg"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
