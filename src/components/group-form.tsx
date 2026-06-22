import { useState } from "react";
import Modal from "@/src/components/Modal";
import type { GroupFormProps } from "@/src/types";

export default function GroupForm({
  open,
  onClose,
  onSubmit,
  group,
}: GroupFormProps) {
  const [title, setTitle] = useState(group?.title ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim());
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={group ? "Edit task group" : "New task group"}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-fg-label">
            Task group name
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Home, Work, Studies…"
            className="cyber-clip w-full border border-border-strong bg-surface-raised px-3 py-3 text-sm text-fg placeholder-fg-subtle outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-none px-4 py-2 text-sm font-medium uppercase text-fg-label transition hover:bg-surface-raised"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-soft transition hover:bg-accent/20 active:scale-95"
          >
            {group ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
