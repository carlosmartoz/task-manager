# Especificaciones — Task Manager

> Documento de referencia del proyecto: qué construimos, qué no, y cómo escribimos el código.
> El resumen operativo para el día a día está en [CLAUDE.md](../CLAUDE.md).

---

## 1. Objetivo

Una aplicación de **hábitos diarios** para una sola persona.

A diferencia de una lista de tareas clásica, aquí las tareas **no se borran al
completarse**: representan rutinas. Al cambiar el día vuelven a estado pendiente, se
archiva lo cumplido y la lista se reutiliza.

**Principios que ordenan cualquier decisión:**

1. **Simplicidad por encima de completitud.** Ante la duda, la opción con menos código.
2. **Cero fricción.** Abrir la app y añadir una tarea debe costar un gesto. Sin login,
   sin configuración, sin pantalla de carga.
3. **Funciona sin red.** Los datos son del usuario y viven en su navegador.
4. **Accesible por defecto.** Teclado y lector de pantalla son requisitos, no extras.
5. **Nada se pierde por accidente.** Todo borrado se puede deshacer y todo el estado se
   puede exportar.

### Alcance

| Dentro | Fuera |
|---|---|
| CRUD de tareas | Autenticación / cuentas |
| Metas por repeticiones (`target`) | Backend, API, sincronización |
| Días de la semana por tarea | Múltiples listas o proyectos |
| Orden manual de la lista | Etiquetas, prioridades, subtareas |
| Rachas por tarea y globales | Notificaciones, recordatorios |
| Reset diario automático | Estadísticas o gráficas de progreso |
| Deshacer eliminación | Adjuntos, notas largas |
| Exportar / importar JSON | Colaboración |
| Tema claro / oscuro / sistema | |
| Instalable y offline (PWA) | |

Lo que está "fuera" no está prohibido para siempre, pero añadirlo exige una conversación
previa: cada una de esas funciones rompe alguno de los cinco principios.

### Restricciones técnicas derivadas

- **Sin router.** Es una sola pantalla.
- **Sin gestor de estado externo.** `useState` más un hook propio es suficiente y lo
  seguirá siendo mientras el alcance no cambie.
- **Sin librería de fechas.** `Intl` y la API nativa `Date` cubren el caso de uso.
- **Sin plugin de PWA.** El manifest y el service worker están escritos a mano
  (~60 líneas) porque el caso es simple y una dependencia de build no se justifica.
- **Sin dependencias nuevas** sin justificación explícita.

---

## 2. Modelo de dominio

```ts
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0 = domingo, igual que Date.getDay()
type DayKey = string                       // 'YYYY-MM-DD' en hora local

type Task = {
  id: string
  title: string
  target: number     // 1..99 repeticiones necesarias. 1 = tarea simple
  progress: number   // 0..target repeticiones acumuladas hoy
  weekdays: Weekday[] // vacío = todos los días
  createdAt: number
}

type TasksState = {
  tasks: Task[]                      // el orden del array es el orden visible
  lastResetDate: DayKey
  history: Record<DayKey, string[]>  // día → ids completados ese día
}
```

### `done` es derivado, no almacenado

```ts
const isTaskDone = (task: Task) => task.progress >= task.target
```

Es la decisión central del modelo. Guardar `done` **y** `progress` como campos separados
permitiría el estado imposible «completada con 3 de 8», y obligaría a sincronizarlos en
cada acción. Derivándolo, ese bug no puede escribirse.

Su consecuencia útil: **una tarea normal es simplemente `target: 1`**. No hay dos tipos de
tarea ni ramas condicionales repartidas por los componentes; el checkbox es el caso
degenerado del contador.

### Invariantes

Se garantizan en el hook y en `lib/`, nunca en los componentes:

- `title` no está vacío ni tiene espacios sobrantes. Añadir o editar en blanco es un
  no-op silencioso.
- `target` es un entero entre 1 y 99. Cualquier entrada se normaliza con `normalizeTarget`.
- `progress` está entre 0 y `target`. **Bajar `target` recorta `progress`**; es el caso
  límite que se olvida.
- `weekdays` no tiene duplicados, está ordenado y solo contiene 0..6. La lista vacía
  significa «todos los días» y nunca se permite dejar cero días marcados desde la UI:
  sería indistinguible de «todos».
- `id` es único y estable durante toda la vida de la tarea.

---

## 3. Arquitectura

```
main.tsx  ── registra el service worker en producción
└── App.tsx ────────── useTasks()  ← única fuente de verdad
    │                  useTheme()  ← claro / oscuro / sistema
    ├── TaskInput ──── WeekdayPicker
    ├── TaskList ───── TaskItem ─── TaskProgress
    │                            └─ WeekdayPicker
    ├── ThemeToggle
    ├── DataActions   (exportar / importar)
    └── UndoToast
```

