import { create } from "zustand";
import type { TabStore } from "@/src/types/tab";

export const useTabStore = create<TabStore>((set) => ({
  tab: "task-groups",
  onChangeTab: (tab) => set({ tab }),
}));
