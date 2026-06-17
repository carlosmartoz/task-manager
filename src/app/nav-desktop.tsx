import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { TABS } from "@/src/constants";
import { Brand } from "@/src/components/brand";
import { useTabStore } from "@/src/store/tab-store";

export function NavDesktop() {
  const tab = useTabStore((s) => s.tab);

  const onChangeTab = useTabStore((s) => s.onChangeTab);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-5 lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <Brand />

      <nav className="space-y-1">
        {TABS.map((t) => {
          const Icon = t.icon;

          const active = tab === t.key;

          return (
            <button
              key={t.key}
              onClick={() => onChangeTab(t.key)}
              className={cn(
                "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                active
                  ? "text-indigo-300"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 -z-10 bg-indigo-500/15 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}

              <Icon size={18} />

              {t.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
