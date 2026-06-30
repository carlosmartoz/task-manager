import { motion } from "framer-motion";
import { fadeIn } from "@/src/lib/motion";
import { Header } from "@/src/components/header";
import { useTabStore } from "@/src/store/tab-store";
import { DailyTasks } from "@/src/features/dailies/components/daily-tasks";
import { TaskGroups } from "@/src/features/task-groups/components/task-groups";

export function Page() {
  const tab = useTabStore((s) => s.tab);

  return (
    <div className="min-h-screen lg:flex">
      <Header />

      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <motion.div key={tab} {...fadeIn}>
          {tab === "task-groups" && <TaskGroups />}

          {tab === "daily-tasks" && <DailyTasks />}
        </motion.div>
      </main>
    </div>
  );
}
