import { useState } from 'react'

import { downloadFile } from '@/lib/download'
import { backupFilename, parseBackup, serializeBackup } from '@/lib/storage'
import type { TasksState } from '@/types'

// The data lives only in this browser: export and import are the only backup
// there is if someone clears the site.
export function useBackup(
  state: TasksState,
  onImport: (state: TasksState) => void,
) {
  const [error, setError] = useState<string | null>(null)

  function exportBackup() {
    setError(null)
    downloadFile(backupFilename(), serializeBackup(state), 'application/json')
  }

  async function importBackup(file: File) {
    try {
      onImport(parseBackup(await file.text()))
      setError(null)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'The file could not be read.',
      )
    }
  }

  return { error, exportBackup, importBackup }
}
