import { useState } from "react";
import { useGroupsStore } from "@/src/features/task-groups/store/groups-store";
import type { Group } from "@/src/features/task-groups/types/types";

/** Orchestrates the task-groups screen: list, open/detail, create/edit and deletion. */
export function useTaskGroups() {
  const groups = useGroupsStore((s) => s.groups);
  const addGroup = useGroupsStore((s) => s.addGroup);
  const updateGroup = useGroupsStore((s) => s.updateGroup);
  const deleteGroup = useGroupsStore((s) => s.deleteGroup);
  const [openId, setOpenId] = useState<string | null>(null);

  const active = groups.find((g) => g.id === openId) ?? null;

  const openGroup = (id: string) => setOpenId(id);
  const back = () => setOpenId(null);

  // TODO: los modales se quitaron temporalmente; por ahora usamos prompt/confirm
  // nativos. Reemplazar por un modal propio cuando se reintroduzca el sistema.
  const createGroup = () => {
    const title = window.prompt("New task group name")?.trim();
    if (title) addGroup(title);
  };

  const editGroup = (group: Group) => {
    const title = window.prompt("Edit task group name", group.title)?.trim();
    if (title && title !== group.title) updateGroup(group.id, title);
  };

  const askDelete = (group: Group) => {
    const ok = window.confirm(
      `Delete "${group.title}" and all of its tasks? This cannot be undone.`,
    );
    if (ok) deleteGroup(group.id);
  };

  return { groups, active, openGroup, back, createGroup, editGroup, askDelete };
}