**Flujo de datos unidireccional.** `useTasks` posee el estado; los componentes reciben
datos por props y comunican intenciones mediante callbacks. Ningún componente lee o
escribe `localStorage` directamente.

### Responsabilidades

| Módulo | Responsabilidad | No debe |
|---|---|---|
| [`lib/date.ts`](../src/lib/date.ts) | Claves de día, formato, días de la semana | Conocer nada sobre tareas |
| [`lib/tasks.ts`](../src/lib/tasks.ts) | Lógica de dominio **pura**: progreso, reset, rachas, orden | Tocar `localStorage` ni React |
| [`lib/storage.ts`](../src/lib/storage.ts) | Serializar, validar, migrar, respaldar | Contener reglas de negocio |
| [`hooks/useTasks.ts`](../src/hooks/useTasks.ts) | Estado, invariantes, persistencia, deshacer | Contener JSX o clases de estilo |
| [`hooks/useTheme.ts`](../src/hooks/useTheme.ts) | Tema y su persistencia | Conocer las tareas |
| [`components/`](../src/components/) | Presentación e interacción | Guardar estado de dominio |
| [`components/ui/`](../src/components/ui/) | Primitivas shadcn | Conocer el dominio (`Task`) |
| [`types/task.ts`](../src/types/task.ts) | Tipos y constantes de dominio | Tipos de props de un solo componente |

**La regla que más rendimiento da: todo lo que se pueda escribir como función pura va a
`lib/tasks.ts`.** Es lo que hace que el reset diario, las rachas y el clamp del progreso
sean testeables sin montar React ni simular el paso del tiempo.

Los tipos de props se declaran **junto al componente que los usa**, no en `types/`.

### Estado local permitido

Un componente puede tener `useState` propio para estado **efímero de UI**: el borrador de
edición en `TaskItem`, los campos de `TaskInput`, si la sección de otros días está
desplegada. Ese estado muere con el componente y nunca se persiste.

### Reset diario

`applyDailyReset(state, today)` es pura y devuelve **el mismo objeto** si no ha cambiado el
día, para no provocar renderizados de más. Cuando sí cambia:

1. Archiva en `history[lastResetDate]` los ids de las tareas completadas.
2. Pone `progress: 0` en todas las tareas.
3. Actualiza `lastResetDate` y poda el historial.

Se comprueba en tres momentos, para cubrir tanto la pestaña activa como la que estuvo
horas en segundo plano: al montar, cada 30 segundos, y en `focus` / `visibilitychange`.

---

## 4. Persistencia

- Clave: `daily-task-manager:v2`. El tema va aparte, en `daily-task-manager:theme`.
- **Lectura defensiva y saneada.** `loadState` nunca lanza: ante JSON corrupto, campos con
  el tipo equivocado o valores fuera de rango, devuelve lo recuperable y descarta el resto.
  Un `localStorage` roto no puede tumbar la app.
- **Escritura tolerante a fallos.** Si `localStorage` está lleno o deshabilitado, la
  sesión sigue funcionando en memoria en lugar de romperse.
- **Migración v1 → v2.** El formato v1 guardaba `done: boolean` y no tenía metas, días ni
  historial. `sanitizeState` lo reconoce y lo convierte
  (`target: 1`, `progress: done ? 1 : 0`, `weekdays: []`). La migración vive en el propio
  saneado, así que sirve igual al cargar que al importar un respaldo antiguo.
- **Historial acotado.** Se conservan 180 días (`HISTORY_DAYS`); más atrás no aporta y
  engorda el almacenamiento.
- **Versionado.** Si la forma de `TasksState` cambia de manera incompatible, sube el
  sufijo de la clave y añade el caso al saneado. Nunca cambies el significado de un campo
  manteniendo la misma clave.

---

## 5. Funcionalidades

### 5.1 Contador de repeticiones

Una tarea puede exigir varias repeticiones al día: «beber 8 vasos de agua».

- Se configura **al crear la tarea**, en el campo *Repeticiones al día*, y se puede
  cambiar al editarla. No hay interpretación del título: es un campo explícito.
- **Un solo gesto para todo el ciclo.** `advanceProgress` suma una repetición y, una vez
  alcanzada la meta, el siguiente avance vuelve a cero. Con `target: 1` eso es exactamente
  marcar y desmarcar un checkbox, así que la acción es la misma para ambos casos.
