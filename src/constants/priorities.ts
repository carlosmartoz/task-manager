import type { Priority } from "@/src/types";

export const PRIORITY_META: Record<
  Priority,
  { label: string; chip: string; hex: string; order: number }
> = {
  high: {
    label: "High",
    chip: "bg-rose-500/15 text-rose-300",
    hex: "#fb7185",
    order: 0,
  },
  medium: {
    label: "Medium",
    chip: "bg-amber-500/15 text-amber-300",
    hex: "#fbbf24",
    order: 1,
  },
  low: {
    label: "Low",
    chip: "bg-slate-700 text-slate-200",
    hex: "#94a3b8",
    order: 2,
  },
};
