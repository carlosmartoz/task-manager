import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { TABS } from "@/src/consts/tabs";
import { Brand } from "@/src/components/brand";
import { useTabStore } from "@/src/store/tab-store";

export function Nav() {
  const tab = useTabStore((s) => s.tab);
  const onChangeTab = useTabStore((s) => s.onChangeTab);

  return (
    <nav className="sticky top-0 z-20 flex items-center gap-1 border-b border-border bg-surface px-4 py-2 lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:items-stretch lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6">
      <div className="mr-auto min-w-0 lg:mr-0">
        <Brand />
      </div>

      {TABS.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;

        return (
          <button
            key={t.id}
            aria-label={t.label}
            onClick={() => onChangeTab(t.id)}
            className={cn(
              "relative flex cursor-pointer items-center gap-3 px-3 py-1.5 text-sm font-medium uppercase lg:w-full lg:py-2.5",
              active
                ? "text-accent-soft"
                : "text-foreground-muted hover:bg-surface-hover/60 hover:text-foreground lg:hover:bg-surface-raised/60",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 -z-10 bg-accent/15 lg:border-l-4 lg:border-accent"
              />
            )}

            <Icon size={20} />

            <span className="hidden lg:inline">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
