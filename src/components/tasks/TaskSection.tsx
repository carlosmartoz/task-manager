import type { ReactNode } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

type TaskSectionProps = {
  title: string
  // Short tally on the right of the heading: "2 of 5 done".
  summary: string
  // Folded behind its heading until someone opens it.
  collapsible?: boolean
  children: ReactNode
}

// A card holding one of the lists on screen.
export function TaskSection({
  title,
  summary,
  collapsible = false,
  children,
}: TaskSectionProps) {
  const tally = <p className="text-sm text-subtle-foreground">{summary}</p>

  if (collapsible) {
    // Native <details>: keyboard and screen reader support without extra state.
    return (
      <details className="group/section card min-w-0 p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
          <h2 className="flex items-center gap-1.5 text-lg font-bold">
            {title}
            <IconChevronDown className="size-4 text-muted-foreground transition-transform group-open/section:rotate-180" />
          </h2>
          {tally}
        </summary>

        {children}
      </details>
    )
  }

  return (
    <section className="card h-fit min-w-0 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        {tally}
      </div>

      {children}
    </section>
  )
}
