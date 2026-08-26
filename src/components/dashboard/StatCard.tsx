import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  delta?: number | null;
  accent?: string;
}

export function StatCard({ label, value, icon, delta, accent = "indigo" }: StatCardProps) {
  const accents: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-600",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-600",
    violet: "from-violet-500/20 to-violet-500/5 text-violet-600",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-600",
  };
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
            accents[accent] ?? accents.indigo
          )}
        >
          {icon}
        </div>
      </div>
      {delta != null && (
        <p
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-medium",
            delta >= 0 ? "text-emerald-600" : "text-red-600"
          )}
        >
          {delta >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {delta >= 0 ? "+" : ""}
          {delta}% vs last period
        </p>
      )}
    </div>
  );
}
