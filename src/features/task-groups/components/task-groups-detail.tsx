import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp } from "@/src/lib/motion";
import { ArrowLeft, ListTodo, Plus } from "lucide-react";
import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import TaskItem from "@/src/features/task-groups/components/task-item";
import { useTaskGroupDetail } from "@/src/features/task-groups/hooks/use-task-group-detail";
import type { TaskGroupsDetailProps } from "@/src/features/task-groups/types/task-groups";

export function TaskGroupsDetail({ taskGroup, onBack }: TaskGroupsDetailProps) {
  const {
    pct,
    done,
    total,
    draft,
    allDone,
    onCreate,
    setDraft,
    editTask,
    onDelete,
    toggleTask,
  } = useTaskGroupDetail(taskGroup);

  return (
    <motion.div {...fadeIn}>
      <Button icon={ArrowLeft} variant="ghost" onClick={onBack}>
        Back to task groups
      </Button>

      <div className="cyber-clip mb-6 mt-4 border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 bg-accent" />

          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {taskGroup.title}
            </h1>

            <p className="text-sm text-foreground-muted">
              {total} {total === 1 ? "task" : "tasks"} · {done} done
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1 overflow-hidden bg-surface-raised">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="mt-2 text-right text-xs font-medium text-foreground-muted">
            {pct}% COMPLETE
          </p>
        </div>
      </div>

      <form onSubmit={onCreate} className="mb-4 flex gap-2">
        <Input value={draft} onChange={setDraft} placeholder="Add a task…" />

        <Button icon={Plus} type="submit">
          Add
        </Button>
      </form>

      {total === 0 ? (
        <motion.div
          {...fadeInUp}
          className="cyber-clip border border-dashed border-accent py-16 text-center normal-case"
        >
          <ListTodo className="mx-auto mb-3 text-foreground" size={40} />

          <p className="font-medium text-foreground">No tasks yet</p>

          <p className="text-sm text-foreground-muted">
            Add your first task above.
          </p>
        </motion.div>
      ) : (
        <>
          <div
            className={cn(
              "cyber-clip mb-4 border px-4 py-3 text-sm normal-case",
              allDone
                ? "border-accent/50 bg-accent/10 text-accent-soft"
                : "border-border bg-surface text-foreground",
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
                <span className="font-semibold text-foreground">{total}</span>{" "}
                tasks.
              </>
            )}
          </div>

          <div className="space-y-2">
            {taskGroup.tasks.map((task) => (
              <TaskItem
                task={task}
                key={task.id}
                onDelete={() => onDelete(task)}
                onToggle={() => toggleTask(taskGroup.id, task.id)}
                onRename={(title) => editTask(taskGroup.id, task.id, title)}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
