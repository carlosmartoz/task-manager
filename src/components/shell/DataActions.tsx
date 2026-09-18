import { useRef, type ChangeEvent } from 'react'
import { IconDownload, IconUpload } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { useBackup } from '@/hooks/useBackup'
import type { TasksState } from '@/types'

type DataActionsProps = {
  state: TasksState
  onImport: (state: TasksState) => void
}

export function DataActions({ state, onImport }: DataActionsProps) {
  const { error, exportBackup, importBackup } = useBackup(state, onImport)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Lets the same file be picked again after an error.
    event.target.value = ''
    if (file) importBackup(file)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={exportBackup}
          aria-label="Export tasks to a file"
        >
          <IconDownload />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => fileRef.current?.click()}
          aria-label="Import tasks from a file"
        >
          <IconUpload />
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
