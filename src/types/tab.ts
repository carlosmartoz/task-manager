import type { LucideIcon } from "lucide-react";

export type Tab = "task-groups" | "daily-tasks";

export interface TabConfig {
  id: Tab;
  label: string;
  icon: LucideIcon;
}

export interface TabStore {
  tab: Tab;
  onChangeTab: (tab: Tab) => void;
}
