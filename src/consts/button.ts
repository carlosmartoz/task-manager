import type { ButtonVariant } from "@/src/types/button";

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  solid:
    "rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase text-accent-soft hover:bg-accent/20",
  ghost:
    "text-xs font-medium uppercase tracking-wide text-foreground-muted transition hover:text-foreground",
};
