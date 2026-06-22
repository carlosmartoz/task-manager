import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "@/src/lib/motion";
import type { ModalProps } from "@/src/types";

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-overlay/60 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={onClose}
          {...fadeIn}
        >
          <motion.div
            className={`w-full ${maxWidth} cyber-clip overflow-hidden border border-border bg-surface shadow-2xl`}
            onMouseDown={(e) => e.stopPropagation()}
            {...scaleIn}
          >
            <div className="h-1 w-full bg-accent" />
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-mono text-lg font-bold uppercase tracking-wide text-fg">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-sm p-1.5 text-fg-subtle transition hover:bg-surface-raised hover:text-fg-label"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
