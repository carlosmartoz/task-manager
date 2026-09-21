import type { DayKey } from '@/types/DayKey'

// Day → ids of the tasks completed that day.
export type TaskHistory = Record<DayKey, string[]>
