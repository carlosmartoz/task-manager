import { cn } from "@/src/lib/utils";
import { BUTTON_VARIANTS } from "@/src/consts/button";
import type { ButtonProps } from "@/src/types/button";

export function Button({
  onClick,
  children,
  ariaLabel,
  icon: Icon,
  iconSize = 20,
  type = "button",
  variant = "solid",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn("cursor-pointer", BUTTON_VARIANTS[variant])}
    >
      {Icon && <Icon size={iconSize} />}

      {children}
    </button>
  );
}
