import { cn } from "@/src/lib/utils";
import type { ButtonProps } from "@/src/types/button";

const variants = {
  solid:
    "rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase text-accent-soft hover:bg-accent/20",
  ghost:
    "text-xs font-medium uppercase tracking-wide text-foreground-muted transition hover:text-foreground",
};

export function Button({
  onClick,
  children,
  icon: Icon,
  type = "button",
  variant = "solid",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "cursor-pointer",
        variants[variant],
        Icon && "flex items-center gap-1.5",
      )}
    >
      {Icon && <Icon size={20} />}

      {children}
    </button>
  );
}
