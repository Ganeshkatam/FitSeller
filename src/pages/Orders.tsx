import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Truck } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/Badge";
import { Input } from "@/components/ui/input";
import { EmptyState, TableSkeleton } from "../components/ui/States";
import { useToast } from "../components/ui/Toast";
import { formatCurrency, formatDateTime } from "../lib/utils";
import type { OrderItem } from "../types";

const TABS = ["all", "pending", "placed", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export default function Orders() {
  const { seller } = useAuth();
  const sellerId = seller?.id ?? null;
  const qc = useQueryClient();
  const toast = useToast();

  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [search, setSearch] = useState("");
  const [shipModalOrder, setShipModalOrder] = useState<OrderItem | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["order-items", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*, order:order_id(*)")
        .eq("seller_id", sellerId!)
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return (data ?? []) as OrderItem[];
    },
  });

  const filtered = useMemo(() => {
    let list = items ?? [];
    if (tab !== "all") {
      // Order-level status filter applied via joined order
      list = list.filter((it) => it.order?.status === tab || it.status === tab);
    }
    if (search)
      list = list.filter(
        (it) =>
          (it.order?.order_number ?? "").toLowerCase().includes(search.toLowerCase()) ||
          ((it.product_snapshot as { name?: string }).name ?? "").toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [items, tab, search]);

  async function setOrderStatus(orderId: string | undefined, patch: Record<string, unknown>, successMsg: string) {
    if (!orderId) return;
    const { error } = await supabase.from("orders").update(patch).eq("id", orderId);
    if (error) toast("error", error.message);
    else {
      toast("success", successMsg);
      qc.invalidateQueries({ queryKey: ["order-items"] });
    }
  }

  const shipMutation = useMutation({
    mutationFn: async ({ item, tracking }: { item: OrderItem; tracking: string }) => {
      const orderId = item.order?.id ?? item.order_id;
      const now = new Date().toISOString();

      const [orderRes, itemRes] = await Promise.all([
        supabase
          .from("orders")
          .update({
            status: "shipped",
            fulfillment_status: "fulfilled",
            tracking_number: tracking || null,
            shipped_at: now,
          })
          .eq("id", orderId),
        supabase
          .from("order_items")
          .update({ status: "shipped", updated_at: now })
          .eq("id", item.id),
      ]);

      const firstError = orderRes.error ?? itemRes.error;
      if (firstError) throw firstError;
    },
    onSuccess: () => {
      toast("success", "Order marked as shipped");
      setShipModalOrder(null);
      qc.invalidateQueries({ queryKey: ["order-items"] });
    },
    onError: (err) => toast("error", err.message),
  });

  return (
    <Page>
      <PageHeader title="Orders" description="Track and fulfill buyer orders for your products" />

      <div className="flex flex-wrap items-center gap-3 px-4 py-4 lg:px-8">
        <div className="flex flex-wrap gap-1 rounded-xl bg-card p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                tab === t ? "bg-indigo-600 text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="relative ml-auto min-w-[220px] sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order or product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="px-4 lg:px-8">
        {!seller ? (
          <EmptyState title="No seller profile" description="Link a seller account to view incoming orders." />
        ) : isLoading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No orders found" description={search ? "Try a different search." : "Orders will appear here once buyers purchase your offers."} icon={search ? "search" : "inbox"} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Placed</th>
                    <th className="px-5 py-3 font-medium">Payment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Tracking</th>
                    <th className="px-5 py-3 text-right font-medium">Earnings</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((it) => {
                    const snap = it.product_snapshot as { name?: string };
                    const o = it.order;
                    return (
                      <tr key={it.id} className="group transition hover:bg-accent/40">
                        <td className="px-5 py-3.5">
                          <p className="font-mono text-xs font-semibold text-indigo-700">{o?.order_number ?? "—"}</p>
                          <p className="text-[11px] capitalize text-muted-foreground">{o?.payment_method ?? ""}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="block max-w-[180px] truncate text-foreground">{snap?.name ?? it.product_id.slice(0, 8)}</span>
                          <span className="text-[11px] text-muted-foreground">×{it.quantity}</span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{formatDateTime(it.created_at)}</td>
                        <td className="px-5 py-3.5"><Badge status={o?.payment_status ?? "pending"} /></td>
                        <td className="px-5 py-3.5"><Badge status={it.status} /></td>
                        <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{o?.tracking_number ?? "—"}</td>
                        <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">{formatCurrency(it.seller_amount)}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-2 opacity-60 transition group-hover:opacity-100">
                            {["confirmed", "processing"].includes(o?.status ?? "") && (
                              <Button size="sm" variant="secondary" onClick={() => setShipModalOrder(it)}>
                                <Truck className="size-3.5" /> Ship
                              </Button>
                            )}
                            {o?.status === "shipped" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                loading={false}
                                onClick={() =>
                                  setOrderStatus(
                                    o.id,
                                    { status: "delivered", fulfillment_status: "fulfilled", delivered_at: new Date().toISOString() },
                                    "Order marked as delivered"
                                  )
                                }
                              >
                                Delivered
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Ship modal */}
      {shipModalOrder && (
        <ShipModal
          orderNumber={shipModalOrder.order?.order_number ?? ""}
          loading={shipMutation.isPending}
          onClose={() => setShipModalOrder(null)}
          onSubmit={(tracking) => shipMutation.mutate({ item: shipModalOrder, tracking })}
        />
      )}
    </Page>
  );
}

function ShipModal({
  orderNumber,
  loading,
  onClose,
  onSubmit,
}: {
  orderNumber: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (tracking: string) => void;
}) {
  const [tracking, setTracking] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-foreground">Mark as shipped</h3>
        <p className="mt-1 text-sm text-muted-foreground">Order {orderNumber}</p>
        <label className="mt-4 mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Tracking number
        </label>
        <Input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="AWB / courier reference"
          autoFocus
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={() => onSubmit(tracking)}>
            Confirm shipment
          </Button>
        </div>
      </div>
    </div>
  );
}

