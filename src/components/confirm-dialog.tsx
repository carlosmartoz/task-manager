import { AlertTriangle } from "lucide-react";
import { useConfirmStore } from "@/src/store/confirm-store";

/** Diálogo de confirmación global. Se monta una sola vez en el layout. */
export default function ConfirmDialog() {
  const options = useConfirmStore((s) => s.options);
  const resolve = useConfirmStore((s) => s.resolve);

  if (!options) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onMouseDown={() => resolve(false)}
    >
      <div
        className="w-full max-w-sm animate-scale-in rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full " +
              (options.danger
                ? "bg-rose-500/15 text-rose-400"
                : "bg-indigo-500/15 text-indigo-300")
            }
          >
            <AlertTriangle size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-slate-100">
              {options.title}
            </h2>
            {options.message && (
              <p className="mt-1 text-sm text-slate-300">{options.message}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => resolve(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            {options.cancelLabel ?? "Cancel"}
          </button>
          <button
            autoFocus
            onClick={() => resolve(true)}
            className={
              "rounded-lg px-4 py-2 text-sm font-medium text-white transition " +
              (options.danger
                ? "bg-rose-600 hover:bg-rose-500"
                : "bg-indigo-600 hover:bg-indigo-500")
            }
          >
            {options.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
