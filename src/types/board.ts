import type { Task } from "./task";

export type BoardColor =
  | "indigo"
  | "emerald"
  | "rose"
  | "amber"
  | "sky"
  | "violet"
  | "teal"
  | "orange";

export interface Board {
  id: string;
  title: string;
  color: BoardColor;
  createdAt: string;
  tasks: Task[];
}

export interface BoardCardProps {
  board: Board;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface BoardFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, color: BoardColor) => void;
  board?: Board; // si se pasa, es edición
}

export interface BoardDetailProps {
  board: Board;
  onBack: () => void;
}
