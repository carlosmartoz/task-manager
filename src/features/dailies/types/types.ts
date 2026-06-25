export interface DailyTask {
  id: string;
  title: string;
  createdAt: string;
  /**
   * Día (YYYY-MM-DD) en el que se marcó por última vez como completada.
   * La tarea cuenta como "hecha hoy" solo si coincide con la fecha actual,
   * por lo que el check se reinicia automáticamente cada día.
   */
  completedOn?: string;
}
