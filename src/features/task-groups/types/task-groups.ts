export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface TaskGroup {
  id: string;
  title: string;
  createdAt: string;
  tasks: Task[];
}

export interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export interface TaskGroupCardProps {
  group: TaskGroup;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface TaskGroupsDetailProps {
  taskGroup: TaskGroup;
  onBack: () => void;
}

export interface TaskGroupsStore {
  taskGroups: TaskGroup[];

  createTaskGroup: (title: string) => void;
  editTaskGroup: (id: string, title: string) => void;
  deleteTaskGroup: (id: string) => void;

  createTask: (taskGroupId: string, title: string) => void;
  toggleTask: (taskGroupId: string, taskId: string) => void;
  deleteTask: (taskGroupId: string, taskId: string) => void;
}
