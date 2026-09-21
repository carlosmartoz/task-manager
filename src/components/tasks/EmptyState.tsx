import { IconChecklist } from '@tabler/icons-react'

// What a first visit sees before there is any task.
export function EmptyState() {
  return (
    <section className="card flex flex-col items-center gap-4 p-8 text-center sm:p-12">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <IconChecklist className="size-7" />
      </span>

      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Nothing here yet</h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          Use the form to write down the habits you want to keep. What you do
          today shows up here, and starts over tomorrow.
        </p>
      </div>

      <p className="text-xs text-subtle-foreground">
        Already have a backup? Use{' '}
        <span className="text-muted-foreground">Import</span> at the top.
      </p>
    </section>
  )
}
