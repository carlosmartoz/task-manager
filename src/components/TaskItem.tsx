import { Check, Circle, Clock, GripVertical, Pencil, Trash2, CalendarClock } from "lucide-react";
import { PRIORITY_META, type Task } from "../types";
import { cn, formatDate, isOverdue } from "../lib/utils";

interface TaskItemProps {
  task: Task;
  onCycleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dragging: boolean;
}

export default function TaskItem({
  task,
  onCycleStatus,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  dragging,
}: TaskItemProps) {
  const overdue = isOverdue(task.dueDate, task.status);
  const done = task.status === "done";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group flex cursor-grab items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900 p-3 transition active:cursor-grabbing hover:border-slate-700",
        dragging && "opacity-40"
      )}
    >
      <GripVertical
        size={16}
        className="mt-0.5 shrink-0 text-slate-600 transition group-hover:text-slate-500"
      />

      <button
        onClick={onCycleStatus}
        title="Cambiar estado"
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : task.status === "in_progress"
              ? "border-sky-500 text-sky-400"
              : "border-slate-600 text-transparent hover:border-slate-500"
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
            done ? "text-slate-500 line-through" : "text-slate-100"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
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
                  : "bg-slate-800 text-slate-400"
              )}
            >
              <CalendarClock size={11} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          aria-label="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          aria-label="Eliminar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
