export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface TaskDraft {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
}

export interface TaskItemProps {
  task: Task;
  index: number;
  onCycleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverItem: (index: number, after: boolean) => void;
  dragging: boolean;
}

export interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
  task?: Task; // edición
}
