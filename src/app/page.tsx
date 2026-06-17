import { Loader2 } from "lucide-react";
import type { Tab } from "@/src/types";
import { Header } from "@/src/app/header";
import { lazy, Suspense, useState } from "react";
import BoardsView from "@/src/components/boards-view";
import RoutinesView from "@/src/components/routines-view";
import ConfirmDialog from "@/src/components/confirm-dialog";
const StatsView = lazy(() => import("@/src/components/stats-view"));

export function Page() {
  const [tab, setTab] = useState<Tab>("boards");

  return (
    <div className="min-h-screen">
      <Header tab={tab} onChange={setTab} />

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

      <ConfirmDialog />
    </div>
  );
}
