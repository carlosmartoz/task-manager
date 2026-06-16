import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { TABS } from "@/src/constants";
import type { TabNavProps } from "@/src/types";

export default function Nav({ tab, onChange, layoutId }: TabNavProps) {
  return (
    <nav className="space-y-1">
      {TABS.map((t) => {
        const Icon = t.icon;

        const active = tab === t.key;

        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              active
                ? "text-indigo-300"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
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
  );
}
