import { useState } from "react";
import type {
  Task,
  TaskGroup,
} from "@/src/features/task-groups/types/task-groups";
import { useTaskGroupsStore } from "@/src/features/task-groups/store/task-groups";

export function useTaskGroupDetail(group: TaskGroup) {
  const createTask = useTaskGroupsStore((s) => s.createTask);

  const toggleTask = useTaskGroupsStore((s) => s.toggleTask);

  const deleteTask = useTaskGroupsStore((s) => s.deleteTask);

  const [draft, setDraft] = useState("");

  const done = group.tasks.filter((t) => t.done).length;

  const total = group.tasks.length;

  const pct = total ? Math.round((done / total) * 100) : 0;

  const allDone = total > 0 && done === total;

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const title = draft.trim();

    if (!title) return;

    createTask(group.id, title);

    setDraft("");
  };

  const onDelete = (task: Task) => {
    const ok = window.confirm(`Delete "${task.title}"?`);

    if (ok) deleteTask(group.id, task.id);
  };

  return {
    pct,
    done,
    draft,
    total,
    allDone,
    setDraft,
    onDelete,
    onCreate,
    toggleTask,
  };
}
