import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, scaleIn } from "@/src/lib/motion";
import { useConfirmStore } from "@/src/store/confirm-store";

/** Diálogo de confirmación global. Se monta una sola vez en el layout. */
export default function ConfirmDialog() {
  const options = useConfirmStore((s) => s.options);
  const resolve = useConfirmStore((s) => s.resolve);

  return (
    <AnimatePresence>
      {options && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay/60 p-4 backdrop-blur-sm"
          onMouseDown={() => resolve(false)}
          {...fadeIn}
        >
          <motion.div
            className="w-full max-w-sm cyber-clip border border-border-strong bg-surface p-5 shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
            {...scaleIn}
          >
            <div className="flex items-start gap-3">
              <div
                className={
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm " +
                  (options.danger
                    ? "bg-danger/15 text-danger-text"
                    : "bg-accent/15 text-accent-soft")
                }
              >
                <AlertTriangle size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-fg">
                  {options.title}
                </h2>
                {options.message && (
                  <p className="mt-1 text-sm text-fg-muted">
                    {options.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => resolve(false)}
                className="cursor-pointer rounded-none px-4 py-2 text-sm font-medium text-fg-label uppercase transition hover:bg-surface-raised"
              >
                {options.cancelLabel ?? "Cancel"}
              </button>
              <button
                autoFocus
                onClick={() => resolve(true)}
                className={
                  "cursor-pointer rounded-none border px-4 py-2 text-sm font-bold uppercase tracking-wide transition " +
                  (options.danger
                    ? "border-danger/50 bg-danger/10 text-danger-fg hover:bg-danger/20"
                    : "border-accent/50 bg-accent/10 text-accent-soft hover:bg-accent/20")
                }
              >
                {options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
