import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type {
  Board,
  BoardColor,
  Frequency,
  Priority,
  Routine,
  Status,
  Task,
} from "../types";
import { BOARD_COLORS } from "../types";
import { uid } from "../lib/utils";
import { dayKey, isDoneThisPeriod, periodKey } from "../lib/routines";

const STORAGE_KEY = "taskboards.v1";

interface State {
  boards: Board[];
  routines: Routine[];
}

type Action =
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
  | { type: "ADD_ROUTINE"; title: string; frequency: Frequency; color: BoardColor }
  | { type: "UPDATE_ROUTINE"; id: string; title: string; frequency: Frequency; color: BoardColor }
  | { type: "DELETE_ROUTINE"; id: string }
  | { type: "TOGGLE_ROUTINE"; id: string }
  | { type: "IMPORT"; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_BOARD":
      return {
        ...state,
        boards: [
          ...state.boards,
          {
            id: uid(),
            title: action.title,
            color: action.color,
            createdAt: new Date().toISOString(),
            tasks: [],
          },
        ],
      };

    case "UPDATE_BOARD":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.id
            ? { ...b, title: action.title, color: action.color }
            : b
        ),
      };

    case "DELETE_BOARD":
      return { ...state, boards: state.boards.filter((b) => b.id !== action.id) };

    case "ADD_TASK":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.boardId
            ? {
                ...b,
                tasks: [
                  {
                    ...action.task,
                    id: uid(),
                    status: "todo",
                    createdAt: new Date().toISOString(),
                  },
                  ...b.tasks,
                ],
              }
            : b
        ),
      };

    case "UPDATE_TASK":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.boardId
            ? {
                ...b,
                tasks: b.tasks.map((t) =>
                  t.id === action.task.id ? action.task : t
                ),
              }
            : b
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.boardId
            ? { ...b, tasks: b.tasks.filter((t) => t.id !== action.taskId) }
            : b
        ),
      };

    case "SET_TASK_STATUS":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.boardId
            ? {
                ...b,
                tasks: b.tasks.map((t) =>
                  t.id === action.taskId
                    ? {
                        ...t,
                        status: action.status,
                        completedAt:
                          action.status === "done"
                            ? t.completedAt ?? new Date().toISOString()
                            : undefined,
                      }
                    : t
                ),
              }
            : b
        ),
      };

    case "ADD_ROUTINE":
      return {
        ...state,
        routines: [
          ...state.routines,
          {
            id: uid(),
            title: action.title,
            frequency: action.frequency,
            color: action.color,
            createdAt: new Date().toISOString(),
            history: [],
          },
        ],
      };

    case "UPDATE_ROUTINE":
      return {
        ...state,
        routines: state.routines.map((r) =>
          r.id === action.id
            ? { ...r, title: action.title, frequency: action.frequency, color: action.color }
            : r
        ),
      };

    case "DELETE_ROUTINE":
      return {
        ...state,
        routines: state.routines.filter((r) => r.id !== action.id),
      };

    case "TOGGLE_ROUTINE":
      return {
        ...state,
        routines: state.routines.map((r) => {
          if (r.id !== action.id) return r;
          const today = dayKey();
          if (isDoneThisPeriod(r)) {
            // Desmarcar: quitar las marcas del periodo actual
            const current = periodKey(r.frequency, new Date());
            return {
              ...r,
              history: r.history.filter(
                (d) => periodKey(r.frequency, new Date(d)) !== current
              ),
            };
          }
          return { ...r, history: [...r.history, today] };
        }),
      };

    case "IMPORT":
      return action.state;

    default:
      return state;
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      return {
        boards: parsed.boards ?? [],
        routines: parsed.routines ?? [],
      };
    }
  } catch {
    /* ignore */
  }
  return { boards: seed(), routines: seedRoutines() };
}

