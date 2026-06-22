import type { Task } from "./task";

export interface Group {
  id: string;
  title: string;
  createdAt: string;
  tasks: Task[];
}

export interface GroupCardProps {
  group: Group;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface GroupFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  group?: Group; // si se pasa, es edición
}

export interface GroupDetailProps {
  group: Group;
  onBack: () => void;
}
