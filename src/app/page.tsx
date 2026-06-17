import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fadeIn } from "@/src/lib/motion";
import { Header } from "@/src/app/header";
import { useTabStore } from "@/src/store/tab-store";
import BoardsView from "@/src/components/boards-view";
import RoutinesView from "@/src/components/routines-view";
import ConfirmDialog from "@/src/components/confirm-dialog";
const StatsView = lazy(() => import("@/src/components/stats-view"));

export function Page() {
  const tab = useTabStore((s) => s.tab);

  return (
    <div className="min-h-screen lg:flex">
      <Header />

      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <motion.div key={tab} {...fadeIn}>
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
        </motion.div>
      </main>

      <ConfirmDialog />
    </div>
  );
}
