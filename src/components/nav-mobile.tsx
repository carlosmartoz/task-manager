import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { TABS } from "@/src/consts/tabs";
import { useTabStore } from "@/src/store/tab-store";
import { Brand } from "@/src/components/brand";

export function NavMobile() {
  const tab = useTabStore((s) => s.tab);

  const onChangeTab = useTabStore((s) => s.onChangeTab);

  return (
    <div className="sticky top-0 z-20 flex items-center gap-1 border-b border-border bg-surface px-4 py-2 backdrop-blur lg:hidden">
      <span className="mr-auto min-w-0">
        <Brand />
      </span>

      {TABS.map((t) => {
        const Icon = t.icon;

        return (
          <button
            key={t.id}
            aria-label={t.label}
            onClick={() => onChangeTab(t.id)}
            className={cn(
              "relative cursor-pointer px-3 py-1.5 text-sm font-medium",
              tab === t.id
                ? "text-accent-soft"
                : "text-foreground-muted hover:bg-surface-hover/60 hover:text-foreground",
            )}
          >
            {tab === t.id && (
              <motion.span
                layoutId="header-active-mobile"
                className="absolute inset-0 -z-10 bg-accent/15"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}

            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
}
