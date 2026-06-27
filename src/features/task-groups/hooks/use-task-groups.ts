import { useState } from "react";
import type { TaskGroup } from "@/src/features/task-groups/types/task-groups";
import { useTaskGroupsStore } from "@/src/features/task-groups/store/task-groups";

export function useTaskGroups() {
  const taskGroups = useTaskGroupsStore((s) => s.taskGroups);

  const createTaskGroup = useTaskGroupsStore((s) => s.createTaskGroup);

  const editTaskGroup = useTaskGroupsStore((s) => s.editTaskGroup);

  const deleteTaskGroup = useTaskGroupsStore((s) => s.deleteTaskGroup);

  const [open, setOpen] = useState<string | null>(null);

  const active = taskGroups.find((g) => g.id === open) ?? null;

  const onOpen = (id: string) => setOpen(id);

  const onBack = () => setOpen(null);

  const onCreate = () => {
    const title = window.prompt("New task group name")?.trim();

    if (title) createTaskGroup(title);
  };

  const onEdit = (group: TaskGroup) => {
    const title = window.prompt("Edit task group name", group.title)?.trim();

    if (title && title !== group.title) editTaskGroup(group.id, title);
  };

  const onDelete = (group: TaskGroup) => {
    const ok = window.confirm(
      `Delete "${group.title}" and all of its tasks? This cannot be undone.`,
    );

    if (ok) deleteTaskGroup(group.id);
  };

  return {
    taskGroups,
    active,
    onOpen,
    onBack,
    onCreate,
    onEdit,
    onDelete,
  };
}
