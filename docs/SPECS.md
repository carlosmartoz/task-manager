# Specs — Task Manager

> The project's reference document: what we build, what we don't, and how we write the
> code. The day-to-day working summary is in [CLAUDE.md](../CLAUDE.md).

---

## 1. Goal

A **daily habits** app for a single person.

Unlike a classic to-do list, here tasks **are not deleted when completed**: they stand for
routines. When the day changes they go back to pending, what was met is archived, and the
list is reused.

**Principles that settle any decision:**

1. **Simplicity over completeness.** When in doubt, the option with less code.
2. **Zero friction.** Opening the app and adding a task should cost one gesture. No login,
   no configuration, no loading screen.
3. **Works without a network.** The data belongs to the user and lives in their browser.
4. **Accessible by default.** Keyboard and screen reader are requirements, not extras.
5. **Nothing is lost by accident.** Every deletion can be undone and the whole state can
   be exported.

### Scope

| In | Out |
|---|---|
| Task CRUD | Authentication / accounts |
| Repetition targets (`target`) | Backend, API, sync |
| Weekdays per task | Multiple lists or projects |
| Manual list order | Tags, priorities, subtasks |
| Per-task and global streaks | Notifications, reminders |
| Automatic daily reset | Statistics or progress charts |
| Undo deletion | Attachments, long notes |
| JSON export / import | Collaboration |
| Installable and offline (PWA) | Light theme or a theme switch |

What is "out" is not forbidden forever, but adding it takes a conversation first: each of
those features breaks one of the five principles.

### Technical constraints that follow

- **No router.** It is a single screen.
- **No external state manager.** `useState` plus one hook of our own is enough and will
  stay enough while the scope does not change.
- **No date library.** `Intl` and the native `Date` API cover the use case.
- **No PWA plugin.** The manifest and the service worker are hand written (~60 lines)
  because the case is simple and a build dependency is not justified.
- **No new dependencies** without explicit justification.

---

## 2. Domain model

```ts
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0 = Sunday, same as Date.getDay()
type DayKey = string                       // 'YYYY-MM-DD' in local time

type Task = {
  id: string
  title: string
  repeats: boolean    // a daily habit; false = a one-off, done once and gone
  target: number      // 1..99 repetitions needed. 1 = a plain task
  progress: number    // 0..target repetitions logged today
  weekdays: Weekday[] // empty = every day
  createdAt: number
}

type TasksState = {
  tasks: Task[]                      // array order is display order
  lastResetDate: DayKey
  history: Record<DayKey, string[]>  // day → ids completed that day
}
```

### `done` is derived, not stored

```ts
const isTaskDone = (task: Task) => task.progress >= task.target
```

This is the central decision of the model. Storing `done` **and** `progress` as separate
fields would allow the impossible state "done with 3 of 8", and would force keeping them
in sync on every action. By deriving it, that bug cannot be written.

Its useful consequence: **a plain task is simply `target: 1`**. There is no second kind of
task and no conditional branches spread across the components; the checkbox is the
degenerate case of the counter.

### Repeating tasks and one-off tasks

`repeats` says whether the task comes back. It is not a second kind of task in the sense
above — progress works the same either way — it only says how long the task lives:

| | `repeats: true` (default) | `repeats: false` |
|---|---|---|
| Schedule | `weekdays`, empty = every day | always due, until it is done |
| Counter | `target` 1..99 | always 1 |
| Streak | per-task and global | none; it is left out of both |
| Day change | progress back to zero | if it was met, the task is gone |

A one-off carries neither `weekdays` nor a `target` above 1: `scheduleOf` strips both when
`repeats` is false, both on creation and on edit, so no unreachable state is stored.

### Invariants

Guaranteed in the hook and in `lib/`, never in the components:

- `title` is neither empty nor padded with stray spaces. Adding or editing to blank is a
  silent no-op.
- `target` is an integer between 1 and 99. Any input is normalized by `normalizeTarget`.
- `progress` sits between 0 and `target`. **Lowering `target` clamps `progress`**; that is
  the edge case people forget.
- `weekdays` has no duplicates, is sorted, and only holds 0..6. The empty list means
  "every day", and the UI never allows leaving zero days marked: it would be
  indistinguishable from "every day".
- A task with `repeats: false` always has `target: 1` and `weekdays: []`.
- `id` is unique and stable for the whole life of the task.

