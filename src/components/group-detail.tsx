import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ListTodo, Plus } from "lucide-react";
import { fadeIn, fadeInUp } from "@/src/lib/motion";
import { useAppStore } from "@/src/store/app-store";
import { useConfirm } from "@/src/store/confirm-store";
import type { GroupDetailProps, Task } from "@/src/types";
import { cn } from "@/src/lib/utils";
import TaskItem from "@/src/components/task-item";

export default function GroupDetail({ group, onBack }: GroupDetailProps) {
  const addTask = useAppStore((s) => s.addTask);
  const renameTask = useAppStore((s) => s.renameTask);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const confirm = useConfirm();
  const [draft, setDraft] = useState("");

  const done = group.tasks.filter((t) => t.done).length;
  const total = group.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    addTask(group.id, title);
    setDraft("");
  };

  const askDelete = async (task: Task) => {
    const ok = await confirm({
      title: "Delete task?",
      message: `"${task.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) deleteTask(group.id, task.id);
  };

  return (
    <motion.div {...fadeIn}>
      <button
        onClick={onBack}
        className="mb-4 flex cursor-pointer items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wide text-fg-muted transition hover:text-fg"
      >
        <ArrowLeft size={18} /> Back to task groups
      </button>

      <div className="cyber-clip mb-6 border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 bg-accent" />
          <div className="flex-1">
            <h1 className="font-mono text-xl font-bold normal-case tracking-wide text-fg-strong">
              {group.title}
            </h1>
            <p className="text-sm text-fg-muted normal-case">
              {total} {total === 1 ? "task" : "tasks"} · {done} done
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1.5 overflow-hidden bg-surface-raised">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-right font-mono text-xs font-medium text-fg-subtle">
            {pct}% COMPLETE
          </p>
        </div>
      </div>

      <form onSubmit={add} className="mb-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task…"
          className="cyber-clip min-w-0 flex-1 border border-border-strong bg-surface-raised px-3 py-3 text-sm text-fg placeholder-fg-subtle outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-1.5 rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-soft transition hover:bg-accent/20 active:scale-95"
        >
          <Plus size={20} /> Add
        </button>
      </form>

      {total === 0 ? (
        <motion.div
          {...fadeInUp}
          className="cyber-clip border border-dashed border-border py-16 text-center normal-case"
        >
          <ListTodo className="mx-auto mb-3 text-fg-ghost" size={40} />
          <p className="font-medium text-fg-label">No tasks yet</p>
          <p className="text-sm text-fg-subtle">Add your first task above.</p>
        </motion.div>
      ) : (
        <>
          <div
            className={cn(
              "cyber-clip mb-4 border px-4 py-3 text-sm normal-case",
              allDone
                ? "border-accent/50 bg-accent/10 text-accent-soft"
                : "border-border bg-surface text-fg-label",
            )}
          >
            {allDone ? (
              <span className="font-semibold uppercase tracking-wide">
                All tasks cleared.
              </span>
            ) : (
              <>
                You've completed{" "}
                <span className="font-semibold text-accent">{done}</span> of{" "}
                <span className="font-semibold text-fg-strong">{total}</span>{" "}
                tasks.
              </>
            )}
          </div>

          <div className="space-y-2">
            {group.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(group.id, task.id)}
                onRename={(title) => renameTask(group.id, task.id, title)}
                onDelete={() => askDelete(task)}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
