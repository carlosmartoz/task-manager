import type { LucideIcon } from "lucide-react";

export interface DropdownItem {
  label: string;
  icon: LucideIcon;
  accent?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  open: boolean;
  onClose: () => void;
  items: DropdownItem[];
}
