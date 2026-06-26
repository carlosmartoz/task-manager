import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp } from "@/src/lib/motion";
import { ArrowLeft, ListTodo, Plus } from "lucide-react";
import TaskItem from "@/src/features/task-groups/components/task-item";
import { useGroupDetail } from "@/src/features/task-groups/hooks/use-group-detail";
import type { TaskGroupsDetailProps } from "@/src/features/task-groups/types/types";

export function TaskGroupsDetail({ taskGroup, onBack }: TaskGroupsDetailProps) {
  const {
    draft,
    setDraft,
    done,
    total,
    pct,
    allDone,
    add,
    askDelete,
    renameTask,
    toggleTask,
  } = useGroupDetail(taskGroup);

  return (
    <motion.div {...fadeIn}>
      <button
        onClick={onBack}
        className="mb-4 flex cursor-pointer items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-fg-muted transition hover:text-fg"
      >
        <ArrowLeft size={18} /> Back to task groups
      </button>

      <div className="cyber-clip mb-6 border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 bg-accent" />
          <div className="flex-1">
            <h1 className="text-xl font-bold normal-case tracking-wide text-fg-strong">
              {taskGroup.title}
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
          <p className="mt-1 text-right text-xs font-medium text-fg-subtle">
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
            {taskGroup.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(taskGroup.id, task.id)}
                onRename={(title) => renameTask(taskGroup.id, task.id, title)}
                onDelete={() => askDelete(task)}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
