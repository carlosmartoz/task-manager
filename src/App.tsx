import { useState } from "react";
import { BarChart3, LayoutGrid, CheckSquare, Repeat } from "lucide-react";
import BoardsView from "./components/BoardsView";
import StatsView from "./components/StatsView";
import RoutinesView from "./components/RoutinesView";
import { cn } from "./lib/utils";

type Tab = "boards" | "routines" | "stats";

export default function App() {
  const [tab, setTab] = useState<Tab>("boards");

  const tabs: { key: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { key: "boards", label: "Cards", icon: LayoutGrid },
    { key: "routines", label: "Rutinas", icon: Repeat },
    { key: "stats", label: "Estadísticas", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <CheckSquare size={20} />
            </div>
            <span className="text-lg font-bold text-slate-100">TaskBoards</span>
          </div>

          <nav className="flex gap-1 rounded-xl bg-slate-900 p-1 ring-1 ring-slate-800">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  tab === t.key
                    ? "bg-slate-800 text-indigo-300 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
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
        {tab === "boards" && <BoardsView />}
        {tab === "routines" && <RoutinesView />}
        {tab === "stats" && <StatsView />}
      </main>
    </div>
  );
}
