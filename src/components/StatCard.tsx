import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string; // bg color class for icon bubble
  sub?: string;
}

export default function StatCard({ label, value, icon: Icon, accent, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white", accent)}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none text-slate-100">{value}</p>
          <p className="mt-1 text-sm text-slate-400">{label}</p>
        </div>
      </div>
      {sub && <p className="mt-3 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
