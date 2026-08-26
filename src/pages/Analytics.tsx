import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ScanFace, ShoppingBag, Percent, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Page, PageHeader } from "../components/layout/Page";
import { StatCard } from "../components/dashboard/StatCard";
import { EmptyState, TableSkeleton } from "../components/ui/States";
import { formatNumber } from "../lib/utils";

const PIE_COLORS = ["#6366f1", "#a855f7", "#22c55e", "#f59e0b"];

export default function Analytics() {
  const { data: data, isLoading } = useQuery({
    queryKey: ["tryon-analytics"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const [sessions, events] = await Promise.all([
        supabase
          .from("tryon_sessions")
          .select("id,created_at")
          .gte("created_at", since.toISOString()),
        supabase
          .from("analytics_events")
          .select("event_type,created_at")
          .gte("created_at", since.toISOString()),
      ]);

      const sessionsByDay = new Map<string, number>();
      for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        sessionsByDay.set(d.toISOString().slice(0, 10), 0);
      }
      for (const s of sessions.data ?? []) {
        const key = s.created_at.slice(0, 10);
        if (sessionsByDay.has(key)) sessionsByDay.set(key, sessionsByDay.get(key)! + 1);
      }

      const eventTypeCounts = new Map<string, number>();
      for (const e of events.data ?? []) {
        eventTypeCounts.set(e.event_type, (eventTypeCounts.get(e.event_type) ?? 0) + 1);
      }
      const pieData = Array.from(eventTypeCounts.entries())
        .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);

      return {
        totalSessions: sessions.count ?? sessions.data?.length ?? 0,
        eventCount: events.data?.length ?? 0,
        uniqueDays: sessionsByDay.size,
        conversionProxy:
          sessions.data && events.data && sessions.data.length > 0
            ? Math.min(100, Math.round((events.data.length / sessions.data.length) * 100) / 10)
            : null,
        chart: Array.from(sessionsByDay.entries()).map(([date, count]) => ({
          label: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          sessions: count,
        })),
        pieData,
      };
    },
  });

  return (
    <Page>
      <PageHeader
        title="Try-on Analytics"
        description="How shoppers interact with your garments in the virtual fitting room"
      />

      <div className="grid grid-cols-1 gap-4 px-4 pt-6 sm:grid-cols-2 xl:grid-cols-4 lg:px-8">
        <StatCard
          label="Try-on sessions"
          value={isLoading ? "…" : formatNumber(data?.totalSessions)}
          icon={<ScanFace className="size-5" />}
          accent="violet"
        />
        <StatCard
          label="Tracked events"
          value={isLoading ? "…" : formatNumber(data?.eventCount)}
          icon={<ShoppingBag className="size-5" />}
          accent="indigo"
        />
        <StatCard
          label="Active days"
          value={isLoading ? "…" : formatNumber(data?.uniqueDays)}
          icon={<Users className="size-5" />}
          accent="emerald"
        />
        <StatCard
          label="Events / session"
          value={data?.conversionProxy != null ? `${data.conversionProxy}` : "—"}
          icon={<Percent className="size-5" />}
          accent="amber"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 px-4 lg:grid-cols-5 lg:px-8">
        <div className="rounded-2xl border border-border bg-card/60 p-5 lg:col-span-3">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Try-on sessions — last 14 days</h3>
          {isLoading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.chart ?? []} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={{ stroke: "#e4e4e7" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "#e4e4e7" }}
                    contentStyle={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "#52525b" }}
                  />
                  <Bar dataKey="sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Event mix — last 30 days</h3>
          {!data || data.pieData.length === 0 ? (
            <EmptyState title="No analytics yet" description="Event breakdown appears as shoppers interact with try-on." />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {data.pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#ffffff" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#52525b" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
