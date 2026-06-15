import { useMemo, useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useConfirm } from "../context/ConfirmProvider";
import {
  COLOR_STYLES,
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
  const { addTask, updateTask, deleteTask, setTaskStatus, moveTask } = useApp();
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null);
  const [dropIndex, setDropIndex] = useState<number>(0);

  const c = COLOR_STYLES[board.color];

  // Orden manual: respetamos el orden del array (sin re-ordenar por prioridad).
  const columns = useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        tasks: board.tasks.filter((t) => t.status === status),
      })),
    [board.tasks]
  );

  const done = board.tasks.filter((t) => t.status === "done").length;
  const total = board.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const handleSubmit = (draft: TaskDraft) => {
    if (editing) updateTask(board.id, { ...editing, ...draft });
    else addTask(board.id, draft);
    setEditing(null);
  };

  const resetDrag = () => {
    setDraggingId(null);
    setDragOverCol(null);
  };

  const handleDrop = (status: Status, colTasks: Task[]) => {
    if (draggingId) {
      const raw = dragOverCol === status ? dropIndex : colTasks.length;
      // Si la tarea ya está en esta columna, su posición desplaza el índice destino.
      const fromPos = colTasks.findIndex((t) => t.id === draggingId);
      const targetIndex = fromPos !== -1 && raw > fromPos ? raw - 1 : raw;
      moveTask(board.id, draggingId, status, targetIndex);
    }
    resetDrag();
  };

  const askDelete = async (task: Task) => {
    const ok = await confirm({
      title: "Delete task?",
      message: `"${task.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) deleteTask(board.id, task.id);
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-slate-100"
      >
        <ArrowLeft size={16} /> Back to boards
      </button>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className={cn("h-8 w-2 rounded-full", c.bar)} />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-50">{board.title}</h1>
            <p className="text-sm text-slate-300">
              {total} {total === 1 ? "task" : "tasks"} · {done} completed
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
          >
            <Plus size={16} /> Task
          </button>
        </div>

        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn("h-full rounded-full transition-all duration-500", c.bar)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs font-medium text-slate-400">
            {pct}% complete
          </p>
        </div>
      </div>

      <p className="mb-3 text-xs text-slate-400">
        💡 Drag tasks between columns to change their status, or reorder them within a column.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map(({ status, tasks }) => (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(status);
              setDropIndex(tasks.length); // sobre área vacía → al final
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node))
                setDragOverCol((s) => (s === status ? null : s));
            }}
            onDrop={() => handleDrop(status, tasks)}
            className={cn(
              "flex flex-col rounded-2xl border p-3 transition-colors duration-200",
              dragOverCol === status
                ? "border-indigo-500/70 bg-indigo-500/5"
                : "border-slate-800 bg-slate-900/40"
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_META[status].hex }}
                />
                <h3 className="text-sm font-semibold text-slate-100">
                  {STATUS_META[status].label}
                </h3>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                {tasks.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {tasks.length === 0 ? (
                <div
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-xl border border-dashed py-8 text-center text-xs transition-colors",
                    dragOverCol === status
                      ? "border-indigo-500/50 text-indigo-300"
                      : "border-slate-800 text-slate-400"
                  )}
                >
                  {dragOverCol === status ? "Drop here" : "No tasks"}
                </div>
              ) : (
                tasks.map((task, i) => (
                  <div key={task.id}>
                    {dragOverCol === status && dropIndex === i && (
                      <div className="mb-2 h-0.5 rounded-full bg-indigo-500" />
                    )}
                    <TaskItem
                      task={task}
                      index={i}
                      dragging={draggingId === task.id}
                      onDragStart={() => setDraggingId(task.id)}
                      onDragEnd={resetDrag}
                      onDragOverItem={(idx, after) => {
                        setDragOverCol(status);
                        setDropIndex(after ? idx + 1 : idx);
                      }}
                      onCycleStatus={() =>
                        setTaskStatus(board.id, task.id, nextStatus[task.status])
                      }
                      onEdit={() => {
                        setEditing(task);
                        setFormOpen(true);
                      }}
                      onDelete={() => askDelete(task)}
                    />
                    {dragOverCol === status &&
                      dropIndex === i + 1 &&
                      i === tasks.length - 1 && (
                        <div className="mt-2 h-0.5 rounded-full bg-indigo-500" />
                      )}
                  </div>
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
