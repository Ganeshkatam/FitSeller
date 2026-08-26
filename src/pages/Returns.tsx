import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/Badge";
import { EmptyState, TableSkeleton } from "../components/ui/States";
import { useToast } from "../components/ui/Toast";
import { formatCurrency, formatDate } from "../lib/utils";
import type { ReturnRequest } from "../types";

const TABS = ["requested", "approved", "picked_up", "refunded", "rejected"] as const;

export default function Returns() {
  const { seller } = useAuth();
  const qc = useQueryClient();
  const toast = useToast();

  const [tab, setTab] = useState<(typeof TABS)[number]>("requested");

  const { data: returns, isLoading } = useQuery({
    queryKey: ["returns", seller?.id],
    enabled: !!seller?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("returns")
        .select(
          "*, items:return_items(*, order_item:order_items!inner(id, seller_id, product_snapshot))"
        )
        .eq("items.order_item.seller_id", seller!.id)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as ReturnRequest[];
    },
  });

  const filtered = (returns ?? []).filter((r) => r.status === tab);

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("returns")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, vars) => {
      toast("success", `Return ${vars.status.replace("_", " ")}`);
      qc.invalidateQueries({ queryKey: ["returns"] });
    },
    onError: (err) => toast("error", err.message),
  });

  return (
    <Page>
      <PageHeader title="Returns" description="Review and process buyer return requests for your products" />

      <div className="flex flex-wrap gap-1 px-4 py-4 lg:px-8">
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
      </div>

      <div className="px-4 lg:px-8">
        {!seller ? (
          <EmptyState title="No seller profile" description="Link a seller account to manage buyer returns." />
        ) : isLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={`No ${tab.replace("_", " ")} requests`}
            description="Return requests matching this status will show up here."
            icon="inbox"
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Badge status={r.status} />
                      <span className="font-mono text-xs text-muted-foreground">RET-{r.id.slice(0, 8)}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium capitalize text-foreground">{r.reason}</p>
                    {r.description && <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Requested</p>
                    <p className="text-sm text-muted-foreground">{formatDate(r.created_at)}</p>
                  </div>
                </div>

                {(r.items?.length ?? 0) > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {r.items!.map((it) => {
                      const snap = (it.order_item?.product_snapshot ?? {}) as { name?: string };
                      return (
                        <li key={it.id} className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate text-muted-foreground">{snap.name ?? it.order_item_id.slice(0, 8)}</span>
                          <span>Qty {it.quantity}{it.condition ? ` · ${it.condition}` : ""}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {r.refund_amount != null && Number(r.refund_amount) > 0 && (
                  <p className="mt-3 border-t border-border pt-3 text-sm">
                    <span className="text-muted-foreground">Refund amount: </span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(r.refund_amount)}</span>
                  </p>
                )}

                {r.status === "requested" && (
                  <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
                    <Button
                      variant="outline"
                      loading={updateMutation.isPending && updateMutation.variables?.status === "rejected"}
                      onClick={() => updateMutation.mutate({ id: r.id, status: "rejected" })}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="size-4" /> Reject
                    </Button>
                    <Button
                      loading={updateMutation.isPending && updateMutation.variables?.status === "approved"}
                      onClick={() => updateMutation.mutate({ id: r.id, status: "approved" })}
                    >
                      <Check className="size-4" /> Approve
                    </Button>
                  </div>
                )}

                {r.status === "approved" && (
                  <div className="mt-4 flex justify-end border-t border-border pt-4">
                    <Button
                      variant="secondary"
                      loading={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: r.id, status: "refunded" })}
                    >
                      Mark refunded
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

