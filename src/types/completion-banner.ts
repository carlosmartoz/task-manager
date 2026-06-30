export interface CompletionBannerProps {
  done: number;
  total: number;
  allDone: boolean;
  /** Message shown when every task is done, e.g. "All tasks cleared." */
  clearedText: string;
  /** Noun for the progress line, e.g. "tasks" → "…of 5 tasks." */
  unit?: string;
}
