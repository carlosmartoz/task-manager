import { useState } from "react";
import { useDailiesStore } from "@/src/features/dailies/store/dailies-store";
import { dayKey } from "@/src/lib/utils";
import type { DailyTask } from "@/src/features/dailies/types/types";

/** State and actions for the daily tasks screen (add / toggle / delete + today's progress). */
export function useDailyView() {
  const dailies = useDailiesStore((s) => s.dailies);
  const addDaily = useDailiesStore((s) => s.addDaily);
  const toggleDaily = useDailiesStore((s) => s.toggleDaily);
  const deleteDaily = useDailiesStore((s) => s.deleteDaily);
  const [draft, setDraft] = useState("");

  const today = dayKey();
  const isDone = (d: DailyTask) => d.completedOn === today;
  const doneCount = dailies.filter(isDone).length;
  const allDone = dailies.length > 0 && doneCount === dailies.length;
  const completionPercent = dailies.length
    ? Math.round((doneCount / dailies.length) * 100)
    : 0;

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
    isDone,
    doneCount,
    allDone,
    completionPercent,
    add,
    askDelete,
    toggleDaily,
  };
}
