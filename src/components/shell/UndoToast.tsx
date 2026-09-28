import { IconX } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import type { PendingUndo } from '@/types'

type UndoToastProps = {
  pendingUndo: PendingUndo
  onUndo: () => void
  onDismiss: () => void
}

export function UndoToast({ pendingUndo, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="card fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-2 p-3 animate-in fade-in slide-in-from-bottom-2"
    >
      <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
        {pendingUndo.kind === 'remove' ? (
          <>
            Task deleted:{' '}
            <span className="font-medium text-foreground">
              {pendingUndo.task.title}
            </span>
          </>
        ) : (
          'Backup imported: your previous tasks were replaced.'
        )}
      </p>
      <Button size="sm" variant="outline" onClick={onUndo}>
        Undo
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onDismiss}
        aria-label="Dismiss notice"
      >
        <IconX />
      </Button>
    </div>
  )
}
