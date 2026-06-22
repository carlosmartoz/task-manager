import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Pencil, Plus, Sun, Trash2 } from "lucide-react";
import { fadeInUp } from "@/src/lib/motion";
import { useAppStore } from "@/src/store/app-store";
import { useConfirm } from "@/src/store/confirm-store";
import type { DailyTask } from "@/src/types";
import { cn, dayKey } from "@/src/lib/utils";

export default function DailyView() {
  const dailies = useAppStore((s) => s.dailies);
  const addDaily = useAppStore((s) => s.addDaily);
  const renameDaily = useAppStore((s) => s.renameDaily);
  const toggleDaily = useAppStore((s) => s.toggleDaily);
  const deleteDaily = useAppStore((s) => s.deleteDaily);
  const confirm = useConfirm();
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const startEdit = (d: DailyTask) => {
    setEditingId(d.id);
    setEditDraft(d.title);
  };

  const commitEdit = (d: DailyTask) => {
    const next = editDraft.trim();
    if (next && next !== d.title) renameDaily(d.id, next);
    setEditingId(null);
  };

  const today = dayKey();
  const isDone = (d: DailyTask) => d.completedOn === today;
  const doneCount = dailies.filter(isDone).length;
  const allDone = dailies.length > 0 && doneCount === dailies.length;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    addDaily(title);
    setDraft("");
  };

  const askDelete = async (d: DailyTask) => {
    const ok = await confirm({
      title: "Delete daily task?",
      message: `"${d.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) deleteDaily(d.id);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-base font-bold uppercase tracking-wide text-fg-strong">
          Daily tasks
        </h1>
      </div>

      <form onSubmit={add} className="mb-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a daily task…"
          className="cyber-clip min-w-0 flex-1 border border-border-strong bg-surface-raised px-3 py-3 text-sm text-fg placeholder-fg-subtle outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-1.5 rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-soft transition hover:bg-accent/20 active:scale-95"
        >
          <Plus size={20} /> Add
        </button>
      </form>

      {dailies.length === 0 ? (
        <motion.div
          {...fadeInUp}
          className="cyber-clip border border-dashed border-border py-20 text-center"
        >
          <Sun className="mx-auto mb-3 text-fg-ghost" size={44} />
          <p className="font-medium text-fg-label">No daily tasks yet</p>
          <p className="text-sm text-fg-subtle">
            Add your first daily task above.
          </p>
        </motion.div>
      ) : (
        <>
          <div
            className={cn(
              "cyber-clip mb-4 border px-4 py-3 text-sm normal-case",
              allDone
                ? "border-accent/50 bg-accent/10 text-accent-soft"
                : "border-border bg-surface text-fg-label",
            )}
          >
            {allDone ? (
              <span className="font-semibold uppercase tracking-wide">
                All daily tasks cleared.
              </span>
            ) : (
              <>
                You've completed{" "}
                <span className="font-semibold text-accent">{doneCount}</span>{" "}
                of{" "}
                <span className="font-semibold text-fg-strong">
                  {dailies.length}
                </span>{" "}
                tasks today.
              </>
            )}
          </div>

          <div className="space-y-2">
            {dailies.map((d) => {
              const done = isDone(d);
              return (
                <div
                  key={d.id}
                  className={cn(
                    "group cyber-clip flex items-center gap-3 border p-3 transition-all duration-200",
                    done
                      ? "border-accent/50 bg-accent/10"
                      : "border-border bg-surface hover:border-border-strong",
                  )}
                >
                  <button
                    onClick={() => toggleDaily(d.id)}
                    title={done ? "Mark as pending" : "Mark as done"}
                    className={cn(
                      "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90",
                      done
                        ? "border-accent bg-accent text-inverse"
                        : "border-fg-faint text-transparent hover:border-accent",
                    )}
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>

                  {editingId === d.id ? (
                    <input
                      autoFocus
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      onBlur={() => commitEdit(d)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(d);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="cyber-clip min-w-0 flex-1 border border-accent bg-surface-raised px-2 py-1 text-sm text-fg normal-case outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  ) : (
                    <p
                      onDoubleClick={() => startEdit(d)}
                      className={cn(
                        "min-w-0 flex-1 cursor-pointer truncate text-sm normal-case",
                        done
                          ? "font-semibold tracking-wide text-accent-soft"
                          : "font-medium text-fg",
                      )}
                    >
                      {d.title}
                    </p>
                  )}

                  {editingId !== d.id && (
                    <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() => startEdit(d)}
                        className="cursor-pointer rounded-sm p-1.5 text-fg-muted transition hover:bg-surface-raised hover:text-fg"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => askDelete(d)}
                        className="cursor-pointer rounded-sm p-1.5 text-fg-muted transition hover:bg-danger/10 hover:text-danger-fg"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
