import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/motion";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/src/components/button";
import { TaskCard } from "@/src/features/task-groups/components/task-card";
import { useTaskGroups } from "@/src/features/task-groups/hooks/use-task-groups";
import { TaskGroupsDetail } from "@/src/features/task-groups/components/task-groups-detail";

export function TaskGroups() {
  const { groups, active, openGroup, back, createGroup, editGroup, askDelete } =
    useTaskGroups();

  if (active) {
    return <TaskGroupsDetail taskGroup={active} onBack={back} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-base font-bold uppercase text-foreground">
          Task groups
        </h1>

        <Button icon={Plus} onClick={createGroup}>
          New task group
        </Button>
      </div>

      {groups.length === 0 ? (
        <motion.div
          {...fadeInUp}
          className="cyber-clip border border-dashed border-accent py-20 text-center"
        >
          <LayoutGrid className="mx-auto mb-3 text-foreground" size={44} />

          <p className="font-medium text-foreground">
            You don't have any task groups yet
          </p>

          <p className="mb-4 text-sm text-foreground-muted">
            Create your first task group to start organizing tasks.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.06 }}
            >
              <TaskCard
                group={group}
                onEdit={() => editGroup(group)}
                onDelete={() => askDelete(group)}
                onOpen={() => openGroup(group.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
