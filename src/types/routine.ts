import type { BoardColor } from "./board";

export type Frequency = "daily" | "weekly" | "monthly";

export interface Routine {
  id: string;
  title: string;
  frequency: Frequency;
  color: BoardColor;
  createdAt: string;
  history: string[];
}

export interface RoutineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, frequency: Frequency, color: BoardColor) => void;
  routine?: Routine;
}
