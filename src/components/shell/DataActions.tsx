import { useRef, useState, type ChangeEvent } from 'react'
import { IconDownload, IconUpload } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { backupFilename, parseBackup, serializeBackup } from '@/lib/storage'
import type { TasksState } from '@/types/task'

type DataActionsProps = {
  state: TasksState
  onImport: (state: TasksState) => void
}

/**
 * Los datos solo viven en este navegador: si el usuario limpia el sitio, los
 * pierde. Exportar e importar es el único respaldo que tiene.
 */
export function DataActions({ state, onImport }: DataActionsProps) {
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    setError(null)

    const blob = new Blob([serializeBackup(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = backupFilename()
    link.click()
    // Revocar de forma síncrona puede cancelar la descarga en algunos navegadores.
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Permite volver a elegir el mismo archivo tras un error.
    event.target.value = ''
    if (!file) return

    try {
      onImport(parseBackup(await file.text()))
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo leer el archivo.')
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleExport}
          aria-label="Exportar tareas a un archivo"
        >
          <IconDownload />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => fileRef.current?.click()}
          aria-label="Importar tareas desde un archivo"
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
