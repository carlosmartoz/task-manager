import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface ButtonProps {
  icon?: LucideIcon;
  onClick: () => void;
  children?: ReactNode;
}
