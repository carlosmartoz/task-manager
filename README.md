# Task Manager

A list of **daily habits**. Tasks are not deleted when you complete them: they carry over
from one day to the next and, when the day changes, what you met is archived and progress
returns to zero.

It runs entirely in the browser. No accounts, no server, no network. The data lives in
`localStorage` and the backup is a JSON file you export and import yourself.

## What it does

- **Repetition targets.** A task can ask for several advances: *drink 8 glasses of water*.
  Each click adds one; once the target is met, the next one resets it. A plain task is
  just the target-1 case, a checkbox.
- **Weekdays.** *Gym on Monday, Wednesday and Friday*. Whatever is not due today is set
  aside in a collapsible section.
- **Streaks.** Consecutive days meeting each task, plus a global streak of perfect days.
  Days a task was not due never break it.
- **Manual order, undo and backup.** The list keeps your order, deleting leaves 6 seconds
  to bring the task back, and everything exports to JSON.
- **Dark theme only**, and installable as a PWA with offline support.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # lint, types and tests: what has to pass before a commit
```

## Layout

```
src/
  components/   ui/ is shadcn; tasks/ and shell/ are ours and only render
  hooks/        state and forms
  lib/          the domain logic, pure and free of React
  types/        one type per file, re-exported from index.ts
tests/          mirrors the src/ tree
```

The rule that orders everything else: **logic lives in `lib/`, state in `hooks/`, and
components only receive data and callbacks**. If something can be tested without mounting
a component, it belongs in `lib/`.

`done` is not a field: it derives from `progress >= target`. There is no second kind of
task.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind 4 · shadcn on Base UI · Tabler icons ·
Vitest. The manifest and the service worker are hand written, with no PWA plugin.

Code conventions are in [CLAUDE.md](CLAUDE.md), and the design decisions, with their
reasoning, in [docs/SPECS.md](docs/SPECS.md).
