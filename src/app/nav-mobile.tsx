import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { TABS } from "@/src/constants";
import { Brand } from "@/src/components/brand";
import { useTabStore } from "@/src/store/tab-store";

export function NavMobile() {
  const tab = useTabStore((s) => s.tab);

  const onChangeTab = useTabStore((s) => s.onChangeTab);

  return (
    <div className="sticky top-0 z-20 flex items-center gap-1 border-b border-border bg-surface/90 px-4 py-2 backdrop-blur lg:hidden">
      <span className="mr-auto min-w-0">
        <Brand />
      </span>

      {TABS.map((t) => {
        const Icon = t.icon;

        const active = tab === t.key;

        return (
          <button
            key={t.key}
            aria-label={t.label}
            onClick={() => onChangeTab(t.key)}
            className={cn(
              "relative cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-accent-soft"
                : "text-fg-muted hover:bg-surface-raised/60 hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId="header-active-mobile"
                className="absolute inset-0 -z-10 rounded-sm bg-accent/15"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}

            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
