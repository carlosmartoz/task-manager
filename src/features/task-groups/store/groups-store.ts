import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Group } from "@/src/features/task-groups/types/types";
import { uid } from "@/src/lib/utils";

/** Store for the task-groups feature: groups and their tasks, persisted. */
interface GroupsStore {
  groups: Group[];

  // Grupos
  addGroup: (title: string) => void;
  updateGroup: (id: string, title: string) => void;
  deleteGroup: (id: string) => void;

  // Tareas dentro de un grupo
  addTask: (groupId: string, title: string) => void;
  renameTask: (groupId: string, taskId: string, title: string) => void;
  toggleTask: (groupId: string, taskId: string) => void;
  deleteTask: (groupId: string, taskId: string) => void;
}

export const useGroupsStore = create<GroupsStore>()(
  persist(
    (set) => ({
      groups: seedGroups(),

      addGroup: (title) =>
        set((s) => ({
          groups: [
            ...s.groups,
            { id: uid(), title, createdAt: new Date().toISOString(), tasks: [] },
          ],
        })),

      updateGroup: (id, title) =>
        set((s) => ({
          groups: s.groups.map((g) => (g.id === id ? { ...g, title } : g)),
        })),

      deleteGroup: (id) =>
        set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),

      addTask: (groupId, title) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  tasks: [
                    {
                      id: uid(),
                      title,
                      done: false,
                      createdAt: new Date().toISOString(),
                    },
                    ...g.tasks,
                  ],
                }
              : g,
          ),
        })),

      renameTask: (groupId, taskId, title) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  tasks: g.tasks.map((t) =>
                    t.id === taskId ? { ...t, title } : t,
                  ),
                }
              : g,
          ),
        })),

      toggleTask: (groupId, taskId) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  tasks: g.tasks.map((t) =>
                    t.id === taskId ? { ...t, done: !t.done } : t,
                  ),
                }
              : g,
          ),
        })),

      deleteTask: (groupId, taskId) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }
              : g,
          ),
        })),
    }),
    { name: "taskmanager.groups.v1" },
  ),
);

/** Sample data for the very first launch. */
function seedGroups(): Group[] {
  const now = new Date().toISOString();
  const mk = (title: string, done = false) => ({
    id: uid(),
    title,
    done,
    createdAt: now,
  });

  return [
    {
      id: uid(),
      title: "Home",
      createdAt: now,
      tasks: [
        mk("Do the laundry"),
        mk("Buy groceries"),
        mk("Water the plants", true),
      ],
    },
    {
      id: uid(),
      title: "Work",
      createdAt: now,
      tasks: [mk("Finish the report"), mk("Reply to emails", true)],
    },
  ];
}
