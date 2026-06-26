import { ListTodo, Repeat } from "lucide-react";
import type { TabConfig } from "@/src/types/tab";

export const TABS: TabConfig[] = [
  { id: "task-groups", label: "Task groups", icon: ListTodo },
  { id: "daily-tasks", label: "Daily tasks", icon: Repeat },
];
