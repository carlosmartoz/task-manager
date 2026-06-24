import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { TABS } from "@/src/constants";
import { Brand } from "@/src/components/brand";
import { useTabStore } from "@/src/store/tab-store";

export function NavDesktop() {
  const tab = useTabStore((s) => s.tab);

  const onChangeTab = useTabStore((s) => s.onChangeTab);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface p-6 lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <Brand />

      <nav className="space-y-1">
        {TABS.map((t) => {
          const Icon = t.icon;

          return (
            <button
              key={t.id}
              onClick={() => onChangeTab(t.id)}
              className={cn(
                "relative flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium uppercase",
                tab === t.id
                  ? "text-accent-soft"
                  : "text-foreground-muted hover:bg-surface-hover/60 hover:text-foreground",
              )}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="sidebar-active"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute inset-0 -z-10 border-l-4 border-accent bg-accent/15"
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
