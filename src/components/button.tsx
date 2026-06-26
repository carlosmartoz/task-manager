import { cn } from "@/src/lib/utils";
import type { ButtonProps } from "@/src/types/button";

export function Button({ icon: Icon, onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase text-accent-soft hover:bg-accent/20",
        Icon && "flex items-center gap-1.5",
      )}
    >
      {Icon && <Icon />}

      {children}
    </button>
  );
}