---

## 3. Architecture

```
main.tsx  ── registers the service worker in production
└── App.tsx ────────── useTasks()  ← the single source of truth
    ├── tasks/TaskInput ──── useTaskForm
    │                     └─ tasks/WeekdayPicker
    ├── tasks/TaskList ───── tasks/TaskItem ─── tasks/TaskProgress
    │                                        ├─ tasks/WeekdayPicker
    │                                        └─ useTaskForm
    ├── shell/DataActions ── useBackup   (export / import)
    └── shell/UndoToast
```

**One-way data flow.** `useTasks` owns the state; components receive data through props
and signal intent through callbacks. No component reads or writes `localStorage` directly.

### Responsibilities

| Module | Responsibility | Must not |
|---|---|---|
| [`lib/config.ts`](../src/lib/config.ts) | Domain constants and storage keys | Hold logic |
| [`lib/date.ts`](../src/lib/date.ts) | Day keys and date formatting | Know anything about tasks |
| [`lib/weekdays.ts`](../src/lib/weekdays.ts) | Labels, selection and weekly scheduling | Touch progress |
| [`lib/tasks.ts`](../src/lib/tasks.ts) | **Pure** domain logic: progress, reset, streaks, order | Touch `localStorage` or React |
| [`lib/storage.ts`](../src/lib/storage.ts) | Serialize, validate, migrate, back up | Hold business rules |
| [`lib/download.ts`](../src/lib/download.ts) | Hand a piece of text over as a file | Know what is being downloaded |
| [`hooks/useTasks.ts`](../src/hooks/useTasks.ts) | State, invariants, persistence, undo | Hold JSX or style classes |
| [`hooks/useTaskForm.ts`](../src/hooks/useTaskForm.ts) | Fields shared by create and edit | Persist anything |
| [`hooks/useBackup.ts`](../src/hooks/useBackup.ts) | Export, import and the visible error | Touch the input's DOM |
| [`components/tasks/`](../src/components/tasks/) · [`shell/`](../src/components/shell/) | Presentation and interaction | Hold domain state |
| [`components/ui/`](../src/components/ui/) | shadcn primitives | Know the domain (`Task`) |
| [`types/`](../src/types/) | One domain type per file, with a barrel | Props types for a single component |

**The rule that pays off most: anything that can be written as a pure function goes to
`lib/`.** It is what makes the daily reset, the streaks and the progress clamp testable
without mounting React or faking the passage of time. What needs React but no JSX — a
form draft, the export/import cycle — goes in a hook, not inside the component.

Props types are declared **next to the component that uses them**, not in `types/`.

### Local state that is allowed

A component may keep its own `useState` for **ephemeral UI state**: whether it is in edit
mode, whether the options panel or the other-days section are expanded. That state dies
with the component and is never persisted. Form fields are no longer component state:
they live in `useTaskForm`, shared by create and edit.

### Daily reset

`applyDailyReset(state, today)` is pure and returns **the same object** when the day has
not changed, to avoid extra renders. When it has:

1. Archives the ids of the completed tasks into `history[lastResetDate]`.
2. Sets `progress: 0` on every task.
3. Updates `lastResetDate` and prunes the history.

It is checked at three moments, to cover both the active tab and one that sat hours in the
background: on mount, every 30 seconds, and on `focus` / `visibilitychange`.

---

## 4. Persistence

- Key: `daily-task-manager:v2`.
- **Defensive, sanitized reads.** `loadState` never throws: faced with corrupt JSON,
  wrongly typed fields or out-of-range values, it returns what is recoverable and drops
  the rest. A broken `localStorage` cannot take the app down.
- **Fault-tolerant writes.** If `localStorage` is full or disabled, the session carries on
  in memory instead of breaking.
- **Missing `repeats`.** Anything stored before one-off tasks existed was a habit, so a
  missing or non-boolean `repeats` sanitizes to `true`.
- **v1 → v2 migration.** The v1 format stored `done: boolean` and had no targets, days or
  history. `sanitizeState` recognises it and converts it (`target: 1`,
  `progress: done ? 1 : 0`, `weekdays: []`). The migration lives in the sanitizing itself,
  so it serves loading and importing an old backup alike.
- **Bounded history.** 180 days are kept (`HISTORY_DAYS`); further back adds nothing and
  bloats storage.
