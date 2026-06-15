export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  createdAt: string; // ISO
  completedAt?: string; // ISO, cuando pasa a "done"
  dueDate?: string; // ISO (solo fecha)
}

export interface Board {
  id: string;
  title: string;
  color: BoardColor;
  createdAt: string; // ISO
  tasks: Task[];
}

export type BoardColor =
  | "indigo"
  | "emerald"
  | "rose"
  | "amber"
  | "sky"
  | "violet"
  | "teal"
  | "orange";

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

/** Clases de Tailwind asociadas a cada color (deben ser literales para que Tailwind las detecte). */
export const COLOR_STYLES: Record<
  BoardColor,
  { bar: string; chip: string; ring: string; text: string; hex: string }
> = {
  indigo: { bar: "bg-indigo-500", chip: "bg-indigo-500/15 text-indigo-300", ring: "ring-indigo-400", text: "text-indigo-400", hex: "#818cf8" },
  emerald: { bar: "bg-emerald-500", chip: "bg-emerald-500/15 text-emerald-300", ring: "ring-emerald-400", text: "text-emerald-400", hex: "#34d399" },
  rose: { bar: "bg-rose-500", chip: "bg-rose-500/15 text-rose-300", ring: "ring-rose-400", text: "text-rose-400", hex: "#fb7185" },
  amber: { bar: "bg-amber-500", chip: "bg-amber-500/15 text-amber-300", ring: "ring-amber-400", text: "text-amber-400", hex: "#fbbf24" },
  sky: { bar: "bg-sky-500", chip: "bg-sky-500/15 text-sky-300", ring: "ring-sky-400", text: "text-sky-400", hex: "#38bdf8" },
  violet: { bar: "bg-violet-500", chip: "bg-violet-500/15 text-violet-300", ring: "ring-violet-400", text: "text-violet-400", hex: "#a78bfa" },
  teal: { bar: "bg-teal-500", chip: "bg-teal-500/15 text-teal-300", ring: "ring-teal-400", text: "text-teal-400", hex: "#2dd4bf" },
  orange: { bar: "bg-orange-500", chip: "bg-orange-500/15 text-orange-300", ring: "ring-orange-400", text: "text-orange-400", hex: "#fb923c" },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; chip: string; hex: string; order: number }
> = {
  high: { label: "Alta", chip: "bg-rose-500/15 text-rose-300", hex: "#fb7185", order: 0 },
  medium: { label: "Media", chip: "bg-amber-500/15 text-amber-300", hex: "#fbbf24", order: 1 },
  low: { label: "Baja", chip: "bg-slate-700 text-slate-300", hex: "#94a3b8", order: 2 },
};

export const STATUS_META: Record<
  Status,
  { label: string; chip: string; hex: string }
> = {
  todo: { label: "Por hacer", chip: "bg-slate-700 text-slate-300", hex: "#94a3b8" },
  in_progress: { label: "En progreso", chip: "bg-sky-500/15 text-sky-300", hex: "#38bdf8" },
  done: { label: "Hecho", chip: "bg-emerald-500/15 text-emerald-300", hex: "#34d399" },
};

export const STATUSES: Status[] = ["todo", "in_progress", "done"];

/* ── Tareas recurrentes (rutinas) ── */

export type Frequency = "daily" | "weekly" | "monthly";

export interface Routine {
  id: string;
  title: string;
  frequency: Frequency;
  color: BoardColor;
  createdAt: string; // ISO
  history: string[]; // fechas YYYY-MM-DD en las que se completó
}

export const FREQUENCY_META: Record<
  Frequency,
  { label: string; labelPlural: string; icon: string }
> = {
  daily: { label: "Diaria", labelPlural: "Diarias", icon: "sun" },
  weekly: { label: "Semanal", labelPlural: "Semanales", icon: "calendar-days" },
  monthly: { label: "Mensual", labelPlural: "Mensuales", icon: "calendar-range" },
};

export const FREQUENCIES: Frequency[] = ["daily", "weekly", "monthly"];
