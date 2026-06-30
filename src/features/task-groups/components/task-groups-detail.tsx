import { motion } from "framer-motion";
import { fadeIn } from "@/src/lib/motion";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { EmptyBox } from "@/src/components/empty-box";
import { ArrowLeft, ListTodo, Plus } from "lucide-react";
import { ProgressBar } from "@/src/components/progress-bar";
import { CompletionBanner } from "@/src/components/completion-banner";
import { TaskGroupItem } from "@/src/features/task-groups/components/task-group-item";
import type { TaskGroupsDetailProps } from "@/src/features/task-groups/types/task-groups";
import { useTaskGroupDetail } from "@/src/features/task-groups/hooks/use-task-group-detail";

export function TaskGroupsDetail({ taskGroup, onBack }: TaskGroupsDetailProps) {
  const {
    done,
    total,
    draft,
    allDone,
    onCreate,
    setDraft,
    onDelete,
    toggleTask,
    completionPercent,
  } = useTaskGroupDetail(taskGroup);

  return (
    <motion.div {...fadeIn}>
      <Button icon={ArrowLeft} iconSize={18} variant="ghost" onClick={onBack}>
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
          <ProgressBar value={completionPercent} />

          <p className="mt-2 text-right text-xs font-medium text-foreground-muted">
            {completionPercent}% COMPLETE
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
        <EmptyBox
          icon={ListTodo}
          title="No tasks yet"
          description="Add your first task above."
        />
      ) : (
        <>
          <CompletionBanner
            done={done}
            total={total}
            allDone={allDone}
            clearedText="All tasks cleared."
          />

          <div className="space-y-2">
            {taskGroup.tasks.map((task) => (
              <TaskGroupItem
                task={task}
                key={task.id}
                onDelete={() => onDelete(task)}
                onToggle={() => toggleTask(taskGroup.id, task.id)}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
