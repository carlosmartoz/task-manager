import {
  Pencil,
  Trash2,
  ListTodo,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/src/components/button";
import { Dropdown } from "@/src/components/dropdown";
import type { TaskGroupCardProps } from "@/src/features/task-groups/types/task-groups";
import { useTaskGroupCard } from "@/src/features/task-groups/hooks/use-task-group-card";

export function TaskGroupCard({
  group,
  onOpen,
  onEdit,
  onDelete,
}: TaskGroupCardProps) {
  const { menu, setMenu, menuRef, total, done, pending, completionPercent } =
    useTaskGroupCard(group);

  return (
    <div
      onClick={onOpen}
      className="group cyber-clip relative cursor-pointer overflow-hidden border border-border bg-surface"
    >
      <div className="h-1 w-full bg-accent" />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold text-foreground">{group.title}</h3>

          <div
            ref={menuRef}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="icon"
              ariaLabel="Options"
              icon={MoreVertical}
              onClick={() => setMenu((v) => !v)}
            />

            <Dropdown
              open={menu}
              onClose={() => setMenu(false)}
              items={[
                { label: "Edit", icon: Pencil, onClick: onEdit },
                {
                  label: "Delete",
                  icon: Trash2,
                  accent: true,
                  onClick: onDelete,
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-4 text-sm text-foreground-muted">
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
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <p className="mt-1.5 text-xs font-medium text-foreground-muted">
            {total === 0 ? "NO TASKS" : `${completionPercent}% COMPLETE`}
          </p>
        </div>
      </div>
    </div>
  );
}
