import type { DayKey } from '@/types/DayKey'

// Day → ids of the tasks archived that day.
export type TaskHistory = Record<DayKey, string[]>
