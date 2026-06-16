import { create } from "zustand";
import type { ConfirmFn, ConfirmOptions } from "@/src/types";

interface ConfirmStore {
  options: ConfirmOptions | null;
  /** Opens the dialog and resolves with the user's choice (true = confirmed). */
  confirm: ConfirmFn;
  /** Closes the dialog, resolving the pending promise. */
  resolve: (value: boolean) => void;
}

// El resolver de la promesa pendiente se guarda fuera del estado: es transitorio
// y no debe disparar re-renders.
let resolver: ((value: boolean) => void) | null = null;

export const useConfirmStore = create<ConfirmStore>((set) => ({
  options: null,
  confirm: (opts) =>
    new Promise<boolean>((resolve) => {
      resolver = resolve;
      set({ options: opts });
    }),
  resolve: (value) => {
    resolver?.(value);
    resolver = null;
    set({ options: null });
  },
}));

/** Hook con la misma API de antes: devuelve la función para pedir confirmación. */
export const useConfirm = (): ConfirmFn => useConfirmStore((s) => s.confirm);