- **Versioning.** If the shape of `TasksState` changes incompatibly, bump the key suffix
  and add the case to the sanitizer. Never change the meaning of a field while keeping the
  same key.

---

## 5. Features

### 5.1 Repetition counter

A task can demand several repetitions a day: "drink 8 glasses of water".

- It is set **when creating the task**, in the *Repetitions per day* field, and can be
  changed when editing it. The title is never parsed: it is an explicit field.
- **One gesture for the whole cycle.** `advanceProgress` adds one repetition and, once the
  target is met, the next advance resets to zero. With `target: 1` that is exactly ticking
  and unticking a checkbox, so the action is the same for both cases.
- A `−` button lets someone correct one advance too many; it only shows with `target > 1`
  and `progress > 0`. Clicking seven more times to undo one would be hostile.
- **UI:** with `target: 1`, a checkbox. With `target > 1`, a `3/8` pill that fills
  proportionally. The "8 little dots" idea was dropped because it does not scale to
  `target: 30`.

### 5.2 Weekdays

Each task can be limited to certain days: "gym on Monday, Wednesday and Friday".

- `weekdays: []` means every day. The picker shows all seven marked in that case and
  normalizes back to `[]` when the user activates them all.
- Tasks not due today **do not appear in the main list**. They are grouped into a
  collapsible "N tasks from other days" section, where they show dimmed and without the
  progress control, but stay editable, reorderable and deletable.
- A day the task was not due **does not break the streak**: it is skipped.

### 5.3 Manual order

- The order of `tasks` is the visible order. A daily routine has a natural order that
  insertion order does not capture.
- The hook's action is `swapTasks(id, otherId)`, **by id and not by position**. The caller
  knows the list being looked at, which may hide tasks that are not due today; with global
  indices, moving a task up could produce no visible change at all.
- Reordering is **drag & drop on the native HTML5 API**, no library: `@dnd-kit` and its
  kind are large dependencies for what `draggable` + four events already do. The list
  holds which task is being dragged and which one it is over; the drop calls the same
  `swapTasks(id, otherId)`, so the domain does not know drag exists.
- The grip is a real button, and with it focused **ArrowUp / ArrowDown move the task**:
  native dragging leaves out the keyboard, so the buttons live on inside the handle.
- **Known limitation:** HTML5 dragging does not fire on touch, so on a phone the order can
  only be changed with a keyboard.

### 5.4 Undo deletion

- Deleting asks for no confirmation, but for **6 seconds** a notice appears with *Undo*,
  which puts the task back **in its original position**, not at the end.
- It beats a confirmation dialog: it does not interrupt the normal case (really deleting)
  and it protects the rare one (deleting by mistake).
- The timer is cancelled when another task is deleted, on undo, on dismissing the notice
  and on unmount.

### 5.5 Export and import

- The data lives only in this browser: if the user clears the site data, it is gone. The
  manual backup is the only safety net.
- Exports `{ version, exportedAt, data }` to `tasks-YYYY-MM-DD.json`.
- Importing **replaces** the whole state and goes through the same sanitizing as loading,
  so a tampered file cannot inject invalid data. Errors show as text, never in an `alert`.
- It accepts both the wrapper with `version` and a bare `TasksState`, and the v1 format
  too.

### 5.6 Streaks

- **Per task:** consecutive days meeting it, counting back from today. Days it was not due
  are skipped without breaking it, and **an unfinished current day does not break it
  either**: there is still time. It shows next to the title from 1 day up.
- **Global:** consecutive days completing *every* task that was due. It shows in the
  header.
- **A known and accepted approximation:** for past days, the global streak is rebuilt from
  the tasks that exist today, filtered by `createdAt`. A deleted task stops counting
  backwards. Storing the set of scheduled tasks for each day would multiply the size of
  the history for marginal benefit.

### 5.7 Theme

- **Dark only.** There is no switch, no light palette and nothing persisted about the
  theme. [`index.css`](../src/index.css) declares a single palette on `:root`.
- The `dark` class stays hardcoded on `<html>` for one reason: the shadcn primitives ship
  `dark:` variants that hang off the `@custom-variant dark (&:is(.dark *))` selector. It
  is not a switch and nothing toggles it.

### 5.8 PWA and installation

