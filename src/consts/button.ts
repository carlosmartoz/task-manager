import type { ButtonVariant } from "@/src/types/button";

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  solid:
    "flex items-center gap-1.5 rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase text-accent-soft hover:bg-accent/20",
  ghost:
    "flex items-center gap-1.5 text-xs font-medium uppercase text-foreground-muted transition hover:text-foreground",
  icon: "p-1 text-foreground-muted hover:bg-surface-raised hover:text-foreground",
};
