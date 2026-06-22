import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, LayoutGrid } from "lucide-react";
import { fadeInUp } from "@/src/lib/motion";
import { useAppStore } from "@/src/store/app-store";
import { useConfirm } from "@/src/store/confirm-store";
import type { Group } from "@/src/types";
import GroupCard from "@/src/components/group-card";
import GroupForm from "@/src/components/group-form";
import GroupDetail from "@/src/components/group-detail";

export default function GroupsView() {
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
        <h1 className="font-mono text-base font-bold uppercase tracking-wide text-fg-strong">
          Task groups
        </h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-soft transition hover:bg-accent/20 active:scale-95"
        >
          <Plus size={20} /> New task group
        </button>
      </div>

      {groups.length === 0 ? (
        <motion.div
          {...fadeInUp}
          className="cyber-clip border border-dashed border-border py-20 text-center"
        >
          <LayoutGrid className="mx-auto mb-3 text-fg-ghost" size={44} />
          <p className="font-medium text-fg-label">
            You don't have any task groups yet
          </p>
          <p className="mb-4 text-sm text-fg-subtle">
            Create your first task group to start organizing tasks.
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="cursor-pointer rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-soft transition hover:bg-accent/20 active:scale-95"
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
              <GroupCard
                group={group}
                onOpen={() => setOpenId(group.id)}
                onEdit={() => {
                  setEditing(group);
                  setFormOpen(true);
                }}
                onDelete={() => askDelete(group)}
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
