# Task Manager

Aplicación de **hábitos diarios**. A diferencia de una lista de tareas normal, aquí las
tareas no se borran al completarse: se conservan de un día para otro y cada madrugada
vuelven a estado pendiente, archivando lo que cumpliste.

Funciona entera en el navegador. Sin cuentas, sin servidor, sin red.

## Qué hace

- **Metas por repeticiones.** Una tarea puede necesitar varios avances para darse por
  hecha: *beber 8 vasos de agua*. Cada clic suma uno; al llegar a la meta, el siguiente
  vuelve a cero.
- **Días de la semana.** *Gimnasio los lunes, miércoles y viernes*. Lo que no toca hoy se
  aparta a una sección plegable.
- **Rachas.** Días consecutivos cumpliendo cada tarea, y una racha global de días
  redondos. Los días en que no tocaba no la rompen.
- **Orden manual.** Tu rutina tiene un orden; la lista lo respeta.
- **Deshacer.** Borrar una tarea deja 6 segundos para recuperarla en su sitio.
- **Respaldo.** Exporta e importa todo en un JSON.
- **Tema** claro, oscuro o el del sistema.
- **Instalable y offline.** Es una PWA.

## Puesta en marcha

```bash
npm install
npm run dev
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Comprueba tipos y compila a `dist/` |
| `npm run lint` | Oxlint |
| `npm test` | Vitest |

> Los tests necesitan un paso extra la primera vez:
> `npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind 4 · [shadcn](https://ui.shadcn.com) sobre
[Base UI](https://base-ui.com) · [Tabler Icons](https://tabler.io/icons) · Vitest.

El manifest y el service worker están escritos a mano para no añadir dependencias de
build.

## Dónde está cada cosa

```
src/
├── App.tsx              Composición de la pantalla
├── components/          Presentación (ui/ = primitivas shadcn)
├── hooks/
│   ├── useTasks.ts      Única fuente de verdad del estado
│   └── useTheme.ts      Tema
├── lib/
│   ├── date.ts          Claves de día, formato, días de la semana
│   ├── tasks.ts         Lógica de dominio pura (progreso, reset, rachas)
│   └── storage.ts       Serializar, validar, migrar, respaldar
└── types/task.ts        Tipos y constantes de dominio
```

Los datos viven en `localStorage` bajo `daily-task-manager:v2`.

## Contribuir

Antes de tocar nada, lee [docs/SPECS.md](docs/SPECS.md): objetivos, alcance, modelo de
dominio, convenciones de nomenclatura y criterios de código limpio. El resumen operativo
para agentes está en [CLAUDE.md](CLAUDE.md).
