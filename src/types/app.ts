import type { Group } from "./group";
import type { DailyTask } from "./daily";

export interface State {
  groups: Group[];
  dailies: DailyTask[];
}

export interface AppStore extends State {
  // Grupos
  addGroup: (title: string) => void;
  updateGroup: (id: string, title: string) => void;
  deleteGroup: (id: string) => void;

  // Tareas dentro de un grupo
  addTask: (groupId: string, title: string) => void;
  renameTask: (groupId: string, taskId: string, title: string) => void;
  toggleTask: (groupId: string, taskId: string) => void;
  deleteTask: (groupId: string, taskId: string) => void;

  // Tareas diarias (se reinician cada día)
  addDaily: (title: string) => void;
  renameDaily: (id: string, title: string) => void;
  toggleDaily: (id: string) => void;
  deleteDaily: (id: string) => void;
}
