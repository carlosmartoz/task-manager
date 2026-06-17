import type { LucideIcon } from "lucide-react";

export type Tab = "boards" | "routines" | "stats";

export interface TabConfig {
  key: Tab;
  label: string;
  icon: LucideIcon;
}

export interface TabStore {
  tab: Tab;
  onChangeTab: (tab: Tab) => void;
}
