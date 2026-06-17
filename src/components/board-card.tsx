import {
  CheckCircle2,
  ListTodo,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COLOR_STYLES } from "@/src/constants";
import { slideDown } from "@/src/lib/motion";
import type { BoardCardProps } from "@/src/types";
import { cn } from "@/src/lib/utils";

export default function BoardCard({
  board,
  onOpen,
  onEdit,
  onDelete,
}: BoardCardProps) {
  const [menu, setMenu] = useState(false);
  const c = COLOR_STYLES[board.color];
  const total = board.tasks.length;
  const done = board.tasks.filter((t) => t.status === "done").length;
  const pending = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20"
    >
      <div className={cn("h-1.5 w-full", c.bar)} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            {board.title}
          </h3>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenu((v) => !v)}
              className="rounded-lg p-1 text-slate-300 opacity-0 transition hover:bg-slate-800 hover:text-slate-100 group-hover:opacity-100"
              aria-label="Options"
            >
              <MoreVertical size={18} />
            </button>
            {menu && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenu(false)}
              />
            )}
            <AnimatePresence>
              {menu && (
                <motion.div
                  className="absolute right-0 z-20 mt-1 w-36 origin-top-right overflow-hidden rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl"
                  {...slideDown}
                >
                  <button
                    onClick={() => {
                      setMenu(false);
                      onEdit();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setMenu(false);
                      onDelete();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-3 flex gap-4 text-sm text-slate-300">
          <span className="flex items-center gap-1.5">
            <ListTodo size={15} className={c.text} /> {pending} pending
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" /> {done} done
          </span>
        </div>

        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                c.bar,
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-medium text-slate-400">
            {total === 0 ? "No tasks" : `${pct}% complete`}
          </p>
        </div>
      </div>
    </div>
  );
}
