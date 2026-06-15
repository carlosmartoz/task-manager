import { lazy, Suspense, useState } from "react";
import { BarChart3, LayoutGrid, CheckSquare, Repeat, Loader2 } from "lucide-react";
import BoardsView from "./components/BoardsView";
import RoutinesView from "./components/RoutinesView";
import { cn } from "./lib/utils";

// Code-splitting: Recharts (pesado) solo se carga al abrir Statistics.
const StatsView = lazy(() => import("./components/StatsView"));

type Tab = "boards" | "routines" | "stats";

export default function App() {
  const [tab, setTab] = useState<Tab>("boards");

  const tabs: { key: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { key: "boards", label: "Boards", icon: LayoutGrid },
    { key: "routines", label: "Routines", icon: Repeat },
    { key: "stats", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <CheckSquare size={20} />
            </div>
            <span className="text-lg font-bold text-slate-50">Task Manager</span>
          </div>

          <nav className="flex gap-1 rounded-xl bg-slate-900 p-1 ring-1 ring-slate-800">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  tab === t.key
                    ? "bg-slate-800 text-indigo-300 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
                )}
              >
                <t.icon size={16} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* key={tab} reinicia la animación de entrada al cambiar de pestaña */}
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
  );
}
