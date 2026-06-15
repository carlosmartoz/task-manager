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
import { useApp } from "../context/AppContext";
import {
  COLOR_STYLES,
  FREQUENCIES,
  FREQUENCY_META,
  type Frequency,
  type Routine,
} from "../types";
import { cn } from "../lib/utils";
import { isDoneThisPeriod, streak, totalCompletions } from "../lib/routines";
import RoutineForm from "./RoutineForm";

const FREQ_ICON: Record<Frequency, LucideIcon> = {
  daily: Sun,
  weekly: CalendarDays,
  monthly: CalendarRange,
};

export default function RoutinesView() {
  const { routines, addRoutine, updateRoutine, deleteRoutine, toggleRoutine } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);

  const doneCount = routines.filter((r) => isDoneThisPeriod(r)).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Rutinas</h1>
          <p className="text-sm text-slate-400">
            Tareas que se repiten cada día, semana o mes
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          <Plus size={18} /> Nueva rutina
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
          <Repeat className="mx-auto mb-3 text-slate-700" size={40} />
          <p className="font-medium text-slate-300">Aún no tienes rutinas</p>
          <p className="mb-4 text-sm text-slate-500">
            Crea hábitos diarios, semanales o mensuales y mantén tu racha.
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Crear rutina
          </button>
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
            Llevas{" "}
            <span className="font-semibold text-emerald-400">{doneCount}</span> de{" "}
            <span className="font-semibold text-slate-100">{routines.length}</span>{" "}
            rutinas completadas en su periodo actual. ¡Sigue así! 🚀
          </div>

          <div className="space-y-6">
            {FREQUENCIES.map((freq) => {
              const list = routines.filter((r) => r.frequency === freq);
              if (list.length === 0) return null;
              const Icon = FREQ_ICON[freq];
              return (
                <section key={freq}>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
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
                        onDelete={() => {
                          if (confirm(`¿Eliminar la rutina "${routine.title}"?`))
                            deleteRoutine(routine.id);
                        }}
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
        "group flex items-center gap-3 rounded-xl border bg-slate-900 p-3 transition",
        done ? "border-emerald-500/40" : "border-slate-800 hover:border-slate-700"
      )}
    >
      <button
        onClick={onToggle}
        title={done ? "Marcar como pendiente" : "Marcar como hecha"}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition",
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-600 text-transparent hover:border-emerald-500"
        )}
      >
        <Check size={15} strokeWidth={3} />
      </button>

      <span className={cn("h-7 w-1 shrink-0 rounded-full", c.bar)} />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            done ? "text-slate-400" : "text-slate-100"
          )}
        >
          {routine.title}
        </p>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
          {s > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <Flame size={12} /> {s} {s === 1 ? "racha" : "de racha"}
            </span>
          )}
          <span>{total} completadas</span>
        </div>
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          aria-label="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          aria-label="Eliminar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
