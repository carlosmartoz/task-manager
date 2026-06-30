import type { ProgressBarProps } from "@/src/types/progress-bar";

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-1 overflow-hidden bg-surface-raised">
      <div
        className="h-full bg-accent transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
