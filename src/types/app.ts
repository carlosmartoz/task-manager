import type { Board, BoardColor } from "./board";
import type { Frequency, Routine } from "./routine";
import type { Priority, Status, Task } from "./task";

export interface State {
  boards: Board[];
  routines: Routine[];
}

export type Action =
  | { type: "ADD_BOARD"; title: string; color: BoardColor }
  | { type: "UPDATE_BOARD"; id: string; title: string; color: BoardColor }
  | { type: "DELETE_BOARD"; id: string }
  | {
      type: "ADD_TASK";
      boardId: string;
      task: Omit<Task, "id" | "createdAt" | "status" | "completedAt">;
    }
  | { type: "UPDATE_TASK"; boardId: string; task: Task }
  | { type: "DELETE_TASK"; boardId: string; taskId: string }
  | { type: "SET_TASK_STATUS"; boardId: string; taskId: string; status: Status }
  | {
      type: "MOVE_TASK";
      boardId: string;
      taskId: string;
      toStatus: Status;
      targetIndex: number;
    }
  | {
      type: "ADD_ROUTINE";
      title: string;
      frequency: Frequency;
      color: BoardColor;
    }
  | {
      type: "UPDATE_ROUTINE";
      id: string;
      title: string;
      frequency: Frequency;
      color: BoardColor;
    }
  | { type: "DELETE_ROUTINE"; id: string }
  | { type: "TOGGLE_ROUTINE"; id: string }
  | { type: "IMPORT"; state: State };

export interface AppStore extends State {
  addBoard: (title: string, color: BoardColor) => void;
  updateBoard: (id: string, title: string, color: BoardColor) => void;
  deleteBoard: (id: string) => void;
  addTask: (
    boardId: string,
    task: {
      title: string;
      description?: string;
      priority: Priority;
      dueDate?: string;
    },
  ) => void;
  updateTask: (boardId: string, task: Task) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  setTaskStatus: (boardId: string, taskId: string, status: Status) => void;
  moveTask: (
    boardId: string,
    taskId: string,
    toStatus: Status,
    targetIndex: number,
  ) => void;
  addRoutine: (title: string, frequency: Frequency, color: BoardColor) => void;
  updateRoutine: (
    id: string,
    title: string,
    frequency: Frequency,
    color: BoardColor,
  ) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutine: (id: string) => void;
}
