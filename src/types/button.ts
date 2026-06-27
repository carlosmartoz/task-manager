import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant = "solid" | "ghost";

export interface ButtonProps {
  icon?: LucideIcon;
  onClick?: () => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
}
