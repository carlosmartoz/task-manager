import { IconX } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

type UndoToastProps = {
  title: string
  onUndo: () => void
  onDismiss: () => void
}

export function UndoToast({ title, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-lg animate-in fade-in slide-in-from-bottom-2"
    >
      <p className="min-w-0 flex-1 truncate text-sm">
        Tarea eliminada: {title}
      </p>
      <Button size="sm" variant="secondary" onClick={onUndo}>
        Deshacer
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onDismiss}
        aria-label="Descartar aviso"
      >
        <IconX />
      </Button>
    </div>
  )
}
