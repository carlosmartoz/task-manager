import { useState } from "react";
import { motion } from "framer-motion";
import type { Group } from "@/src/types";
import { fadeInUp } from "@/src/lib/motion";
import { Plus, LayoutGrid } from "lucide-react";
import { useAppStore } from "@/src/store/app-store";
import { TaskCard } from "@/src/task-groups/task-card";
import GroupForm from "@/src/components/group-form";
import { useConfirm } from "@/src/store/confirm-store";
import GroupDetail from "@/src/components/group-detail";

export function TaskGroups() {
  const groups = useAppStore((s) => s.groups);
  const addGroup = useAppStore((s) => s.addGroup);
  const updateGroup = useAppStore((s) => s.updateGroup);
  const deleteGroup = useAppStore((s) => s.deleteGroup);
  const confirm = useConfirm();
  const [openId, setOpenId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);

  const active = groups.find((g) => g.id === openId) ?? null;

  if (active) {
    return <GroupDetail group={active} onBack={() => setOpenId(null)} />;
  }

  const handleSubmit = (title: string) => {
    if (editing) updateGroup(editing.id, title);
    else addGroup(title);
    setEditing(null);
  };

  const askDelete = async (group: Group) => {
    const ok = await confirm({
      title: "Delete task group?",
      message: `"${group.title}" and all of its tasks will be permanently removed.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) deleteGroup(group.id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-base font-bold uppercase text-foreground">
          Task groups
        </h1>

        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase text-accent-soft hover:bg-accent/20"
        >
          <Plus size={20} /> New task group
        </button>
      </div>

      {groups.length === 0 ? (
        <motion.div
          {...fadeInUp}
          className="cyber-clip border border-dashed border-accent py-20 text-center"
        >
          <LayoutGrid className="mx-auto mb-3 text-accent-soft" size={44} />

          <p className="font-medium text-foreground">
            You don't have any task groups yet
          </p>

          <p className="mb-4 text-sm text-foreground-muted">
            Create your first task group to start organizing tasks.
          </p>

          <button
            onClick={() => setFormOpen(true)}
            className="rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase text-accent-soft hover:bg-accent/20"
          >
            Create task group
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.06 }}
            >
              <TaskCard
                group={group}
                onEdit={() => {
                  setEditing(group);
                  setFormOpen(true);
                }}
                onDelete={() => askDelete(group)}
                onOpen={() => setOpenId(group.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <GroupForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        group={editing ?? undefined}
      />
    </div>
  );
}
