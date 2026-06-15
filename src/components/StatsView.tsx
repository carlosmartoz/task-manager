import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  COLOR_STYLES,
  PRIORITY_META,
  STATUS_META,
  type Priority,
  type Status,
} from "../types";
import StatCard from "./StatCard";

const GRID = "#1e293b";
const AXIS_TICK = { fontSize: 12, fill: "#94a3b8" };
const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #1e293b",
    backgroundColor: "#0f172a",
    fontSize: 13,
    color: "#e2e8f0",
  },
  labelStyle: { color: "#e2e8f0" },
  itemStyle: { color: "#cbd5e1" },
} as const;

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-200">{title}</h3>
      {children}
    </div>
  );
}

export default function StatsView() {
  const { boards } = useApp();

  const stats = useMemo(() => {
    const tasks = boards.flatMap((b) => b.tasks);
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const rate = total ? Math.round((done / total) * 100) : 0;

    // Tareas por board (apiladas por estado)
    const perBoard = boards.map((b) => ({
      name: b.title,
      hechas: b.tasks.filter((t) => t.status === "done").length,
      progreso: b.tasks.filter((t) => t.status === "in_progress").length,
      pendientes: b.tasks.filter((t) => t.status === "todo").length,
      color: COLOR_STYLES[b.color].hex,
    }));

    // Distribución por estado
    const byStatus = (["todo", "in_progress", "done"] as Status[]).map((s) => ({
      name: STATUS_META[s].label,
      value: tasks.filter((t) => t.status === s).length,
      hex: STATUS_META[s].hex,
    }));

    // Distribución por prioridad
    const byPriority = (["high", "medium", "low"] as Priority[]).map((p) => ({
      name: PRIORITY_META[p].label,
      value: tasks.filter((t) => t.priority === p).length,
      hex: PRIORITY_META[p].hex,
    }));

    // Completadas en los últimos 14 días
    const days: { name: string; completadas: number }[] = [];
    const fmt = new Intl.DateTimeFormat("es", { day: "2-digit", month: "2-digit" });
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const count = tasks.filter((t) => {
        if (!t.completedAt) return false;
        const c = new Date(t.completedAt);
        return c >= d && c < next;
      }).length;
      days.push({ name: fmt.format(d), completadas: count });
    }

    return { total, done, inProgress, todo, rate, perBoard, byStatus, byPriority, days };
  }, [boards]);

  if (stats.total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
        <TrendingUp className="mx-auto mb-3 text-slate-700" size={40} />
        <p className="font-medium text-slate-300">Sin datos todavía</p>
        <p className="text-sm text-slate-500">
          Añade tareas para ver tus estadísticas.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Estadísticas</h1>
        <p className="text-sm text-slate-400">Tu progreso de un vistazo</p>
      </div>

      {/* Resumen */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tareas totales" value={stats.total} icon={ListTodo} accent="bg-indigo-500" />
        <StatCard label="Completadas" value={stats.done} icon={CheckCircle2} accent="bg-emerald-500" />
        <StatCard label="En progreso" value={stats.inProgress} icon={Clock} accent="bg-sky-500" />
        <StatCard
          label="Tasa de finalización"
          value={`${stats.rate}%`}
          icon={TrendingUp}
          accent="bg-violet-500"
          sub={`${stats.todo} por hacer`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Tareas por card">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.perBoard} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="hechas" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
              <Bar dataKey="progreso" stackId="a" fill="#38bdf8" />
              <Bar dataKey="pendientes" stackId="a" fill="#475569" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Completadas (últimos 14 días)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.days} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={1} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} cursor={{ stroke: "#334155" }} />
              <Line
                type="monotone"
                dataKey="completadas"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#6366f1" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución por estado">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.byStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {stats.byStatus.map((e) => (
                  <Cell key={e.name} fill={e.hex} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución por prioridad">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.byPriority} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} width={56} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                {stats.byPriority.map((e) => (
                  <Cell key={e.name} fill={e.hex} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
