import type { Status } from "@/src/types";

export const STATUS_META: Record<
  Status,
  { label: string; chip: string; hex: string }
> = {
  todo: { label: "To do", chip: "bg-slate-700 text-slate-200", hex: "#94a3b8" },
  in_progress: {
    label: "In progress",
    chip: "bg-sky-500/15 text-sky-300",
    hex: "#38bdf8",
  },
  done: {
    label: "Done",
    chip: "bg-emerald-500/15 text-emerald-300",
    hex: "#34d399",
  },
};

export const STATUSES: Status[] = ["todo", "in_progress", "done"];
