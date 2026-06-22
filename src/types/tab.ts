import type { LucideIcon } from "lucide-react";

export type Tab = "groups" | "daily";

export interface TabConfig {
  key: Tab;
  label: string;
  icon: LucideIcon;
}

export interface TabStore {
  tab: Tab;
  onChangeTab: (tab: Tab) => void;
}
