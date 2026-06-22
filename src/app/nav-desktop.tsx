import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { TABS } from "@/src/constants";
import { Brand } from "@/src/components/brand";
import { useTabStore } from "@/src/store/tab-store";

export function NavDesktop() {
  const tab = useTabStore((s) => s.tab);

  const onChangeTab = useTabStore((s) => s.onChangeTab);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface p-5 lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
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
                "relative flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 font-mono text-sm font-medium uppercase tracking-wide transition-colors duration-200",
                active
                  ? "text-accent-soft"
                  : "text-fg-muted hover:bg-surface-raised/60 hover:text-fg",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 -z-10 border-l-4 border-accent bg-accent/15"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}

              <Icon size={20} />

              {t.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
