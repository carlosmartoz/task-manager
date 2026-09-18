# Task Manager

A **daily habits** app: tasks carry over from one day to the next, and when the day
changes what was met is archived and progress returns to zero. A task can demand several
repetitions (`target`) and be limited to certain weekdays. Local, no backend.

Full specs: [docs/SPECS.md](docs/SPECS.md). This file is the working summary.

## Commands

```bash
npm run dev        # dev server
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npm run typecheck  # tsc -b --noEmit
npm test           # vitest run
npm run check      # lint + typecheck + test: the gate before calling anything done
```

Before calling a change finished, `npm run check` has to pass in full.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind 4 · shadcn on Base UI (`@base-ui/react`) ·
Tabler icons · Vitest. PWA with a hand-written manifest and service worker.

## Layout

```
src/
  components/
    ui/       shadcn generated; do not reformat
    tasks/    TaskForm, TaskList, TaskItem, TaskProgress, WeekdayPicker
    shell/    DataActions, UndoToast
  hooks/      useTasks (state), useTaskForm, useBackup
  lib/        config, date, weekdays, tasks, storage, download, utils
  types/      one type per file, re-exported from index.ts
tests/        mirrors the src/ tree
```

Types are always imported from the barrel: `import type { Task } from '@/types'`.

## Model

```ts
type Task = { id, title, repeats, target, progress, weekdays, createdAt }
const isTaskDone = (task) => task.progress >= task.target
```

**`done` is derived, never a field.** A plain task is `target: 1`; the checkbox is the
degenerate case of the counter. Do not introduce two kinds of task.

**`repeats`** says how long the task lives, not how it works: `true` is the daily habit
(days, target, streaks); `false` is a one-off, always due, `target: 1`, no streak, and
dropped on the day change once it is met. `scheduleOf` strips the days and the target of a
one-off on creation and on edit.

## Hard rules

- **No new dependencies** without justifying it first. No router, state manager, date
  library, drag & drop library or backend: the project is deliberately minimal. Reordering
  is drag & drop written by hand on the native HTML5 API, in `TaskList`.
- **Language**: everything in English — identifiers, filenames, UI copy, comments and
  documentation.
- **Dark theme only.** There is no theme switch and no light palette. The `dark` class is
  pinned on `<html>` in [index.html](index.html) solely because the shadcn primitives
  ship `dark:` variants that hang off it.
- **Pure domain logic → `src/lib/`**, never inside components. If something can be tested
  without mounting a component, that is where it goes. It is what makes it testable.
- **State and forms → `src/hooks/`.** Components only receive data and callbacks through
  props; they neither compute nor hold domain logic.
- **Domain constants and storage keys → [`lib/config.ts`](src/lib/config.ts)**, not
  scattered across the files that use them.
- **Actions take an `id`, never an array index.**
- **`src/components/ui/`** is shadcn-generated code. Do not reformat it or bend it to the
  rest of the project's style; change it only for deliberate design changes.
- **Every control without visible text carries an `aria-label`**, including the task
  title when it repeats down the list (`Move "Drink water" up`).
- **`cursor-pointer`**: `<button>` already gets it from a base rule in
  [index.css](src/index.css). Add it by hand only on other elements you make clickable.
- **External data is always sanitized** on the way in (`sanitizeState`): `localStorage`
  and imported files are not to be trusted.

## Naming

| Element | Convention | Example |
|---|---|---|
| Own component | `PascalCase.tsx` grouped by feature | `tasks/TaskItem.tsx` |
| shadcn component | `kebab-case.tsx` in `src/components/ui/` | `button.tsx` |
| Hook | `useSomething.ts` in `src/hooks/` | `useTasks.ts` |
| Utility | `camelCase.ts` in `src/lib/` | `date.ts` |
| Domain type | `PascalCase.ts`, one per file in `src/types/` | `Task.ts` |
| Test | in `tests/`, mirroring the source path | `tests/lib/tasks.test.ts` |
| Props | `type <Component>Props` in the component's own file | `TaskItemProps` |
| Callback prop | `on<Event>` | `onAdvance`, `onSwap` |
| Internal handler | `handle<Event>` or a plain verb | `handleSubmit`, `save` |

Use `remove`, not `delete`. Precise verbs: `advance` is not `toggle`, `swap` is not
`move`. Prefixed booleans (`isEditing`, `dimmed`).

## Code style

- Single quotes, no semicolons, trailing commas, 2 spaces.
- Imports: React and externals first, blank line, then `@/...`. Always the `@/` alias,
  never relative paths going up (`../`).
- A separate `import type { X }` for types (`verbatimModuleSyntax` is on).
- `type`, not `interface`.
- Named `export function Component()`; only `App` uses a default export.
- **Single-line comments** (`//`), never `/** */` blocks. They explain the why in one
  sentence; if three are needed, the code is what needs fixing.
- Tailwind with semantic tokens (`text-muted-foreground`, `bg-card`), never literal
  colours. Conditional classes through `cn()`.
