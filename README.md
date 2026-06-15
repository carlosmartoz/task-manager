# TaskBoards

Gestor de tareas en **modo oscuro**, organizado por **cards** (temas), con tablero **Kanban** (arrastrar y soltar), **rutinas** recurrentes y sección de **estadísticas** con gráficos. Todo se guarda en tu navegador (`localStorage`), sin necesidad de servidor.

## Stack

- ⚛️ React 18 + TypeScript
- ⚡ Vite 6
- 🎨 Tailwind CSS v4 (tema oscuro)
- 📊 Recharts v3 (gráficos)
- 🔣 lucide-react (íconos)

## Funcionalidades

- **Cards por tema**: crea cards con color propio (Trabajo, Personal, Estudios…), cada una con sus tareas.
- **Tablero Kanban con drag & drop**: arrastra las tareas entre las columnas *Por hacer / En progreso / Hecho* para cambiar su estado.
- **Tareas**: título, descripción, prioridad (alta/media/baja), estado y fecha límite (con aviso si está vencida).
- **Rutinas recurrentes**: hábitos diarios, semanales o mensuales con seguimiento de **racha** 🔥 y conteo de completados.
- **Estadísticas**: tarjetas resumen + gráficos de tareas por card, completadas en el tiempo, y distribución por estado y prioridad.
- **Persistencia local**: tus datos quedan guardados en el navegador.

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## Estructura

```
src/
├── components/      # UI (BoardsView, BoardDetail/Kanban, RoutinesView, StatsView, formularios…)
├── context/         # AppContext: estado global (boards + rutinas) + persistencia
├── lib/             # utilidades (ids, fechas) y lógica de rutinas (periodos/rachas)
├── types.ts         # modelo de datos y metadatos de color/estado/prioridad/frecuencia
└── App.tsx          # layout y navegación (Cards / Rutinas / Estadísticas)
```

> Al primer arranque se cargan datos de ejemplo. Puedes eliminarlos creando/borrando cards y tareas; el estado se reescribe automáticamente.
