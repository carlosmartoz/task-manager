import type { TaskPatch } from '@/types/TaskPatch'

// What it takes to create a task; `createTask` fills in the rest.
export type NewTask = TaskPatch & { title: string }
