import type { LucideIcon } from "lucide-react";

export type Tab = "boards" | "routines" | "stats";

export interface TabConfig {
  key: Tab;
  label: string;
  icon: LucideIcon;
}

export interface TabNavProps {
  tab: Tab;
  onChange: (tab: Tab) => void;
  /** Shared layout id for the animated active indicator (must be unique per nav instance). */
  layoutId: string;
  orientation?: "vertical" | "horizontal";
}