- Un botón `−` permite corregir un avance de más; solo aparece con `target > 1` y
  `progress > 0`. Volver a dar siete clics para deshacer uno sería hostil.
- **UI:** con `target: 1`, checkbox. Con `target > 1`, una píldora `3/8` que se rellena
  proporcionalmente. Se descartaron los «8 puntitos» porque no escalan a `target: 30`.

### 5.2 Días de la semana

Cada tarea puede limitarse a ciertos días: «gimnasio los lunes, miércoles y viernes».

- `weekdays: []` significa todos los días. El selector muestra los siete marcados en ese
  caso y normaliza de vuelta a `[]` cuando el usuario los activa todos.
- Las tareas que no tocan hoy **no aparecen en la lista principal**. Se agrupan en una
  sección plegable «N tareas de otros días», donde se muestran apagadas y sin control de
  progreso, pero siguen siendo editables, reordenables y eliminables.
- Un día en que no tocaba **no rompe la racha**: se salta.

### 5.3 Orden manual

- El orden de `tasks` es el orden visible. Una rutina diaria tiene un orden natural que el
  orden de inserción no captura.
- La acción del hook es `swapTasks(id, otherId)`, **por id y no por posición**. Quien
  llama conoce la lista que se está viendo, que puede tener tareas ocultas por no tocar
  hoy; con índices globales, subir una tarea podría no producir ningún cambio visible.
- Se descartó el drag & drop: `@dnd-kit` es una dependencia grande y el arrastre es peor
  para teclado y lector de pantalla que dos botones.

### 5.4 Deshacer eliminación

- Eliminar no pide confirmación, pero durante **6 segundos** aparece un aviso con
  *Deshacer* que devuelve la tarea **a su posición original**, no al final.
- Es preferible a un diálogo de confirmación: no interrumpe el caso normal (borrar de
  verdad) y protege el caso raro (borrar sin querer).
- El temporizador se cancela al eliminar otra tarea, al deshacer, al descartar el aviso y
  al desmontar.

### 5.5 Exportar e importar

- Los datos solo viven en este navegador: si el usuario limpia los datos del sitio, los
  pierde. El respaldo manual es la única red de seguridad.
- Exporta `{ version, exportedAt, data }` a `tareas-YYYY-MM-DD.json`.
- La importación **reemplaza** el estado completo y pasa por el mismo saneado que la
  carga, así que un archivo manipulado no puede meter datos inválidos. Los errores se
  muestran en texto, nunca en un `alert`.
- Acepta tanto el envoltorio con `version` como un `TasksState` desnudo, y también el
  formato v1.

### 5.6 Rachas

- **Por tarea:** días consecutivos cumpliéndola hacia atrás desde hoy. Los días en que no
  tocaba se saltan sin romperla, y **el día en curso sin completar tampoco la rompe**:
  todavía hay tiempo. Se muestra junto al título a partir de 1 día.
- **Global:** días consecutivos completando *todas* las tareas que tocaban. Se muestra en
  la cabecera.
- **Aproximación conocida y aceptada:** para los días pasados, la racha global se
  reconstruye con las tareas que existen hoy, filtrando por `createdAt`. Una tarea
  eliminada deja de contar hacia atrás. Guardar el conjunto de tareas programadas de cada
  día multiplicaría el tamaño del historial para un beneficio marginal.

### 5.7 Tema

- Tres estados en ciclo: claro → oscuro → sistema. Con `system` se sigue el cambio del
  sistema operativo en caliente, mediante `matchMedia`.
- Un script en línea en `index.html` aplica la clase `.dark` **antes del primer pintado**.
  Sin él, quien tenga el tema oscuro vería un destello blanco en cada carga.

### 5.8 PWA e instalación

- `public/manifest.webmanifest` la hace instalable; `public/sw.js` da funcionamiento
  offline.
- **Estrategia del service worker:** los recursos de Vite llevan hash en el nombre, así
  que para ellos la caché nunca queda obsoleta y se sirve primero. La navegación va a la
  red primero, con la copia en caché como respaldo, para recoger despliegues nuevos.
- Solo se registra en producción: en desarrollo serviría versiones cacheadas y confundiría.
- **Limitación conocida:** los iconos del manifest son el `favicon.svg`. Para el icono
  maskable de Android convendría un PNG de 512×512.

---

## 6. Convenciones de código

### Idioma

- **Inglés**: nombres de variables, funciones, tipos, archivos y ramas.
- **Español**: texto visible en la UI, comentarios, documentación y mensajes de commit.

### Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componente propio | `PascalCase.tsx` | `TaskItem.tsx` |
| Componente shadcn | `kebab-case.tsx` en `ui/` | `button.tsx` |
| Hook | `useAlgo.ts`, export nombrado | `useTasks.ts` |
| Utilidad | `camelCase.ts` en `lib/` | `date.ts` |
| Test | junto al archivo que prueba | `tasks.test.ts` |
| Tipo | `PascalCase` | `Task`, `TasksState` |
| Props | `type <Componente>Props` | `TaskItemProps` |
| Callback en props | `on<Evento>` | `onAdd`, `onAdvance` |
| Handler de evento DOM | `handle<Evento>` | `handleSubmit`, `handleKeyDown` |
| Acción de dominio | verbo imperativo | `save`, `cancel`, `startEditing` |
| Booleano | prefijo `is` / `has` / participio | `isEditing`, `done`, `dimmed` |
| Constante de módulo | `SCREAMING_SNAKE_CASE` | `STORAGE_KEY`, `HISTORY_DAYS` |

Detalles con criterio:

- **`remove`, no `delete`** (`delete` es palabra reservada y `removeTask` lee mejor).
- Los nombres dicen **qué representa el valor**, no su tipo: `completed`, no `completedNum`.
- Los verbos del dominio son precisos: `advance` (avanzar el contador) no es `toggle`,
  `swap` (intercambiar dos) no es `move`.
- Evita abreviaturas salvo las universales (`id`, `props`, `ref`).

### Estilo

- Comillas simples, sin punto y coma, coma final, indentación de 2 espacios.
- Ancho de línea de unos 80 caracteres para código; las cadenas largas de clases Tailwind
  quedan en una sola línea (no se parten).
- Orden de imports: externos → línea en blanco → internos con `@/`.
- **Siempre alias `@/`**, nunca `../`.
- `import type { X } from '...'` en declaración separada — `verbatimModuleSyntax` lo exige.
- `type` en vez de `interface`.
- `export function Componente()` nombrado. Solo `App` usa `export default`.

> **Excepción: `src/components/ui/`.** Es código generado por shadcn (comillas dobles,
> `export { X }` al final del archivo). Se deja tal cual llega del generador para que
> `shadcn add` y las actualizaciones no produzcan diffs de estilo. No lo reformatees.

### Comentarios

Comenta el **porqué**, nunca el qué. Los comentarios que hay explican decisiones: por qué
`done` es derivado, por qué `swapTasks` trabaja con ids, por qué se revoca la object URL
con un `setTimeout`. Ese es el listón.

---

## 7. UI y estilos

- **Solo Tailwind**, sin CSS a medida fuera de [`src/index.css`](../src/index.css).
- **Tokens semánticos siempre**: `bg-card`, `text-muted-foreground`, `border-border`.
  Nunca `bg-neutral-800` ni colores literales — rompen el modo oscuro.
- Clases condicionales con `cn()` ([`lib/utils.ts`](../src/lib/utils.ts)), que resuelve
  conflictos vía `tailwind-merge`.
- Componentes shadcn desde el registro de `components.json` (estilo `base-nova`, base
  `neutral`, iconos `tabler`). Añádelos con `npx shadcn add` en vez de escribirlos a mano.
- Iconos: **solo `@tabler/icons-react`**. No mezclar librerías de iconos.
- Los iconos dentro de `Button` no llevan clase de tamaño: la variante ya lo resuelve.

### Accesibilidad — requisitos, no sugerencias

- Todo control sin texto visible lleva `aria-label` descriptivo, **e incluye el título de
  la tarea** cuando hay varios controles iguales en pantalla (`Subir "Beber agua"`).
- El control de progreso anuncia el estado completo: `Beber agua: 3 de 8. Sumar una`.
- Todo elemento clicable muestra `cursor-pointer`. Los `<button>` y los `[role="button"]`
  ya lo reciben de una regla base en [`index.css`](../src/index.css), así que **no hace
  falta repetirlo** al usar `Button` o `Checkbox`; sí hay que ponerlo a mano en cualquier
  otro elemento que se haga clicable, como el título de la tarea.
- Los controles se alcanzan y accionan con teclado. Enter guarda, Escape cancela.
- Los botones que aparecen al pasar el ratón usan `focus-within:opacity-100`, para que
  también aparezcan al tabular.
- El aviso de deshacer es `role="status"` con `aria-live="polite"`.
- Nada de `div` con `onClick` donde corresponde un `button`.
- El foco visible (`focus-visible:ring`) no se elimina.

---

## 8. Tests

`npm test` (Vitest + Testing Library, entorno jsdom).

**Qué se prueba y qué no.** El objetivo no es cobertura, es blindar la lógica que no es
evidente por lectura:

