import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  /** Optional secondary line under the title (e.g. "5 tasks · 2 done"). */
  subtitle?: ReactNode;
  /** When set (0–100), renders a progress bar + "% COMPLETE" line below the title. */
  completionPercent?: number;
}
