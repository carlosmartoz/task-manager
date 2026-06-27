import { useState } from "react";
import type { TaskItemProps } from "@/src/features/task-groups/types/task-groups";

/** Inline edit state for a single task row. */
export function useTaskItem({
  task,
  onRename,
}: Pick<TaskItemProps, "task" | "onRename">) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const startEdit = () => setEditing(true);

  const cancelEdit = () => {
    setDraft(task.title);
    setEditing(false);
  };

  const commit = () => {
    const next = draft.trim();
    if (next && next !== task.title) onRename(next);
    else setDraft(task.title);
    setEditing(false);
  };

  return { editing, draft, setDraft, startEdit, cancelEdit, commit };
}
