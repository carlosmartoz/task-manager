# Task Manager

App de **hábitos diarios**: las tareas se conservan de un día para otro y al cambiar el
día se archiva lo cumplido y el progreso vuelve a cero. Una tarea puede exigir varias
repeticiones (`target`) y limitarse a ciertos días de la semana. Local, sin backend.

Specs completas: [docs/SPECS.md](docs/SPECS.md). Este archivo es el resumen operativo.

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm test         # vitest run
```

Antes de dar por terminado un cambio, los tres deben pasar.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind 4 · shadcn sobre Base UI (`@base-ui/react`) ·
iconos Tabler · Vitest. PWA con manifest y service worker escritos a mano.

## Modelo

```ts
type Task = { id, title, target, progress, weekdays, createdAt }
const isTaskDone = (task) => task.progress >= task.target
```

**`done` es derivado, nunca un campo.** Una tarea normal es `target: 1`; el checkbox es el
caso degenerado del contador. No introduzcas dos tipos de tarea.

## Reglas duras

- **No añadir dependencias** sin justificarlo antes. Nada de router, state manager,
  librerías de fechas, drag & drop ni backend: el proyecto es deliberadamente minimalista.
- **Idioma**: identificadores y nombres de archivo en inglés; texto de UI, comentarios y
  documentación en español.
- **Lógica de dominio pura → [`lib/tasks.ts`](src/lib/tasks.ts)**, no dentro de
  componentes ni del hook. Es lo que la hace testeable.
- **Estado**: todo el estado de tareas vive en [`useTasks`](src/hooks/useTasks.ts). Los
  componentes son presentacionales y reciben datos y callbacks por props.
- **Las acciones reciben `id`, nunca índices de array.**
- **`src/components/ui/`** es código generado por shadcn. No reformatearlo ni adaptarlo al
  estilo del resto del proyecto; modificarlo solo para cambios de diseño intencionados.
- **Todo control sin texto visible lleva `aria-label`** con el título de la tarea cuando
  se repite en la lista (`Subir "Beber agua"`).
- **`cursor-pointer`**: los `<button>` ya lo reciben de una regla base en
  [`index.css`](src/index.css). Ponlo a mano solo en otros elementos que hagas clicables.
- **Datos externos siempre saneados** al entrar (`sanitizeState`): `localStorage` y los
  archivos importados no son de fiar.

## Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componente propio | `PascalCase.tsx` en `src/components/` | `TaskItem.tsx` |
| Componente shadcn | `kebab-case.tsx` en `src/components/ui/` | `button.tsx` |
| Hook | `useAlgo.ts` en `src/hooks/` | `useTasks.ts` |
| Utilidad | `camelCase.ts` en `src/lib/` | `date.ts` |
| Test | junto al archivo que prueba | `tasks.test.ts` |
| Tipo de dominio | `PascalCase` en `src/types/` | `Task` |
| Props | `type <Componente>Props` en el propio archivo | `TaskItemProps` |
| Prop de callback | `on<Evento>` | `onAdvance`, `onSwap` |
| Handler interno | `handle<Evento>` o verbo simple | `handleSubmit`, `save` |

Usa `remove`, no `delete`. Verbos precisos: `advance` no es `toggle`, `swap` no es `move`.
Booleanos con prefijo (`isEditing`, `dimmed`).

## Estilo de código

- Comillas simples, sin punto y coma, coma final, 2 espacios.
- Imports: primero React/externos, línea en blanco, luego `@/...`. Siempre alias `@/`,
  nunca rutas relativas hacia arriba (`../`).
- `import type { X }` separado para tipos (`verbatimModuleSyntax` está activo).
- `type`, no `interface`.
- `export function Componente()` nombrado; solo `App` usa export default.
- Comenta el **porqué**, no el qué.
- Tailwind con tokens semánticos (`text-muted-foreground`, `bg-card`), nunca colores
  literales. Clases condicionales con `cn()`.
