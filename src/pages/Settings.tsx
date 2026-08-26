import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Store as StoreIcon, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { Button } from "../components/ui/button";
import { Input, Label, Textarea } from "../components/ui/Field";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/States";
import { useToast } from "../components/ui/Toast";
import { formatDate } from "../lib/utils";

export default function Settings() {
  const { user, seller, loading: authLoading } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState(() => ({
    business_name: "",
    description: "",
    return_policy: "",
    shipping_policy: "",
  }));
  const [dirty, setDirty] = useState(false);

  // Note: sellers table currently has: id, profile_id, business_name, business_email, status
  const [policies, setPolicies] = useState({ return_policy: "", shipping_policy: "" });

  const isLoading = authLoading;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        business_name: form.business_name.trim(),
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("sellers").update(payload).eq("id", seller!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast("success", "Seller profile saved");
      setDirty(false);
      qc.invalidateQueries();
    },
    onError: (err) => toast("error", err.message),
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  if (!isLoading && seller && !form.business_name) {
    setForm((f) => ({
      ...f,
      business_name: seller.business_name ?? "",
    }));
  }

  return (
    <Page>
      <PageHeader title="Settings" description="Seller profile and account details" />

      {!seller ? (
        <div className="px-4 pt-6 lg:px-8">
          <EmptyState
            title="No seller profile"
            description="Your account isn't registered in the sellers table yet. Contact the platform team to get approved."
            icon="package"
          />
          <div className="mx-auto max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Account</p>
            <p className="mt-1 truncate text-sm font-medium text-zinc-100">{user?.email}</p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6 px-4 py-6 lg:px-8">
          {/* Seller identity */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <StoreIcon className="size-4 text-indigo-400" /> Seller profile
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Business name</Label>
                <Input
                  value={form.business_name}
                  onChange={(e) => set("business_name", e.target.value)}
                />
              </div>
              <div>
                <Label>Business email</Label>
                <Input value={seller.business_email} disabled />
              </div>
              <div>
                <Label>Status</Label>
                <div className="flex h-10 items-center gap-2">
                  <Badge status={seller.status ?? "pending"} />
                </div>
              </div>
              <div>
                <Label>Seller ID</Label>
                <Input value={seller.id} disabled className="font-mono text-xs" />
              </div>
              <div>
                <Label>Member since</Label>
                <Input value={formatDate(seller.created_at)} disabled />
              </div>
            </div>
          </section>

          {/* Policies — stored locally until schema adds columns */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <ShieldCheck className="size-4 text-emerald-400" /> Business policies
            </h2>
            <p className="mb-4 text-xs text-zinc-600">
              Policy fields require a schema update on the sellers table — values below are draft-only.
            </p>
            <div className="space-y-4">
              <div>
                <Label>Return policy</Label>
                <Textarea
                  value={policies.return_policy}
                  onChange={(e) => setPolicies((p) => ({ ...p, return_policy: e.target.value }))}
                  rows={3}
                  placeholder="e.g. 7-day returns, tags intact…"
                />
              </div>
              <div>
                <Label>Shipping policy</Label>
                <Textarea
                  value={policies.shipping_policy}
                  onChange={(e) => setPolicies((p) => ({ ...p, shipping_policy: e.target.value }))}
                  rows={3}
                  placeholder="e.g. Ships within 48 hours via Delhivery…"
                />
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div>
              <p className="text-sm font-medium text-zinc-100">Account status</p>
              <p className="mt-0.5 text-xs text-zinc-500">Controlled by the fitMirror platform team</p>
            </div>
            <Badge status={seller.status ?? "pending"} />
          </section>

          <div className="flex justify-end">
            <Button
              size="lg"
              disabled={!dirty || !form.business_name.trim()}
              loading={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              Save changes
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
}

