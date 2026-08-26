import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  IndianRupee,
  Tag,
  ShoppingCart,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { StatCard } from "../components/dashboard/StatCard";
import { Badge } from "../components/ui/Badge";
import { EmptyState, TableSkeleton } from "../components/ui/States";
import { formatCurrency, timeAgo } from "../lib/utils";
import type { OrderItem } from "../types";

export default function Dashboard() {
  const { seller } = useAuth();
  const sellerId = seller?.id ?? null;

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const [itemsAll, itemsMonth, offers, returns] = await Promise.all([
        supabase
          .from("order_items")
          .select("total_amount,seller_amount,status")
          .eq("seller_id", sellerId!),
        supabase
          .from("order_items")
          .select("total_amount,seller_amount")
          .eq("seller_id", sellerId!)
          .gte("created_at", monthStart.toISOString()),
        supabase
          .from("product_offers")
          .select("id", { count: "exact", head: true })
          .eq("seller_id", sellerId!)
          .neq("status", "ended"),
        supabase
          .from("order_items")
          .select("id", { count: "exact", head: true })
          .eq("seller_id", sellerId!)
          .in("status", ["return_requested", "returned"]),
      ]);

      if (itemsAll.error) throw itemsAll.error;
      if (itemsMonth.error) throw itemsMonth.error;
      if (offers.error) throw offers.error;
      if (returns.error) throw returns.error;

      const sum = (rows: Record<string, number>[] | null, key: string) =>
        (rows ?? []).reduce((acc, r) => acc + Number(r[key] ?? 0), 0);

      const revTotal = sum(itemsAll.data as unknown as Record<string, number>[], "seller_amount");
      const gmv = sum(itemsAll.data as unknown as Record<string, number>[], "total_amount");
      const orderCount = itemsAll.data?.length ?? 0;
      const returnCount = returns.count ?? 0;
      const returnRatePct = orderCount > 0 ? ((returnCount / orderCount) * 100).toFixed(1) + "%" : "0.0%";
      const aov = orderCount > 0 ? Math.round(gmv / orderCount) : 0;

      return {
        revenueTotal: revTotal,
        gmvTotal: gmv,
        orderCount,
        revenueMonth: sum(itemsMonth.data as unknown as Record<string, number>[], "seller_amount"),
        offerCount: offers.count ?? 0,
        returnCount,
        returnRate: returnRatePct,
        aov,
      };
    },
  });

  const { data: chartData } = useQuery({
    queryKey: ["dashboard-chart", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 13);
      since.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("order_items")
        .select("created_at,seller_amount")
        .eq("seller_id", sellerId!)
        .gte("created_at", since.toISOString())
        .order("created_at");

      if (error) throw error;

      const byDay = new Map<string, number>();
      for (let i = 0; i < 14; i++) {
        const d = new Date(since);
        d.setDate(d.getDate() + i);
        byDay.set(d.toISOString().slice(0, 10), 0);
      }
      for (const row of data ?? []) {
        const key = row.created_at.slice(0, 10);
        if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + Number(row.seller_amount));
      }
      return Array.from(byDay.entries()).map(([date, amount]) => ({
        date,
        label: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        amount,
      }));
    },
  });

  const { data: recentItems, isLoading: itemsLoading } = useQuery({
    queryKey: ["dashboard-recent-items", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("seller_id", sellerId!)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return (data ?? []) as OrderItem[];
    },
  });

  const chart = useMemo(() => chartData ?? [], [chartData]);

  return (
    <Page>
      <PageHeader
        title="Dashboard"
        description={
          seller
            ? `Selling as ${seller.business_name}`
            : "Your seller profile is being linked — live data appears once connected."
        }
      />

      {!seller && (
        <div className="mx-4 mt-6 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-300 lg:mx-8">
          No seller profile is linked to this account yet. Once your `sellers` record exists
          (matched by profile or business email), your data will show up here.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 px-4 pt-6 sm:grid-cols-2 xl:grid-cols-4 lg:px-8">
        <StatCard
          label="Net Earnings"
          value={formatCurrency(stats?.revenueTotal)}
          icon={<IndianRupee className="size-5" />}
          accent="emerald"
        />
        <StatCard
          label="Units Sold"
          value={String(stats?.orderCount ?? 0)}
          icon={<ShoppingCart className="size-5" />}
          accent="indigo"
        />
        <StatCard
          label="Active Listings"
          value={String(stats?.offerCount ?? 0)}
          icon={<Tag className="size-5" />}
          accent="violet"
        />
        <StatCard
          label="Return Rate"
          value={stats?.returnRate ?? "0.0%"}
          icon={<RotateCcw className="size-5" />}
          accent="amber"
        />
      </div>

      {/* Chart + top items */}
      <div className="mt-6 grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-8">
        <div className="rounded-2xl border border-border bg-card/60 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Earnings — last 14 days</h3>
              <p className="text-xs text-muted-foreground">Your net seller amount per day</p>
            </div>
            <Link to="/orders" className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
              View orders <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="h-64">
            {!chart || !chart.some((d) => d.amount > 0) ? (
              <div className="h-full flex items-center justify-center">
                <EmptyState
                  title="No sales yet"
                  description="Earnings trend will appear as customer orders are placed and delivered."
                  icon="inbox"
                />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={{ stroke: "#e4e4e7" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e4e4e7",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#52525b" }}
                    formatter={(value) => [formatCurrency(Number(value)), "Earnings"]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Best sellers by earnings</h3>
          <TopItems sellerId={sellerId} />
        </div>
      </div>

      {/* Recent sales */}
      <div className="mt-6 px-4 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent sales</h3>
            <Link to="/orders" className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
              All orders <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {itemsLoading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : !recentItems || recentItems.length === 0 ? (
            <EmptyState title="No sales yet" description="Sales will show up here in real time once buyers purchase your offers." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Qty</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">When</th>
                    <th className="px-5 py-3 text-right font-medium">Your earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentItems!.map((it) => {
                    const snap = it.product_snapshot as { name?: string };
                    return (
                      <tr key={it.id} className="transition hover:bg-accent/40">
                        <td className="max-w-[240px] truncate px-5 py-3.5 font-medium text-foreground">{snap?.name ?? it.product_id}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">×{it.quantity}</td>
                        <td className="px-5 py-3.5"><Badge status={it.status} /></td>
                        <td className="px-5 py-3.5 text-muted-foreground">{timeAgo(it.created_at)}</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">{formatCurrency(it.seller_amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Returns quick stat */}
      <div className="mt-6 px-4 lg:px-8">
        <Link
          to="/returns"
          className="group flex items-center justify-between rounded-2xl border border-border bg-gradient-to-r from-red-50 to-card px-5 py-4 transition hover:border-red-500/40"
        >
          <span className="flex items-center gap-3">
            <RotateCcw className="size-5 text-red-600" />
            <span className="text-sm text-foreground">
              {statsLoading ? "Checking returns…" : `${stats?.returnCount ?? 0} returned item(s) need attention`}
            </span>
          </span>
          <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-red-600" />
        </Link>
      </div>
    </Page>
  );
}

function TopItems({ sellerId }: { sellerId: string | null }) {
  const { data: items } = useQuery({
    queryKey: ["dashboard-top-items", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const { data } = await supabase
        .from("order_items")
        .select("product_id,product_snapshot,seller_amount")
        .eq("seller_id", sellerId!)
        .neq("status", "returned");
      return data ?? [];
    },
  });

  const top = useMemo(() => {
    const map = new Map<string, { name: string; total: number }>();
    for (const it of items ?? []) {
      const snap = it.product_snapshot as { name?: string };
      const cur = map.get(it.product_id) ?? { name: snap?.name ?? it.product_id, total: 0 };
      cur.total += Number(it.seller_amount);
      map.set(it.product_id, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [items]);

  if (!items || top.length === 0) {
    return <EmptyState title="No sales yet" description="Top items will appear after your first orders." icon="package" />;
  }

  return (
    <ul className="space-y-3">
      {top.map((t, i) => (
        <li key={t.name + i} className="flex items-center gap-3">
          <span className="w-4 text-xs font-bold text-muted-foreground">{i + 1}</span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-xs font-bold uppercase text-muted-foreground">
            {t.name.slice(0, 2)}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">{t.name}</span>
          <span className="text-sm font-semibold text-emerald-600">{formatCurrency(t.total)}</span>
        </li>
      ))}
    </ul>
  );
}
