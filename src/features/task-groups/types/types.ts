export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface Group {
  id: string;
  title: string;
  createdAt: string;
  tasks: Task[];
}

export interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export interface GroupCardProps {
  group: Group;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface GroupDetailProps {
  group: Group;
  onBack: () => void;
}
