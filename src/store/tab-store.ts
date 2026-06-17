import { create } from "zustand";
import type { TabStore } from "@/src/types";

export const useTabStore = create<TabStore>((set) => ({
  tab: "boards",
  onChangeTab: (tab) => set({ tab }),
}));
