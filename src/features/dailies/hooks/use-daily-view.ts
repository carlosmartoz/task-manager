import { useState } from "react";
import { useDailiesStore } from "@/src/features/dailies/store/dailies-store";
import { dayKey } from "@/src/lib/utils";
import type { DailyTask } from "@/src/features/dailies/types/types";

/** State and actions for the daily tasks screen (add / edit / toggle / delete + today's progress). */
export function useDailyView() {
  const dailies = useDailiesStore((s) => s.dailies);
  const addDaily = useDailiesStore((s) => s.addDaily);
  const renameDaily = useDailiesStore((s) => s.renameDaily);
  const toggleDaily = useDailiesStore((s) => s.toggleDaily);
  const deleteDaily = useDailiesStore((s) => s.deleteDaily);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const today = dayKey();
  const isDone = (d: DailyTask) => d.completedOn === today;
  const doneCount = dailies.filter(isDone).length;
  const allDone = dailies.length > 0 && doneCount === dailies.length;

  const startEdit = (d: DailyTask) => {
    setEditingId(d.id);
    setEditDraft(d.title);
  };

  const cancelEdit = () => setEditingId(null);

  const commitEdit = (d: DailyTask) => {
    const next = editDraft.trim();
    if (next && next !== d.title) renameDaily(d.id, next);
    setEditingId(null);
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    addDaily(title);
    setDraft("");
  };

  const askDelete = (d: DailyTask) => {
    const ok = window.confirm(`Delete "${d.title}"?`);
    if (ok) deleteDaily(d.id);
  };

  return {
    dailies,
    draft,
    setDraft,
    editingId,
    editDraft,
    setEditDraft,
    isDone,
    doneCount,
    allDone,
    startEdit,
    cancelEdit,
    commitEdit,
    add,
    askDelete,
    toggleDaily,
  };
}
