import { useState } from "react";
import { useGroupsStore } from "@/src/features/task-groups/store/groups-store";
import type { Group, Task } from "@/src/features/task-groups/types/types";

/** State and actions for a single group's task list (add / rename / toggle / delete + stats). */
export function useGroupDetail(group: Group) {
  const addTask = useGroupsStore((s) => s.addTask);
  const renameTask = useGroupsStore((s) => s.renameTask);
  const toggleTask = useGroupsStore((s) => s.toggleTask);
  const deleteTask = useGroupsStore((s) => s.deleteTask);
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

  const askDelete = (task: Task) => {
    const ok = window.confirm(`Delete "${task.title}"?`);
    if (ok) deleteTask(group.id, task.id);
  };

  return {
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
  };
}
