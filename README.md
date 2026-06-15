# Task Manager

A **dark-mode** task manager organized by **boards** (topics), with a **Kanban** workflow (drag & drop, reorder within columns), recurring **routines**, and a **statistics** dashboard with charts. Everything is stored locally in your browser (`localStorage`) — no server needed.

## Stack

- ⚛️ React 18 + TypeScript
- ⚡ Vite 6
- 🎨 Tailwind CSS v4 (dark theme)
- 📊 Recharts v3 (charts, lazy-loaded)
- 🔣 lucide-react (icons)

## Features

- **Boards by topic**: create boards with their own color (Work, Personal, Learning…), each holding its tasks.
- **Kanban with drag & drop**: drag tasks between the *To do / In progress / Done* columns to change their status, and reorder them within a column.
- **Tasks**: title, description, priority (high/medium/low), status and due date (with an overdue badge).
- **Recurring routines**: daily, weekly or monthly habits with **streak** tracking 🔥 and completion counts.
- **Statistics dashboard**: KPI cards with month-over-month deltas, a created-vs-completed combo chart, a completion-rate gauge, a tasks-by-board donut, and a done-vs-pending comparison.
- **Polished UX**: dark theme, smooth animations/transitions, custom confirmation dialogs, AA-level text contrast, and `prefers-reduced-motion` support.
- **Local persistence**: your data is saved in the browser.

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the build
```

## Structure

```
src/
├── components/   UI (BoardsView, BoardDetail/Kanban, RoutinesView, StatsView, forms, Modal…)
├── context/      AppContext (state + persistence) and ConfirmProvider (custom dialogs)
├── lib/          utilities (ids, dates) and routine logic (periods/streaks)
├── types.ts      data model and color/status/priority/frequency metadata
└── App.tsx       layout and navigation (Boards / Routines / Statistics)
```

> On a fresh start, sample data is loaded (storage key `taskmanager.v2`). Bumping that key resets to the seed data.
