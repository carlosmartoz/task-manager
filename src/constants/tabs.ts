import type { TabConfig } from "@/src/types";
import { ListTodo, Repeat } from "lucide-react";

export const TABS: TabConfig[] = [
  { key: "groups", label: "Task groups", icon: ListTodo },
  { key: "daily", label: "Daily tasks", icon: Repeat },
];
