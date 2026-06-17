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
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={onClose}
          {...fadeIn}
        >
          <motion.div
            className={`w-full ${maxWidth} rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl`}
            onMouseDown={(e) => e.stopPropagation()}
            {...scaleIn}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
