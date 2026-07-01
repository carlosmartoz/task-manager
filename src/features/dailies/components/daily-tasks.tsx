import { Plus, RotateCcw, Sun } from "lucide-react";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { EmptyBox } from "@/src/components/empty-box";
import { PageHeader } from "@/src/components/page-header";
import { CompletionBanner } from "@/src/components/completion-banner";
import { useDailyView } from "@/src/features/dailies/hooks/use-daily-view";
import { TaskGroupItem } from "@/src/features/task-groups/components/task-group-item";

export function DailyTasks() {
  const {
    add,
    draft,
    isDone,
    dailies,
    allDone,
    setDraft,
    doneCount,
    askDelete,
    askClearDone,
    toggleDaily,
    completionPercent,
  } = useDailyView();

  return (
    <div>
      <div className="mb-6">
        <PageHeader
          title="Daily tasks"
          subtitle={`${dailies.length} ${dailies.length === 1 ? "task" : "tasks"} · ${doneCount} done`}
          completionPercent={dailies.length ? completionPercent : undefined}
        />
      </div>

      <form onSubmit={add} className="mb-4 flex gap-2">
        <Input value={draft} onChange={setDraft} placeholder="Add a task…" />

        <Button icon={Plus} type="submit">
          Add
        </Button>
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

          {doneCount > 0 && (
            <div className="mb-3 flex justify-end">
              <Button
                variant="ghost"
                icon={RotateCcw}
                iconSize={14}
                onClick={askClearDone}
              >
                Clear done
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {dailies.map((d) => (
              <TaskGroupItem
                key={d.id}
                task={{ ...d, done: isDone(d) }}
                onToggle={() => toggleDaily(d.id)}
                onDelete={() => askDelete(d)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
