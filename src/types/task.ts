export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}
