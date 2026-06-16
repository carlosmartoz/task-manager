import type { BoardColor } from "@/src/types";

export const BOARD_COLORS: BoardColor[] = [
  "indigo",
  "emerald",
  "rose",
  "amber",
  "sky",
  "violet",
  "teal",
  "orange",
];

export const COLOR_STYLES: Record<
  BoardColor,
  { bar: string; chip: string; ring: string; text: string; hex: string }
> = {
  indigo: {
    bar: "bg-indigo-500",
    chip: "bg-indigo-500/15 text-indigo-300",
    ring: "ring-indigo-400",
    text: "text-indigo-400",
    hex: "#818cf8",
  },
  emerald: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-500/15 text-emerald-300",
    ring: "ring-emerald-400",
    text: "text-emerald-400",
    hex: "#34d399",
  },
  rose: {
    bar: "bg-rose-500",
    chip: "bg-rose-500/15 text-rose-300",
    ring: "ring-rose-400",
    text: "text-rose-400",
    hex: "#fb7185",
  },
  amber: {
    bar: "bg-amber-500",
    chip: "bg-amber-500/15 text-amber-300",
    ring: "ring-amber-400",
    text: "text-amber-400",
    hex: "#fbbf24",
  },
  sky: {
    bar: "bg-sky-500",
    chip: "bg-sky-500/15 text-sky-300",
    ring: "ring-sky-400",
    text: "text-sky-400",
    hex: "#38bdf8",
  },
  violet: {
    bar: "bg-violet-500",
    chip: "bg-violet-500/15 text-violet-300",
    ring: "ring-violet-400",
    text: "text-violet-400",
    hex: "#a78bfa",
  },
  teal: {
    bar: "bg-teal-500",
    chip: "bg-teal-500/15 text-teal-300",
    ring: "ring-teal-400",
    text: "text-teal-400",
    hex: "#2dd4bf",
  },
  orange: {
    bar: "bg-orange-500",
    chip: "bg-orange-500/15 text-orange-300",
    ring: "ring-orange-400",
    text: "text-orange-400",
    hex: "#fb923c",
  },
};
