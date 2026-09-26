// Domain constants and storage keys, all in one place.

export const MIN_TARGET = 1
export const MAX_TARGET = 99

export const STORAGE_KEY = 'daily-task-manager:v2'
export const LEGACY_KEY = 'daily-task-manager:v1'

// Version of the exported format; bump it when `TasksState` changes shape.
export const BACKUP_VERSION = 5

// Hour the day starts, local time: until then a late night still belongs to
// the day before.
export const DAY_START_HOUR = 5

// How often the day change is checked while the tab stays open.
export const DAY_CHECK_INTERVAL = 30_000

// Window to undo a deletion.
export const UNDO_TIMEOUT = 6_000
