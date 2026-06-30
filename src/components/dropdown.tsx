import { cn } from "@/src/lib/utils";
import { slideDown } from "@/src/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import type { DropdownProps } from "@/src/types/dropdown";

export function Dropdown({ open, onClose, items }: DropdownProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute right-0 z-20 mt-1 w-36 origin-top-right overflow-hidden border border-border bg-surface py-1"
          {...slideDown}
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => {
                  onClose();
                  item.onClick();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                  item.accent
                    ? "text-accent-soft hover:bg-accent/10"
                    : "text-foreground hover:bg-surface-raised",
                )}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
