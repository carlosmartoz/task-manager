import { cn } from "@/src/lib/utils";
import { BUTTON_VARIANTS } from "@/src/consts/button";
import type { ButtonProps } from "@/src/types/button";

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
        BUTTON_VARIANTS[variant],
        Icon && "flex items-center gap-1.5",
      )}
    >
      {Icon && <Icon size={20} />}

      {children}
    </button>
  );
}