- `public/manifest.webmanifest` makes it installable; `public/sw.js` provides offline use.
- **Service worker strategy:** Vite's assets are hashed, so for them the cache never goes
  stale and is served first. Navigation goes to the network first, with the cached copy as
  the fallback, so new deploys get picked up.
- It only registers in production: in development it would serve cached builds and be
  confusing.
- **Known limitation:** the manifest icons are the `favicon.svg`. Android's maskable icon
  would want a 512×512 PNG.

---

## 6. Code conventions

### Language

**English, everywhere**: variable, function, type, file and branch names, and equally the
UI copy, comments, documentation and commit messages.

### Naming

| Element | Convention | Example |
|---|---|---|
| Own component | `PascalCase.tsx` | `TaskItem.tsx` |
| shadcn component | `kebab-case.tsx` in `ui/` | `button.tsx` |
| Hook | `useSomething.ts`, named export | `useTasks.ts` |
| Utility | `camelCase.ts` in `lib/` | `date.ts` |
| Test | in `tests/`, same path as the source | `tests/lib/tasks.test.ts` |
| Type | `PascalCase.ts`, one per file in `types/` | `Task.ts`, `TasksState.ts` |
| Props | `type <Component>Props` | `TaskItemProps` |
| Callback prop | `on<Event>` | `onAdd`, `onAdvance` |
| DOM event handler | `handle<Event>` | `handleSubmit`, `handleKeyDown` |
| Domain action | imperative verb | `save`, `cancel`, `startEditing` |
| Boolean | `is` / `has` prefix or a participle | `isEditing`, `done`, `dimmed` |
| Module constant | `SCREAMING_SNAKE_CASE` | `STORAGE_KEY`, `HISTORY_DAYS` |

Details worth the judgement:

- **`remove`, not `delete`** (`delete` is a reserved word and `removeTask` reads better).
- Names say **what the value represents**, not its type: `completed`, not `completedNum`.
- Domain verbs are precise: `advance` (move the counter on) is not `toggle`, `swap`
  (exchange two) is not `move`.
- Avoid abbreviations except the universal ones (`id`, `props`, `ref`).

### Style

- Single quotes, no semicolons, trailing commas, 2-space indentation.
- Line width around 80 characters for code; long Tailwind class strings stay on a single
  line (they are not broken up).
- Import order: externals → blank line → internals with `@/`.
- **Always the `@/` alias**, never `../`.
- `import type { X } from '...'` in its own statement — `verbatimModuleSyntax` requires it.
- `type` instead of `interface`.
- Named `export function Component()`. Only `App` uses `export default`.

> **Exception: `src/components/ui/`.** It is shadcn-generated code (double quotes,
> `export { X }` at the end of the file). It is left exactly as the generator produces it
> so that `shadcn add` and updates do not produce style diffs. Do not reformat it.

### Comments

Comment the **why**, never the what. The comments that exist explain decisions: why `done`
is derived, why `swapTasks` works with ids, why the object URL is revoked inside a
`setTimeout`. That is the bar.

Always single-line (`//`), never `/** */` blocks, and at most two lines in a row. A
comment that needs a paragraph is covering for code that should be simplified.

---

## 7. UI and styles

- **Tailwind only**, with no bespoke CSS outside [`src/index.css`](../src/index.css).
- **Semantic tokens always**: `bg-card`, `text-muted-foreground`, `border-border`. Never
  `bg-neutral-800` or literal colours — they bypass the palette.
- Conditional classes through `cn()` ([`lib/utils.ts`](../src/lib/utils.ts)), which
  resolves conflicts via `tailwind-merge`.
- shadcn components from the `components.json` registry (`base-nova` style, `neutral`
  base, `tabler` icons). Add them with `npx shadcn add` rather than writing them by hand.
- Icons: **`@tabler/icons-react` only**. Do not mix icon libraries.
- Icons inside `Button` carry no size class: the variant already handles it.

### Accessibility — requirements, not suggestions

- Every control without visible text carries a descriptive `aria-label`, **including the
  task title** when several identical controls are on screen (`Move "Drink water" up`).
- The progress control announces the full state: `Drink water: 3 of 8. Add one`.
- Every clickable element shows `cursor-pointer`. `<button>` and `[role="button"]` already
  get it from a base rule in [`index.css`](../src/index.css), so **there is no need to
  repeat it** when using `Button` or `Checkbox`; it does have to be added by hand on any
  other element made clickable, such as the task title.
