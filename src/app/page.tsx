import { motion } from "framer-motion";
import { fadeIn } from "@/src/lib/motion";
import { Header } from "@/src/app/header";
import { useTabStore } from "@/src/store/tab-store";
import GroupsView from "@/src/components/groups-view";
import DailyView from "@/src/components/daily-view";
import ConfirmDialog from "@/src/components/confirm-dialog";

export function Page() {
  const tab = useTabStore((s) => s.tab);

  return (
    <div className="min-h-screen lg:flex">
      <Header />

      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <motion.div key={tab} {...fadeIn}>
          {tab === "groups" && <GroupsView />}

          {tab === "daily" && <DailyView />}
        </motion.div>
      </main>

      <ConfirmDialog />
    </div>
  );
}
