import { IconFlame } from '@tabler/icons-react'

type GlobalStreakProps = {
  streak: number
}

// Days in a row completing every task that was due; hidden until there is one.
export function GlobalStreak({ streak }: GlobalStreakProps) {
  if (streak <= 0) return null

  return (
    <span
      className="mr-1 flex items-center gap-1 text-sm font-semibold text-muted-foreground"
      title={`${streak} ${streak === 1 ? 'day' : 'days'} completing every task`}
    >
      <IconFlame className="size-4.5" />
      {streak}
    </span>
  )
}