- Controls are reachable and operable by keyboard. Enter saves, Escape cancels.
- Buttons that appear on hover use `focus-within:opacity-100`, so they also appear when
  tabbing.
- The undo notice is `role="status"` with `aria-live="polite"`.
- No `div` with an `onClick` where a `button` belongs.
- Visible focus (`focus-visible:ring`) is never removed.

---

## 8. Tests

`npm test` (Vitest + Testing Library, jsdom environment).

**What is tested and what is not.** The goal is not coverage, it is armouring the logic
that is not obvious on reading:

| Covered | Why |
|---|---|
| `advanceProgress`, `normalizeTarget` | The counter cycle and the clamp are the heart of the model |
| `applyDailyReset` | Archives history and resets; hard to test by hand |
| `computeStreak` | Subtle rules: skipped days, the current day, the creation date |
| `sanitizeState` | v1 → v2 migration and defence against corrupt data |
| `parseBackup` | External input: the least trustworthy surface there is |
| `toggleWeekday` | Empty and all seven days mean the same; the normalization is subtle |
| `useTasks` | That the invariants hold when actions are chained |

Presentation components are not tested: their value is in how they look, and a render test
would only repeat the JSX.

Tests live in **`tests/`, mirroring the path of the file they cover**
(`src/lib/tasks.ts` → `tests/lib/tasks.test.ts`). `tsconfig.app.json` includes them, so
`npm run typecheck` checks them too; what runs them is Vitest.

---

## 9. Clean-code criteria

Review checklist before calling a change closed:

**Design**
- [ ] Can the new logic be written as a pure function in `lib/`? Then that is where it goes.
- [ ] Is the domain state in `useTasks` and not leaking into a component?
- [ ] Does the component do one thing? Past roughly 150 lines, probably not.
- [ ] Can it be solved with less code or less abstraction?

**Correctness**
- [ ] Are state updates immutable and using the functional form?
- [ ] Are the functions a hook exposes wrapped in `useCallback`?
- [ ] Do the `useEffect`s clean up their listeners, intervals and timers?
- [ ] Do lists use `key={task.id}`, never the index?
- [ ] Is user input validated in the hook, not in the view?
- [ ] Does the change respect the invariants in section 2? Is there a test proving it?

**Robustness**
- [ ] What happens with a corrupt, full or disabled `localStorage`?
- [ ] Is there a designed empty state, not a blank screen?
- [ ] Does long or unbroken text wrap without breaking the layout?

**Hygiene**
- [ ] `npm run check` passes.
- [ ] No `console.log`, commented-out code or unused imports.
- [ ] No `any` and no `@ts-ignore`.
- [ ] Names follow the table in section 6.

### Concrete antipatterns

| Avoid | Do |
|---|---|
| Storing a value that can be derived | `isTaskDone(task)` instead of a `done` field |
| `useEffect` to derive values | Compute during render |
| Actions that take array indices | Take them by `id`, which is stable |
| Passing the whole `Task` object to a callback | Pass the `id` |
| `index` as `key` | `task.id` |
| Mutating with `state.tasks.push(...)` | `[...prev.tasks, task]` |
| Domain logic inside a component | A pure function in `lib/tasks.ts` |
| A `ui/` component importing `Task` | Keep `ui/` agnostic of the domain |
| A `useTaskFilters`, `useTaskSort`… hook per feature | A single `useTasks` while it fits |
| `alert()` for errors | Text with `role="alert"` next to the action |

---

## 10. Git

- Branches: `feat/…`, `fix/…`, `refactor/…`, `docs/…`.
- Commits follow Conventional Commits, like the current history:
  `refactor: replace lucide icons with tabler icons`. One commit, one coherent change.
- `dist/`, `node_modules/` and the lockfiles are ignored by project decision.

---

## 11. Current state and pending work

**Implemented**: everything described in section 5, plus the CRUD, the daily reset, the
empty state and local persistence.

**Pending**:

| Task | Note |
|---|---|
| 512×512 PNG icon for the manifest | The custom SVG is in place; Android will not take it as `maskable` and wants the PNG |
| Prettier | It would formalize the style in section 6; `src/components/ui/` has to be excluded |

The oxlint warning in [`button.tsx`](../src/components/ui/button.tsx)
(`only-export-components`, for exporting `buttonVariants`) is the standard shadcn pattern
and is accepted as such.
