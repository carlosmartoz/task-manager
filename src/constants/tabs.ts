import { BarChart3, LayoutGrid, Repeat } from "lucide-react";
import type { TabConfig } from "@/src/types";

export const TABS: TabConfig[] = [
  { key: "boards", label: "Boards", icon: LayoutGrid },
  { key: "routines", label: "Routines", icon: Repeat },
  { key: "stats", label: "Statistics", icon: BarChart3 },
];
