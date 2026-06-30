import { cn } from "@/src/lib/utils";
import type { CompletionBannerProps } from "@/src/types/completion-banner";

export function CompletionBanner({
  done,
  total,
  allDone,
  clearedText,
  unit = "tasks",
}: CompletionBannerProps) {
  return (
    <div
      className={cn(
        "cyber-clip mb-4 border px-4 py-3 text-sm",
        allDone
          ? "border-accent/50 bg-accent/10 text-accent-soft"
          : "border-border bg-surface text-foreground",
      )}
    >
      {allDone ? (
        <span className="font-semibold uppercase">{clearedText}</span>
      ) : (
        <>
          You've completed{" "}
          <span className="font-semibold text-accent">{done}</span> of{" "}
          <span className="font-semibold text-foreground">{total}</span> {unit}.
        </>
      )}
    </div>
  );
}
