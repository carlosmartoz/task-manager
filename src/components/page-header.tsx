import { ProgressBar } from "@/src/components/progress-bar";
import type { PageHeaderProps } from "@/src/types/page-header";

export function PageHeader({
  title,
  subtitle,
  completionPercent,
}: PageHeaderProps) {
  return (
    <div className="cyber-clip border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1 bg-accent" />

        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>

          {subtitle && (
            <p className="text-sm text-foreground-muted">{subtitle}</p>
          )}
        </div>
      </div>

      {completionPercent !== undefined && (
        <div className="mt-4">
          <ProgressBar value={completionPercent} />

          <p className="mt-2 text-right text-xs font-medium text-foreground-muted">
            {completionPercent}% COMPLETE
          </p>
        </div>
      )}
    </div>
  );
}
