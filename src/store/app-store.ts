import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppStore, DailyTask, Group } from "@/src/types";
import { dayKey, uid } from "@/src/lib/utils";

const STORAGE_KEY = "taskmanager.core.v1";

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      groups: seedGroups(),
      dailies: seedDailies(),

      addGroup: (title) =>
        set((s) => ({
          groups: [
            ...s.groups,
            {
              id: uid(),
              title,
              createdAt: new Date().toISOString(),
              tasks: [],
            },
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

      addDaily: (title) =>
        set((s) => ({
          dailies: [
            ...s.dailies,
            { id: uid(), title, createdAt: new Date().toISOString() },
          ],
        })),

      renameDaily: (id, title) =>
        set((s) => ({
          dailies: s.dailies.map((d) => (d.id === id ? { ...d, title } : d)),
        })),

      toggleDaily: (id) =>
        set((s) => {
          const today = dayKey();
          return {
            dailies: s.dailies.map((d) =>
              d.id === id
                ? {
                    ...d,
                    completedOn: d.completedOn === today ? undefined : today,
                  }
                : d,
            ),
          };
        }),

      deleteDaily: (id) =>
        set((s) => ({ dailies: s.dailies.filter((d) => d.id !== id) })),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ groups: s.groups, dailies: s.dailies }),
    },
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

function seedDailies(): DailyTask[] {
  const now = new Date().toISOString();
  return [
    { id: uid(), title: "Drink 2L of water", createdAt: now },
    { id: uid(), title: "Read 20 minutes", createdAt: now },
  ];
}
