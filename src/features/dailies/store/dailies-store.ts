import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DailyTask } from "@/src/features/dailies/types/types";
import { dayKey, uid } from "@/src/lib/utils";

/** Store for the dailies feature: daily tasks that reset each day, persisted. */
interface DailiesStore {
  dailies: DailyTask[];

  addDaily: (title: string) => void;
  toggleDaily: (id: string) => void;
  deleteDaily: (id: string) => void;
}

export const useDailiesStore = create<DailiesStore>()(
  persist(
    (set) => ({
      dailies: seedDailies(),

      addDaily: (title) =>
        set((s) => ({
          dailies: [
            ...s.dailies,
            { id: uid(), title, createdAt: new Date().toISOString() },
          ],
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
    { name: "taskmanager.dailies.v1" },
  ),
);

function seedDailies(): DailyTask[] {
  const now = new Date().toISOString();
  return [
    { id: uid(), title: "Drink 2L of water", createdAt: now },
    { id: uid(), title: "Read 20 minutes", createdAt: now },
  ];
}
