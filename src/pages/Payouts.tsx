import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Clock, Lock, ArrowDownToLine } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { Badge } from "../components/ui/Badge";
import { EmptyState, TableSkeleton } from "../components/ui/States";
import { formatCurrency, formatDateTime } from "../lib/utils";
import type { Payout, Wallet, WalletTransaction } from "../types";

export default function Payouts() {
  const { seller } = useAuth();

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet", seller?.id],
    enabled: !!seller?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("seller_id", seller!.id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Wallet | null;
    },
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["wallet-transactions", wallet?.id],
    enabled: !!wallet?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", wallet!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as WalletTransaction[];
    },
  });

  const { data: payouts, isLoading: payoutsLoading } = useQuery({
    queryKey: ["payouts", seller?.id],
    enabled: !!seller?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payouts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Payout[];
    },
  });

  const balances = [
    { label: "Available balance", value: wallet?.available_balance, icon: <IndianRupee className="size-5" />, accent: "text-emerald-600" },
    { label: "Pending settlement", value: wallet?.pending_balance, icon: <Clock className="size-5" />, accent: "text-amber-600" },
    { label: "On hold", value: wallet?.on_hold_balance, icon: <Lock className="size-5" />, accent: "text-muted-foreground" },
  ];

  return (
    <Page>
      <PageHeader
        title="Payouts & Wallet"
        description="Your earnings balance, settlements and withdrawals"
      />

      {/* Balance cards */}
      <div className="grid grid-cols-1 gap-4 px-4 pt-6 sm:grid-cols-3 lg:px-8">
        {balances.map((b) => (
          <div key={b.label} className="rounded-2xl border border-border bg-gradient-to-br from-card to-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{b.label}</p>
              <span className={b.accent}>{b.icon}</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {walletLoading ? "…" : formatCurrency(b.value)}
            </p>
          </div>
        ))}
      </div>

      {!seller?.id ? (
        <div className="px-4 pt-6 lg:px-8">
          <EmptyState title="No wallet linked" description="Wallet details appear once your seller account is connected." />
        </div>
      ) : (
        <>
          {/* Transactions */}
          <div className="mt-8 px-4 lg:px-8">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Recent transactions</h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
              {txLoading ? (
                <TableSkeleton rows={4} cols={4} />
              ) : !transactions || transactions.length === 0 ? (
                <EmptyState title="No transactions yet" description="Settlement credits from orders will appear here." />
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Amount</th>
                      <th className="px-5 py-3 text-right font-medium">Balance after</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((t) => (
                      <tr key={t.id} className="transition hover:bg-accent/40">
                        <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{formatDateTime(t.created_at)}</td>
                        <td className="max-w-[240px] truncate px-5 py-3.5 text-foreground">{t.description ?? t.reference_type ?? "—"}</td>
                        <td className="px-5 py-3.5"><Badge status={t.type === "credit" ? "completed" : t.type === "debit" ? "shipped" : undefined} >{t.type}</Badge></td>
                        <td className="px-5 py-3.5"><Badge status={t.status ?? "completed"} /></td>
                        <td className={`px-5 py-3.5 text-right font-semibold ${t.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
                          {t.type === "credit" ? "+" : "−"}{formatCurrency(t.amount)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-muted-foreground">{formatCurrency(t.balance_after)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Payout history */}
          <div className="mt-8 px-4 lg:px-8">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ArrowDownToLine className="size-4 text-muted-foreground" /> Withdrawal history
            </h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
              {payoutsLoading ? (
                <TableSkeleton rows={3} cols={4} />
              ) : !payouts || payouts.length === 0 ? (
                <EmptyState title="No withdrawals yet" description="Request a payout to withdraw your available balance." />
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Payout</th>
                      <th className="px-5 py-3 font-medium">Requested</th>
                      <th className="px-5 py-3 font-medium">Reference</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payouts.map((p) => (
                      <tr key={p.id} className="transition hover:bg-accent/40">
                        <td className="px-5 py-3.5 font-mono text-xs text-indigo-700">{p.payout_number}</td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{formatDateTime(p.created_at)}</td>
                        <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.transaction_reference || "—"}</td>
                        <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                        <td className="px-5 py-3.5 text-right font-semibold text-foreground">{formatCurrency(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </Page>
  );
}

