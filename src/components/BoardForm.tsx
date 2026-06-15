import { useState } from "react";
import Modal from "./Modal";
import { BOARD_COLORS, COLOR_STYLES, type Board, type BoardColor } from "../types";
import { cn } from "../lib/utils";

interface BoardFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, color: BoardColor) => void;
  board?: Board; // si se pasa, es edición
}

export default function BoardForm({ open, onClose, onSubmit, board }: BoardFormProps) {
  const [title, setTitle] = useState(board?.title ?? "");
  const [color, setColor] = useState<BoardColor>(board?.color ?? BOARD_COLORS[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), color);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={board ? "Editar card" : "Nueva card"}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Nombre del tema
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Trabajo, Personal, Estudios…"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
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
                    ? "ring-2 ring-offset-2 ring-offset-slate-900 " + COLOR_STYLES[c].ring
                    : "opacity-60 hover:opacity-100"
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            {board ? "Guardar" : "Crear card"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
