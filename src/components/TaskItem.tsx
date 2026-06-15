import { Check, Circle, Clock, GripVertical, Pencil, Trash2, CalendarClock } from "lucide-react";
import { PRIORITY_META, type Task } from "../types";
import { cn, formatDate, isOverdue } from "../lib/utils";

interface TaskItemProps {
  task: Task;
  index: number;
  onCycleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverItem: (index: number, after: boolean) => void;
  dragging: boolean;
}

export default function TaskItem({
  task,
  index,
  onCycleStatus,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverItem,
  dragging,
}: TaskItemProps) {
  const overdue = isOverdue(task.dueDate, task.status);
  const done = task.status === "done";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const r = e.currentTarget.getBoundingClientRect();
        onDragOverItem(index, e.clientY > r.top + r.height / 2);
      }}
      className={cn(
        "group flex cursor-grab items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900 p-3 transition-all duration-200 active:cursor-grabbing hover:border-slate-700 hover:shadow-md hover:shadow-black/20",
        dragging && "opacity-40"
      )}
    >
      <GripVertical
        size={16}
        className="mt-0.5 shrink-0 text-slate-500 transition-colors group-hover:text-slate-400"
      />

      <button
        onClick={onCycleStatus}
        title="Change status"
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : task.status === "in_progress"
              ? "border-sky-500 text-sky-300"
              : "border-slate-500 text-transparent hover:border-slate-400"
        )}
      >
        {done ? (
          <Check size={12} strokeWidth={3} />
        ) : task.status === "in_progress" ? (
          <Clock size={12} strokeWidth={3} />
        ) : (
          <Circle size={6} className="fill-current" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            done ? "text-slate-400 line-through" : "text-slate-100"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-300">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[11px] font-medium",
              PRIORITY_META[task.priority].chip
            )}
          >
            {PRIORITY_META[task.priority].label}
          </span>

          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                overdue
                  ? "bg-rose-500/15 text-rose-300"
                  : "bg-slate-800 text-slate-300"
              )}
            >
              <CalendarClock size={11} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
