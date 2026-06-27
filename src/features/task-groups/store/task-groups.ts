import { create } from "zustand";
import { uid } from "@/src/lib/utils";
import { persist } from "zustand/middleware";
import type {
  TaskGroup,
  TaskGroupsStore,
} from "@/src/features/task-groups/types/task-groups";

export const useTaskGroupsStore = create<TaskGroupsStore>()(
  persist(
    (set) => ({
      taskGroups: seedGroups(),

      createTaskGroup: (title) =>
        set((s) => ({
          taskGroups: [
            ...s.taskGroups,
            {
              id: uid(),
              title,
              createdAt: new Date().toISOString(),
              tasks: [],
            },
          ],
        })),

      editTaskGroup: (id, title) =>
        set((s) => ({
          taskGroups: s.taskGroups.map((g) =>
            g.id === id ? { ...g, title } : g,
          ),
        })),

      deleteTaskGroup: (id) =>
        set((s) => ({ taskGroups: s.taskGroups.filter((g) => g.id !== id) })),

      createTask: (taskGroupId, title) =>
        set((s) => ({
          taskGroups: s.taskGroups.map((g) =>
            g.id === taskGroupId
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

      toggleTask: (taskGroupId, taskId) =>
        set((s) => ({
          taskGroups: s.taskGroups.map((g) =>
            g.id === taskGroupId
              ? {
                  ...g,
                  tasks: g.tasks.map((t) =>
                    t.id === taskId ? { ...t, done: !t.done } : t,
                  ),
                }
              : g,
          ),
        })),

      deleteTask: (taskGroupId, taskId) =>
        set((s) => ({
          taskGroups: s.taskGroups.map((g) =>
            g.id === taskGroupId
              ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }
              : g,
          ),
        })),
    }),
    { name: "taskmanager.groups.v1" },
  ),
);

function seedGroups(): TaskGroup[] {
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
