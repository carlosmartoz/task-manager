import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ListTodo,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { COLOR_STYLES } from "../types";

const GRID = "#1e293b";
const AXIS_TICK = { fontSize: 12, fill: "#94a3b8" };
const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    fontSize: 13,
    color: "#e2e8f0",
  },
  labelStyle: { color: "#f1f5f9", fontWeight: 600 },
  itemStyle: { color: "#cbd5e1" },
} as const;

const MONTH_FMT = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
const MONTH_SHORT = new Intl.DateTimeFormat("en", { month: "short" });

function sameMonth(iso: string, d: Date): boolean {
  const x = new Date(iso);
  return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth();
}

function pctDelta(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

export default function StatsView() {
  const { boards } = useApp();

  const stats = useMemo(() => {
    const tasks = boards.flatMap((b) => b.tasks);
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const pending = tasks.filter((t) => t.status !== "done").length;
    const rate = total ? Math.round((done / total) * 100) : 0;

    const now = new Date();

    // Últimos 5 meses: creadas vs completadas
    const monthly: { name: string; created: number; completed: number }[] = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthly.push({
        name: MONTH_SHORT.format(d),
        created: tasks.filter((t) => sameMonth(t.createdAt, d)).length,
        completed: tasks.filter((t) => t.completedAt && sameMonth(t.completedAt, d)).length,
      });
    }
    const cur = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2] ?? { created: 0, completed: 0 };

    // Por board (donut)
    const byBoard = boards
      .map((b) => ({
        name: b.title,
        value: b.tasks.length,
        hex: COLOR_STYLES[b.color].hex,
      }))
      .filter((b) => b.value > 0);

    // Done vs pending por board (barras agrupadas)
    const compare = boards.map((b) => ({
      name: b.title,
      done: b.tasks.filter((t) => t.status === "done").length,
      pending: b.tasks.filter((t) => t.status !== "done").length,
    }));

    return {
      total,
      done,
      inProgress,
      pending,
      rate,
      monthly,
      byBoard,
      compare,
      createdDelta: pctDelta(cur.created, prev.created),
      completedDelta: pctDelta(cur.completed, prev.completed),
      monthLabel: MONTH_FMT.format(now),
    };
  }, [boards]);

  if (stats.total === 0) {
    return (
      <div className="animate-fade-in-up rounded-2xl border border-dashed border-slate-800 py-20 text-center">
        <TrendingUp className="mx-auto mb-3 text-slate-600" size={40} />
        <p className="font-medium text-slate-200">No data yet</p>
        <p className="text-sm text-slate-400">Add tasks to see your statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
          Here's your overview
        </h1>
        <p className="mt-1 text-sm text-slate-400">{stats.monthLabel}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Total tasks"
          value={stats.total}
          icon={ListTodo}
          delta={stats.createdDelta}
          deltaSuffix="created vs last month"
          delay={0}
        />
        <Kpi
          label="Completed"
          value={stats.done}
          icon={CheckCircle2}
          delta={stats.completedDelta}
          deltaSuffix="vs last month"
          delay={60}
        />
        <Kpi
          label="In progress"
          value={stats.inProgress}
          icon={Clock}
          sub="currently active"
          delay={120}
        />
        <Kpi
          label="Completion rate"
          value={`${stats.rate}%`}
          icon={Target}
          sub={`${stats.pending} tasks remaining`}
          delay={180}
        />
      </div>

      {/* Combo + gauge */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Created vs Completed by month"
          subtitle="Recent months"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={stats.monthly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="created" name="Created" fill="#fb7185" radius={[6, 6, 0, 0]} barSize={28} />
              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#34d399"
                strokeWidth={3}
                dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Completion rate" subtitle="% of tasks done">
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                innerRadius="68%"
                outerRadius="100%"
                data={[{ value: stats.rate, fill: "#34d399" }]}
                startAngle={220}
                endAngle={-40}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: "#1e293b" }}
                  dataKey="value"
                  cornerRadius={30}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-emerald-400">{stats.rate}%</span>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
                Completed
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Donut + grouped comparison */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Tasks by board" subtitle={stats.monthLabel}>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.byBoard}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {stats.byBoard.map((e) => (
                    <Cell key={e.name} fill={e.hex} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {stats.byBoard.map((e) => (
                <span key={e.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: e.hex }} />
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Done vs pending by board" subtitle="Current status">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.compare} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="done" name="Done" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="pending" name="Pending" fill="#475569" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm " +
        (className ?? "")
      }
    >
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      {subtitle && <p className="mb-4 text-xs text-slate-400">{subtitle}</p>}
      {children}
    </div>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  delta,
  deltaSuffix,
  sub,
  delay,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number;
  deltaSuffix?: string;
  sub?: string;
  delay: number;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div
      className="animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-colors hover:border-slate-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <Icon size={18} className="text-slate-500" />
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-50">{value}</p>
      {delta !== undefined ? (
        <p
          className={
            "mt-1.5 flex items-center gap-1 text-xs font-medium " +
            (positive ? "text-emerald-400" : "text-rose-400")
          }
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {positive ? "+" : ""}
          {delta}% {deltaSuffix}
        </p>
      ) : (
        sub && <p className="mt-1.5 text-xs text-slate-400">{sub}</p>
      )}
    </div>
  );
}
