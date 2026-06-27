import { useEffect, useRef, useState } from "react";
import type { TaskGroup } from "@/src/features/task-groups/types/task-groups";

/** Dropdown menu (with outside-click close) and progress stats for a group card. */
export function useTaskCard(group: TaskGroup) {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menu]);

  const total = group.tasks.length;
  const done = group.tasks.filter((t) => t.done).length;
  const pending = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return { menu, setMenu, menuRef, total, done, pending, pct };
}
