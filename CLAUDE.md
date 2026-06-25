# Task Manager

Client-side task manager (React 19 + Vite 8 + TypeScript + Tailwind v4 + Zustand).
State is persisted to `localStorage`; there is no backend. Cyberpunk/red theme.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — `tsc --noEmit` (type-check only; the de-facto test gate)
- `npm run preview` — preview the production build

Always run `npm run lint` (or `npm run build`) after changes — there is no test
suite, so the type-checker is the safety net.

## Architecture: feature-based, flat top-level buckets

`app/` holds only the app entry/structure. Everything else is either a **feature**
(`features/<x>/`, owning its own UI + logic + store + types) or a flat
top-level **bucket** grouping one kind of cross-cutting thing (`components/`,
`hooks/`, `store/`, `types/`, `lib/`, `config/`, `consts/`).

```
src/
├── app/                  # only general/structure — nothing else lives here
│   ├── layout.tsx        # entry point — referenced by index.html
│   └── page.tsx          # picks the active tab and renders the feature
├── features/
│   ├── task-groups/
│   │   ├── components/    # UI only (JSX)
│   │   ├── hooks/         # logic — one hook per component (use-*.ts)
│   │   ├── store/         # the feature's own zustand store (groups-store.ts)
│   │   └── types/types.ts
│   └── dailies/           # same shape (dailies-store.ts)
├── components/            # shared + shell UI: header, nav-*, brand
├── store/                 # app-wide UI state only (tab-store)
├── types/                 # global types: tab
├── lib/                   # utils (cn, uid, dayKey), motion presets
├── config/                # app.config.ts (brand, theme tokens)
├── consts/                # tabs.ts
└── styles/                # globals.css (Tailwind + @theme design tokens)
```

### Where does code go?

- **Used by one feature** → `features/<feature>/`
- **Used by several features / app-wide** → the matching top-level bucket
  (`components/`, `store/`, `types/`, `lib/`, …).
- `app/` stays minimal: just `layout.tsx` + `page.tsx`.
- No barrel files (`index.ts`) — import the concrete module directly,
  e.g. `@/src/features/task-groups/components/task-groups`.
- Absolute imports only, via the `@/*` alias → `@/src/...`.

### Separation of concerns (UI vs logic)

Components are **UI only**. All state, handlers and derived values live in a
co-located hook. Pattern: `components/x.tsx` ↔ `hooks/use-x.ts`. When adding a
component with non-trivial logic, extract a `use-*` hook for it.

### State management (Zustand)

- **Each feature owns its own store** under `features/<x>/store/`. The two are
  independent, persisted separately, and don't interact:
  - `task-groups/store/groups-store.ts` → `useGroupsStore` (key `taskmanager.groups.v1`)
  - `dailies/store/dailies-store.ts` → `useDailiesStore` (key `taskmanager.dailies.v1`)
  Each defines its store interface inline, holds its seed data, and only its own
  feature's hooks consume it. There is no central data store.
- App-wide UI state lives in the top-level bucket: `store/tab-store.ts` (active tab).
- There is **no modal/dialog system** right now. Confirmations and the
  group create/edit flow use native `window.confirm` / `window.prompt`
  (see the `use-*` hooks). Marked with `TODO` to revisit if a modal returns.

## Conventions

- Files are kebab-case (`group-detail.tsx`, `use-task-groups.ts`).
- Styling is Tailwind utility classes; colors are **semantic design tokens**
  defined in `src/styles/globals.css` (`@theme` block) — reskin there, not inline.
  Accent is the cyberpunk red.
- Animations use shared Framer Motion presets from `lib/motion.ts`
  (`fadeIn`, `fadeInUp`, `scaleIn`, `slideDown`).
- Every clickable element gets `cursor-pointer`.
