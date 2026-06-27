import {
  CheckCircle2,
  ListTodo,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { slideDown } from "@/src/lib/motion";
import { useTaskCard } from "@/src/features/task-groups/hooks/use-task-card";
import type { TaskGroupCardProps } from "@/src/features/task-groups/types/task-groups";

export function TaskCard({
  group,
  onOpen,
  onEdit,
  onDelete,
}: TaskGroupCardProps) {
  const { menu, setMenu, menuRef, total, done, pending, pct } =
    useTaskCard(group);

  return (
    <div
      onClick={onOpen}
      className="group cyber-clip relative cursor-pointer overflow-hidden border border-border bg-surface"
    >
      <div className="h-1 w-full bg-accent" />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold normal-case tracking-wide text-fg-strong">
            {group.title}
          </h3>

          <div
            ref={menuRef}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMenu((v) => !v)}
              className="cursor-pointer rounded-sm p-1 text-fg-muted transition hover:bg-surface-raised hover:text-fg"
              aria-label="Options"
            >
              <MoreVertical size={20} />
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  className="absolute right-0 z-20 mt-1 w-36 origin-top-right overflow-hidden rounded-sm border border-border-strong bg-surface-raised py-1 shadow-xl"
                  {...slideDown}
                >
                  <button
                    onClick={() => {
                      setMenu(false);
                      onEdit();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-fg-label transition hover:bg-surface-strong"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setMenu(false);
                      onDelete();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-danger-fg transition hover:bg-danger/10"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-3 flex gap-4 text-sm text-fg-muted normal-case">
          <span className="flex items-center gap-1.5">
            <ListTodo size={18} className="text-accent" /> {pending} pending
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={18} className="text-accent" /> {done} done
          </span>
        </div>

        <div className="mt-4">
          <div className="h-1 overflow-hidden bg-surface-raised">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-medium text-fg-subtle">
            {total === 0 ? "NO TASKS" : `${pct}% COMPLETE`}
          </p>
        </div>
      </div>
    </div>
  );
}