interface AppContextValue extends State {
  addBoard: (title: string, color: BoardColor) => void;
  updateBoard: (id: string, title: string, color: BoardColor) => void;
  deleteBoard: (id: string) => void;
  addTask: (
    boardId: string,
    task: { title: string; description?: string; priority: Priority; dueDate?: string }
  ) => void;
  updateTask: (boardId: string, task: Task) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  setTaskStatus: (boardId: string, taskId: string, status: Status) => void;
  addRoutine: (title: string, frequency: Frequency, color: BoardColor) => void;
  updateRoutine: (id: string, title: string, frequency: Frequency, color: BoardColor) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutine: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: AppContextValue = {
    ...state,
    addBoard: (title, color) => dispatch({ type: "ADD_BOARD", title, color }),
    updateBoard: (id, title, color) =>
      dispatch({ type: "UPDATE_BOARD", id, title, color }),
    deleteBoard: (id) => dispatch({ type: "DELETE_BOARD", id }),
    addTask: (boardId, task) => dispatch({ type: "ADD_TASK", boardId, task }),
    updateTask: (boardId, task) =>
      dispatch({ type: "UPDATE_TASK", boardId, task }),
    deleteTask: (boardId, taskId) =>
      dispatch({ type: "DELETE_TASK", boardId, taskId }),
    setTaskStatus: (boardId, taskId, status) =>
      dispatch({ type: "SET_TASK_STATUS", boardId, taskId, status }),
    addRoutine: (title, frequency, color) =>
      dispatch({ type: "ADD_ROUTINE", title, frequency, color }),
    updateRoutine: (id, title, frequency, color) =>
      dispatch({ type: "UPDATE_ROUTINE", id, title, frequency, color }),
    deleteRoutine: (id) => dispatch({ type: "DELETE_ROUTINE", id }),
    toggleRoutine: (id) => dispatch({ type: "TOGGLE_ROUTINE", id }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}

/** Datos de ejemplo para el primer arranque. */
function seed(): Board[] {
  const now = Date.now();
  const daysAgo = (n: number) =>
    new Date(now - n * 86400000).toISOString();
  const inDays = (n: number) =>
    new Date(now + n * 86400000).toISOString().slice(0, 10);

  const mk = (
    title: string,
    priority: Priority,
    status: Status,
    opts: { created?: number; completed?: number; due?: number; desc?: string } = {}
  ): Task => ({
    id: uid(),
    title,
    description: opts.desc,
    priority,
    status,
    createdAt: daysAgo(opts.created ?? 3),
    completedAt: status === "done" ? daysAgo(opts.completed ?? 1) : undefined,
    dueDate: opts.due !== undefined ? inDays(opts.due) : undefined,
  });

  return [
    {
      id: uid(),
      title: "Trabajo",
      color: BOARD_COLORS[0],
      createdAt: daysAgo(10),
      tasks: [
        mk("Preparar presentación del Q3", "high", "in_progress", { due: 2, desc: "Incluir métricas de ventas." }),
        mk("Responder correos pendientes", "medium", "done", { created: 2, completed: 1 }),
        mk("Actualizar documentación del proyecto", "low", "todo", { due: 7 }),
        mk("Revisar pull requests del equipo", "medium", "done", { created: 4, completed: 2 }),
      ],
    },
    {
      id: uid(),
      title: "Personal",
      color: BOARD_COLORS[1],
      createdAt: daysAgo(8),
      tasks: [
        mk("Hacer la compra semanal", "medium", "todo", { due: 1 }),
        mk("Reservar cita médica", "high", "todo", { due: 3 }),
        mk("Pagar facturas", "high", "done", { created: 5, completed: 4 }),
      ],
    },
    {
      id: uid(),
      title: "Aprendizaje",
      color: BOARD_COLORS[4],
      createdAt: daysAgo(6),
      tasks: [
        mk("Terminar curso de React", "medium", "in_progress", { desc: "Módulo de hooks avanzados." }),
        mk("Leer un capítulo de TypeScript", "low", "done", { created: 3, completed: 1 }),
        mk("Practicar Tailwind con un proyecto", "low", "todo"),
      ],
    },
  ];
}

function seedRoutines(): Routine[] {
  const now = Date.now();
  const daysAgo = (n: number) => dayKey(new Date(now - n * 86400000));
  return [
    {
      id: uid(),
      title: "Beber 2L de agua",
      frequency: "daily",
      color: BOARD_COLORS[4],
      createdAt: new Date(now - 9 * 86400000).toISOString(),
      history: [daysAgo(1), daysAgo(2), daysAgo(3)],
    },
    {
      id: uid(),
      title: "Hacer ejercicio",
      frequency: "daily",
      color: BOARD_COLORS[1],
      createdAt: new Date(now - 9 * 86400000).toISOString(),
      history: [daysAgo(1), daysAgo(3)],
    },
    {
      id: uid(),
      title: "Planificar la semana",
      frequency: "weekly",
      color: BOARD_COLORS[0],
      createdAt: new Date(now - 20 * 86400000).toISOString(),
      history: [daysAgo(8), daysAgo(15)],
    },
    {
      id: uid(),
      title: "Revisar presupuesto",
      frequency: "monthly",
      color: BOARD_COLORS[3],
      createdAt: new Date(now - 40 * 86400000).toISOString(),
      history: [daysAgo(35)],
    },
  ];
}
