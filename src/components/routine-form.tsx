import { useState } from "react";
import Modal from "@/src/components/modal";
import {
  BOARD_COLORS,
  COLOR_STYLES,
  FREQUENCIES,
  FREQUENCY_META,
} from "@/src/constants";
import type { BoardColor, Frequency, RoutineFormProps } from "@/src/types";
import { cn } from "@/src/lib/utils";

export default function RoutineForm({
  open,
  onClose,
  onSubmit,
  routine,
}: RoutineFormProps) {
  const [title, setTitle] = useState(routine?.title ?? "");
  const [frequency, setFrequency] = useState<Frequency>(
    routine?.frequency ?? "daily",
  );
  const [color, setColor] = useState<BoardColor>(
    routine?.color ?? BOARD_COLORS[1],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), frequency, color);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={routine ? "Edit routine" : "New routine"}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">
            What do you want to do regularly?
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Work out, Read 20 min…"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">
            Frequency
          </label>
          <div className="flex gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-2 text-sm font-medium transition",
                  frequency === f
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700",
                )}
              >
                {FREQUENCY_META[f].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-200">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {BOARD_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "h-8 w-8 rounded-full transition",
                  COLOR_STYLES[c].bar,
                  color === c
                    ? "ring-2 ring-offset-2 ring-offset-slate-900 " +
                        COLOR_STYLES[c].ring
                    : "opacity-60 hover:opacity-100",
                )}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
          >
            {routine ? "Save" : "Create routine"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
