import { Check, Plus, Sun, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { EmptyBox } from "@/src/components/empty-box";
import { CompletionBanner } from "@/src/components/completion-banner";
import { useDailyView } from "@/src/features/dailies/hooks/use-daily-view";

export default function DailyView() {
  const {
    dailies,
    draft,
    setDraft,
    isDone,
    doneCount,
    allDone,
    add,
    askDelete,
    toggleDaily,
  } = useDailyView();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-base font-bold uppercase tracking-wide text-fg-strong">
          Daily tasks
        </h1>
      </div>

      <form onSubmit={add} className="mb-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a daily task…"
          className="cyber-clip min-w-0 flex-1 border border-border-strong bg-surface-raised px-3 py-3 text-sm text-fg placeholder-fg-subtle outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-1.5 rounded-none border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent-soft transition hover:bg-accent/20 active:scale-95"
        >
          <Plus size={20} /> Add
        </button>
      </form>

      {dailies.length === 0 ? (
        <EmptyBox
          icon={Sun}
          title="No daily tasks yet"
          description="Add your first daily task above."
        />
      ) : (
        <>
          <CompletionBanner
            done={doneCount}
            total={dailies.length}
            allDone={allDone}
            clearedText="All daily tasks cleared."
            unit="tasks today"
          />

          <div className="space-y-2">
            {dailies.map((d) => {
              const done = isDone(d);
              return (
                <div
                  key={d.id}
                  className={cn(
                    "group cyber-clip flex items-center gap-3 border p-3 transition-all duration-200",
                    done
                      ? "border-accent/50 bg-accent/10"
                      : "border-border bg-surface hover:border-border-strong",
                  )}
                >
                  <button
                    onClick={() => toggleDaily(d.id)}
                    title={done ? "Mark as pending" : "Mark as done"}
                    className={cn(
                      "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90",
                      done
                        ? "border-accent bg-accent text-inverse"
                        : "border-fg-faint text-transparent hover:border-accent",
                    )}
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>

                  <p
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm normal-case",
                      done
                        ? "font-semibold tracking-wide text-accent-soft"
                        : "font-medium text-fg",
                    )}
                  >
                    {d.title}
                  </p>

                  <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => askDelete(d)}
                      className="cursor-pointer rounded-sm p-1.5 text-fg-muted transition hover:bg-danger/10 hover:text-danger-fg"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