| Cubierto | Por qué |
|---|---|
| `advanceProgress`, `normalizeTarget` | El ciclo del contador y el clamp son el corazón del modelo |
| `applyDailyReset` | Archiva historial y reinicia; difícil de probar a mano |
| `computeStreak` | Reglas sutiles: días saltados, día en curso, fecha de creación |
| `sanitizeState` | Migración v1 → v2 y defensa ante datos corruptos |
| `parseBackup` | Entrada externa: es la superficie menos confiable |
| `useTasks` | Que las invariantes se cumplan al encadenar acciones |

No se prueban los componentes de presentación: su valor está en cómo se ven, y un test de
render solo repetiría el JSX.

Los tests van **junto al archivo que prueban** (`tasks.ts` → `tasks.test.ts`) y están
excluidos de `tsconfig.app.json`: el build de la app no los compila.

---

## 9. Criterios de código limpio

Checklist de revisión antes de dar por cerrado un cambio:

**Diseño**
- [ ] ¿La lógica nueva se puede escribir como función pura en `lib/`? Entonces va ahí.
- [ ] ¿El estado de dominio está en `useTasks` y no filtrado en un componente?
- [ ] ¿El componente hace una sola cosa? Si supera unas 150 líneas, probablemente no.
- [ ] ¿Se puede resolver con menos código o menos abstracción?

**Corrección**
- [ ] ¿Las actualizaciones de estado son inmutables y usan la forma funcional?
- [ ] ¿Las funciones expuestas por hooks están envueltas en `useCallback`?
- [ ] ¿Los `useEffect` limpian sus listeners, intervalos y temporizadores?
- [ ] ¿Las listas usan `key={task.id}`, nunca el índice?
- [ ] ¿Se validan las entradas del usuario en el hook, no en la vista?
- [ ] ¿El cambio respeta las invariantes de la sección 2? ¿Hay test que lo demuestre?

**Robustez**
- [ ] ¿Qué pasa con `localStorage` corrupto, lleno o deshabilitado?
- [ ] ¿Hay estado vacío diseñado, no una pantalla en blanco?
- [ ] ¿El texto largo o sin espacios se ajusta y no rompe el layout?

**Higiene**
- [ ] `npm run build`, `npm run lint` y `npm test` pasan.
- [ ] Sin `console.log`, código comentado ni imports sin usar.
- [ ] Sin `any` ni `@ts-ignore`.
- [ ] Los nombres siguen la tabla de la sección 6.

### Antipatrones concretos

| Evita | Haz |
|---|---|
| Guardar un valor que se puede derivar | `isTaskDone(task)` en vez de un campo `done` |
| `useEffect` para derivar valores | Calcula en el render |
| Acciones que reciben índices de array | Recíbelas por `id`, que es estable |
| Pasar el objeto `Task` completo a un callback | Pasa el `id` |
| `index` como `key` | `task.id` |
| Mutar `state.tasks.push(...)` | `[...prev.tasks, task]` |
| Lógica de dominio dentro de un componente | Función pura en `lib/tasks.ts` |
| Componente de `ui/` que importa `Task` | Mantén `ui/` agnóstico del dominio |
| Un hook `useTaskFilters`, `useTaskSort`… por función | Un solo `useTasks` mientras quepa |
| `alert()` para errores | Texto con `role="alert"` junto a la acción |

---

## 10. Git

- Ramas: `feat/…`, `fix/…`, `refactor/…`, `docs/…`.
- Commits siguiendo Conventional Commits, como el historial actual:
  `refactor: replace lucide icons with tabler icons`. Un commit, un cambio coherente.
- `dist/`, `node_modules/` y los lockfiles están ignorados por decisión del proyecto.

---

## 11. Estado actual y pendientes

**Implementado**: todo lo descrito en la sección 5, más el CRUD, el reset diario, el
estado vacío y la persistencia local.

**Pendiente**:

| Tarea | Nota |
|---|---|
| Instalar las dependencias de test | `npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`. Los tests y `vitest.config.ts` ya están escritos; sin instalar, `npm test` falla |
| Icono PNG 512×512 para el manifest | Hoy se usa el SVG, que Android no acepta como maskable |
| Formato roto en [`checkbox.tsx`](../src/components/ui/checkbox.tsx) | `<IconCheck` y `/>` quedaron en líneas separadas |
| Prettier | Formalizaría el estilo de la sección 6; hay que excluir `src/components/ui/` |

El warning de oxlint en [`button.tsx`](../src/components/ui/button.tsx)
(`only-export-components`, por exportar `buttonVariants`) es el patrón estándar de shadcn
y se acepta como tal.
