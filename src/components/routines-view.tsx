import { useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  Check,
  Flame,
  Pencil,
  Plus,
  Repeat,
  Sun,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useAppStore } from "@/src/store/app-store";
import { useConfirm } from "@/src/store/confirm-store";
import { COLOR_STYLES, FREQUENCIES, FREQUENCY_META } from "@/src/constants";
import type { Frequency, Routine } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { isDoneThisPeriod, streak, totalCompletions } from "@/src/lib/routines";
import RoutineForm from "@/src/components/routine-form";

const FREQ_ICON: Record<Frequency, LucideIcon> = {
  daily: Sun,
  weekly: CalendarDays,
  monthly: CalendarRange,
};

export default function RoutinesView() {
  const routines = useAppStore((s) => s.routines);
  const addRoutine = useAppStore((s) => s.addRoutine);
  const updateRoutine = useAppStore((s) => s.updateRoutine);
  const deleteRoutine = useAppStore((s) => s.deleteRoutine);
  const toggleRoutine = useAppStore((s) => s.toggleRoutine);
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);

  const doneCount = routines.filter((r) => isDoneThisPeriod(r)).length;

  const askDelete = async (routine: Routine) => {
    const ok = await confirm({
      title: "Delete routine?",
      message: `"${routine.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) deleteRoutine(routine.id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Routines</h1>
          <p className="text-sm text-slate-300">
            Tasks that repeat every day, week or month
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
        >
          <Plus size={18} /> New routine
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="animate-fade-in-up rounded-2xl border border-dashed border-slate-800 py-20 text-center">
          <Repeat className="mx-auto mb-3 text-slate-600" size={40} />
          <p className="font-medium text-slate-200">
            You don't have any routines yet
          </p>
          <p className="mb-4 text-sm text-slate-400">
            Create daily, weekly or monthly habits and keep your streak going.
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
          >
            Create routine
          </button>
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200">
            You've completed{" "}
            <span className="font-semibold text-emerald-400">{doneCount}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-50">
              {routines.length}
            </span>{" "}
            routines for their current period. Keep it up! 🚀
          </div>

          <div className="space-y-6">
            {FREQUENCIES.map((freq) => {
              const list = routines.filter((r) => r.frequency === freq);
              if (list.length === 0) return null;
              const Icon = FREQ_ICON[freq];
              return (
                <section key={freq} className="animate-fade-in-up">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
                    <Icon size={16} /> {FREQUENCY_META[freq].labelPlural}
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {list.map((routine) => (
                      <RoutineRow
                        key={routine.id}
                        routine={routine}
                        onToggle={() => toggleRoutine(routine.id)}
                        onEdit={() => {
                          setEditing(routine);
                          setFormOpen(true);
                        }}
                        onDelete={() => askDelete(routine)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      <RoutineForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={(title, frequency, color) => {
          if (editing) updateRoutine(editing.id, title, frequency, color);
          else addRoutine(title, frequency, color);
          setEditing(null);
        }}
        routine={editing ?? undefined}
      />
    </div>
  );
}

function RoutineRow({
  routine,
  onToggle,
  onEdit,
  onDelete,
}: {
  routine: Routine;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const done = isDoneThisPeriod(routine);
  const s = streak(routine);
  const total = totalCompletions(routine);
  const c = COLOR_STYLES[routine.color];

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-slate-900 p-3 transition-all duration-200 hover:shadow-md hover:shadow-black/20",
        done
          ? "border-emerald-500/40"
          : "border-slate-800 hover:border-slate-700",
      )}
    >
      <button
        onClick={onToggle}
        title={done ? "Mark as pending" : "Mark as done"}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90",
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-500 text-transparent hover:border-emerald-500",
        )}
      >
        <Check size={15} strokeWidth={3} />
      </button>

      <span className={cn("h-7 w-1 shrink-0 rounded-full", c.bar)} />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            done ? "text-slate-400" : "text-slate-100",
          )}
        >
          {routine.title}
        </p>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
          {s > 0 && (
            <span
              className="flex items-center gap-1 text-amber-300"
              title={`${s} ${s === 1 ? "period" : "periods"} streak`}
            >
              <Flame size={12} /> {s} streak
            </span>
          )}
          <span>{total} completed</span>
        </div>
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
