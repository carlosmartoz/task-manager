import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/motion";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/src/components/button";
import { EmptyBox } from "@/src/components/empty-box";
import { useTaskGroups } from "@/src/features/task-groups/hooks/use-task-groups";
import { TaskGroupCard } from "@/src/features/task-groups/components/task-group-card";
import { TaskGroupsDetail } from "@/src/features/task-groups/components/task-groups-detail";

export function TaskGroups() {
  const { taskGroups, active, onOpen, onBack, onCreate, onEdit, onDelete } =
    useTaskGroups();

  if (active) {
    return <TaskGroupsDetail taskGroup={active} onBack={onBack} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-base font-bold uppercase text-foreground">
          Task groups
        </h1>

        <Button icon={Plus} onClick={onCreate}>
          New task group
        </Button>
      </div>

      {taskGroups.length === 0 ? (
        <EmptyBox
          icon={LayoutGrid}
          title="You don't have any task groups yet"
          description="Create your first task group to start organizing tasks."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {taskGroups.map((taskGroup, i) => (
            <motion.div
              key={taskGroup.id}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.06 }}
            >
              <TaskGroupCard
                group={taskGroup}
                onEdit={() => onEdit(taskGroup)}
                onOpen={() => onOpen(taskGroup.id)}
                onDelete={() => onDelete(taskGroup)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
