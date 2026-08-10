import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type TaskInputProps = {
  onAdd: (title: string) => void
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onAdd(title)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="¿Qué tienes que hacer hoy?"
        aria-label="Nueva tarea"
        className="h-10"
      />
      <Button type="submit" size="lg" disabled={!title.trim()} className="h-10">
        <Plus />
        Añadir
      </Button>
    </form>
  )
}
