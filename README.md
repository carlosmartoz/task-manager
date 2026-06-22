# NetRunner · Task Manager

A focused task manager with a **Cyberpunk 2077** dark aesthetic. Organize tasks
into colored **groups** (one per topic), and keep a separate list of **daily
tasks** whose checkmarks reset automatically every day. Everything is stored in
the browser via `localStorage`.

## Features

- **Groups** — create colored groups by topic; inside each, a simple task list
  with create, edit (double-click or pencil) and delete, plus a done checkbox.
- **Daily** — an input + list of daily tasks; the check clears on its own each
  day (no streaks, no history).
- **Cyberpunk theme** — neon yellow on near-black, angular "tech panel" cards,
  fixed dark mode.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (semantic design tokens in `src/styles/globals.css`)
- Zustand (state + `localStorage` persistence)
- framer-motion (animations) · lucide-react (icons)

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the build
npm run lint     # type-check (tsc --noEmit)
```

## Structure

```
src/
├── app/          layout, page shell and navigation
├── components/   UI (groups, daily, task item, modal, dialogs)
├── constants/    group color palette + tabs
├── store/        Zustand stores (app data + active tab)
├── lib/          utilities + motion variants
├── types/        data model
├── config/       app config (brand, theme reference)
└── styles/       globals.css (Cyberpunk design tokens)
```

## Pending Tasks

Better animations
Better circle for completing tasks
Change the modal
Change the favicon
Dropdown close and animations on hover in the cards
