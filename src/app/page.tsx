import { lazy, Suspense, useState } from "react";
import { Loader2 } from "lucide-react";
import BoardsView from "@/src/components/boards-view";
import RoutinesView from "@/src/components/routines-view";
import Nav from "@/src/components/nav";
import type { Tab } from "@/src/types";
import { Brand } from "@/src/components/brand";
import ConfirmDialog from "@/src/components/confirm-dialog";
const StatsView = lazy(() => import("@/src/components/stats-view"));

export function Page() {
  const [tab, setTab] = useState<Tab>("boards");

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-5 lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <Brand />

        <Nav tab={tab} onChange={setTab} layoutId="sidebar-active" />
      </aside>

      <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-dark--600 bg-dark--900/90 px-4 py-2 backdrop-blur lg:hidden">
        <span className="mr-auto flex min-w-0 items-center gap-2 font-bold">
          <Wallet className="h-5 w-5 shrink-0 text-brand-400" />
          <span className="truncate">Expense Tracker</span>
        </span>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-label={t.label}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === t.id
                  ? "bg-brand-500/10 text-brand-400"
                  : "text-text-subtle"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </button>
          );
        })}

        {/* Always-reachable data actions */}
        <span className="mx-1 h-5 w-px bg-dark--600" />
        <button
          onClick={resetToSeed}
          aria-label="Restore demo"
          title="Restore demo"
          className="cursor-pointer rounded-lg px-2.5 py-1.5 text-text-subtle transition hover:bg-dark--700 hover:text-text-primary"
        >
          <RotateCcw className="h-[18px] w-[18px]" />
        </button>
        <button
          onClick={() => setConfirmClear(true)}
          aria-label="Clear all"
          title="Clear all"
          className="cursor-pointer rounded-lg px-2.5 py-1.5 text-text-subtle transition hover:bg-coral/10 hover:text-coral"
        >
          <Trash2 className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <div key={tab} className="animate-fade-in">
            {tab === "boards" && <BoardsView />}
            {tab === "routines" && <RoutinesView />}
            {tab === "stats" && (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-32 text-slate-400">
                    <Loader2 className="animate-spin" size={28} />
                  </div>
                }
              >
                <StatsView />
              </Suspense>
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog />
    </div>
  );
}
