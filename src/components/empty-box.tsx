import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/motion";
import type { EmptyBoxProps } from "@/src/types/empty-box";

export function EmptyBox({ icon: Icon, title, description }: EmptyBoxProps) {
  return (
    <motion.div
      {...fadeInUp}
      className="cyber-clip border border-dashed border-accent py-20 text-center"
    >
      <Icon className="mx-auto mb-3 text-foreground" size={40} />

      <p className="font-medium text-foreground">{title}</p>

      <p className="text-sm text-foreground-muted">{description}</p>
    </motion.div>
  );
}
