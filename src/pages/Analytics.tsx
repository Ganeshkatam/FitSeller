import { useMemo } from "react";
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
import { IndianRupee, ShoppingCart, RotateCcw, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { StatCard } from "../components/dashboard/StatCard";
import { EmptyState, TableSkeleton } from "../components/ui/States";
import { formatCurrency, formatNumber } from "../lib/utils";

const STATUS_COLORS: Record<string, string> = {
  delivered: "#22c55e",
  shipped: "#6366f1",
  processing: "#3b82f6",
  placed: "#a855f7",
  pending: "#eab308",
  returned: "#ef4444",
  return_requested: "#f97316",
  cancelled: "#6b7280",
};

export default function Analytics() {
  const { seller } = useAuth();
  const sellerId = seller?.id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["seller-analytics", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const { data: orderItems, error } = await supabase
        .from("order_items")
        .select("id, created_at, total_amount, seller_amount, commission_amount, status, product_snapshot")
        .eq("seller_id", sellerId!)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      const items = orderItems ?? [];

      // Calculate totals
      let totalGmv = 0;
      let totalNetRevenue = 0;
      let totalReturns = 0;
      let totalDelivered = 0;

      const statusMap = new Map<string, number>();
      const productMap = new Map<string, { name: string; count: number; revenue: number }>();

      // 14-day trend timeline
      const trendMap = new Map<string, { date: string; label: string; revenue: number; units: number }>();
      for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const key = d.toISOString().slice(0, 10);
        trendMap.set(key, {
          date: key,
          label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          revenue: 0,
          units: 0,
        });
      }

      for (const item of items) {
        const amt = Number(item.seller_amount ?? 0);
        const gmv = Number(item.total_amount ?? 0);
        totalNetRevenue += amt;
        totalGmv += gmv;

        const st = (item.status ?? "pending").toLowerCase();
        statusMap.set(st, (statusMap.get(st) ?? 0) + 1);

        if (st === "returned" || st === "return_requested") {
          totalReturns++;
        }
        if (st === "delivered" || st === "completed") {
          totalDelivered++;
        }

        // Aggregate daily trends
        const dayKey = item.created_at?.slice(0, 10);
        if (dayKey && trendMap.has(dayKey)) {
          const t = trendMap.get(dayKey)!;
          t.revenue += amt;
          t.units += 1;
        }

        // Product ranking
        const snapshot = item.product_snapshot as Record<string, unknown> | null;
        const prodName = String(snapshot?.name ?? "Custom Product");
        const prev = productMap.get(prodName) ?? { name: prodName, count: 0, revenue: 0 };
        prev.count += 1;
        prev.revenue += amt;
        productMap.set(prodName, prev);
      }

      const orderCount = items.length;
      const aov = orderCount > 0 ? Math.round(totalGmv / orderCount) : 0;
      const returnRate = orderCount > 0 ? ((totalReturns / orderCount) * 100).toFixed(1) + "%" : "0.0%";
      const fulfillmentRate = orderCount > 0 ? ((totalDelivered / orderCount) * 100).toFixed(1) + "%" : "0.0%";

      const pieData = Array.from(statusMap.entries()).map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
        color: STATUS_COLORS[name] ?? "#6366f1",
      }));

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      return {
        totalNetRevenue,
        totalGmv,
        orderCount,
        aov,
        returnRate,
        fulfillmentRate,
        chart: Array.from(trendMap.values()),
        pieData,
        topProducts,
      };
    },
  });

  const chartData = useMemo(() => data?.chart ?? [], [data]);

  return (
    <Page>
      <PageHeader
        title="Sales & Business Analytics"
        description="Real-time revenue, order fulfillment, and conversion metrics for your store"
      />

      {!seller && (
        <div className="mx-4 mt-6 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-300 lg:mx-8">
          Link a seller profile to load live store analytics.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 px-4 pt-6 sm:grid-cols-2 xl:grid-cols-4 lg:px-8">
        <StatCard
          label="Net Seller Revenue (30d)"
          value={isLoading ? "…" : formatCurrency(data?.totalNetRevenue ?? 0)}
          icon={<IndianRupee className="size-5" />}
          accent="emerald"
        />
        <StatCard
          label="Total Units Sold (30d)"
          value={isLoading ? "…" : formatNumber(data?.orderCount ?? 0)}
          icon={<ShoppingCart className="size-5" />}
          accent="indigo"
        />
        <StatCard
          label="Average Order Value"
          value={isLoading ? "…" : formatCurrency(data?.aov ?? 0)}
          icon={<TrendingUp className="size-5" />}
          accent="violet"
        />
        <StatCard
          label="Return Rate"
          value={isLoading ? "…" : data?.returnRate ?? "0.0%"}
          icon={<RotateCcw className="size-5" />}
          accent="amber"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 px-4 lg:grid-cols-5 lg:px-8">
        {/* 14-day Daily Revenue & Orders Trend */}
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Revenue Trend — last 14 days</h3>
              <p className="text-xs text-muted-foreground">Daily net seller revenue earnings</p>
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
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
                    cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                    formatter={(value: unknown) => [formatCurrency(Number(value)), "Net Revenue"]}
                    contentStyle={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Mix */}
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-foreground">Order Status Distribution</h3>
          <p className="mb-4 text-xs text-muted-foreground">Live breakdown of customer order stages</p>

          {isLoading ? (
            <TableSkeleton rows={4} cols={2} />
          ) : !data || data.pieData.length === 0 ? (
            <EmptyState title="No orders recorded" description="Order status metrics will calculate as buyers place orders." />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {data.pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="var(--card)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Products Section */}
      <div className="mt-6 px-4 lg:px-8 pb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Top Performing Products</h3>
          <p className="text-xs text-muted-foreground mb-4">Ranked by total net seller revenue</p>

          {isLoading ? (
            <TableSkeleton rows={4} cols={3} />
          ) : !data || data.topProducts.length === 0 ? (
            <EmptyState title="No product sales data" description="Top products will appear once orders are placed." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-xs font-semibold uppercase text-muted-foreground">
                    <th className="pb-3 pt-1">Product Name</th>
                    <th className="pb-3 pt-1 text-center">Units Sold</th>
                    <th className="pb-3 pt-1 text-right">Net Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.topProducts.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 font-medium text-foreground">{prod.name}</td>
                      <td className="py-3 text-center text-muted-foreground">{prod.count}</td>
                      <td className="py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(prod.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

