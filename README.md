# Task Manager

Task manager organized by **boards** (topics), with a **Kanban** workflow (drag & drop, reorder within columns), recurring **routines**, and a **statistics** dashboard with charts.

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS v4 (dark theme)
- Recharts v3 (charts, lazy-loaded)
- lucide-react (icons)

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
├── components/   UI
├── context/      AppContext
├── lib/          utilities
├── types.ts      data model
└── App.tsx       layout and navigation
```
