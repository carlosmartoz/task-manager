import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant = "solid" | "ghost" | "icon" | "delete";

export interface ButtonProps {
  icon?: LucideIcon;
  iconSize?: number;
  ariaLabel?: string;
  onClick?: () => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
}
