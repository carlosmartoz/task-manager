import { useMemo, useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  COLOR_STYLES,
  PRIORITY_META,
  STATUS_META,
  STATUSES,
  type Board,
  type Status,
  type Task,
} from "../types";
import { cn } from "../lib/utils";
import TaskItem from "./TaskItem";
import TaskForm, { type TaskDraft } from "./TaskForm";

interface BoardDetailProps {
  board: Board;
  onBack: () => void;
}

const nextStatus: Record<Status, Status> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

export default function BoardDetail({ board, onBack }: BoardDetailProps) {
  const { addTask, updateTask, deleteTask, setTaskStatus } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);

  const c = COLOR_STYLES[board.color];

  const columns = useMemo(() => {
    const sortFn = (a: Task, b: Task) =>
      PRIORITY_META[a.priority].order - PRIORITY_META[b.priority].order;
    return STATUSES.map((status) => ({
      status,
      tasks: board.tasks.filter((t) => t.status === status).sort(sortFn),
    }));
  }, [board.tasks]);

  const done = board.tasks.filter((t) => t.status === "done").length;
  const total = board.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const handleSubmit = (draft: TaskDraft) => {
    if (editing) updateTask(board.id, { ...editing, ...draft });
    else addTask(board.id, draft);
    setEditing(null);
  };

  const handleDrop = (status: Status) => {
    if (draggingId) {
      const task = board.tasks.find((t) => t.id === draggingId);
      if (task && task.status !== status) setTaskStatus(board.id, draggingId, status);
    }
    setDraggingId(null);
    setDragOver(null);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft size={16} /> Volver a las cards
      </button>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className={cn("h-8 w-2 rounded-full", c.bar)} />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-100">{board.title}</h1>
            <p className="text-sm text-slate-400">
              {total} {total === 1 ? "tarea" : "tareas"} · {done} completadas
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus size={16} /> Tarea
          </button>
        </div>

        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn("h-full rounded-full transition-all", c.bar)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs font-medium text-slate-500">
            {pct}% completado
          </p>
        </div>
      </div>

      <p className="mb-3 text-xs text-slate-500">
        💡 Arrastra las tareas entre columnas para cambiar su estado.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map(({ status, tasks }) => (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(status);
            }}
            onDragLeave={(e) => {
              // solo limpiar si se sale del contenedor, no de un hijo
              if (!e.currentTarget.contains(e.relatedTarget as Node))
                setDragOver(null);
            }}
            onDrop={() => handleDrop(status)}
            className={cn(
              "flex flex-col rounded-2xl border bg-slate-900/50 p-3 transition",
              dragOver === status
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-slate-800"
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_META[status].hex }}
                />
                <h3 className="text-sm font-semibold text-slate-200">
                  {STATUS_META[status].label}
                </h3>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
                {tasks.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {tasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-800 py-8 text-center text-xs text-slate-600">
                  Sin tareas
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    dragging={draggingId === task.id}
                    onDragStart={() => setDraggingId(task.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOver(null);
                    }}
                    onCycleStatus={() =>
                      setTaskStatus(board.id, task.id, nextStatus[task.status])
                    }
                    onEdit={() => {
                      setEditing(task);
                      setFormOpen(true);
                    }}
                    onDelete={() => {
                      if (confirm(`¿Eliminar "${task.title}"?`))
                        deleteTask(board.id, task.id);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        task={editing ?? undefined}
      />
    </div>
  );
}
