import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Truck } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/States";
import { useToast } from "../components/ui/Toast";
import { formatDate } from "../lib/utils";

export default function Settings() {
  const { user, seller, refreshAuth } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    business_name: "",
    brand_name: "",
    primary_category: "",
    dispatch_time_hours: 24,
  });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (seller) {
      setForm({
        business_name: seller.business_name ?? "",
        brand_name: seller.brand_name ?? "",
        primary_category: seller.primary_category ?? "",
        dispatch_time_hours: seller.dispatch_time_hours ?? 24,
      });
      setDirty(false);
    }
  }, [seller]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!seller) return;
      const payload = {
        business_name: form.business_name.trim(),
        brand_name: form.brand_name.trim() || null,
        primary_category: form.primary_category.trim() || null,
        dispatch_time_hours: Number(form.dispatch_time_hours),
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("sellers")
        .update(payload)
        .eq("id", seller.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast("success", "Seller settings updated");
      setDirty(false);
      await refreshAuth();
      qc.invalidateQueries();
    },
    onError: (err) => toast("error", err.message),
  });

  function set<K extends keyof typeof form>(key: K, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  return (
    <Page>
      <PageHeader title="Settings" description="Seller store profile, brand details, and fulfillment preferences" />

      {!seller ? (
        <div className="px-4 pt-6 lg:px-8">
          <EmptyState
            title="No seller profile"
            description="Your account is not registered as an active merchant. Complete onboarding to access seller settings."
            icon="package"
          />
          <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card/60 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Account</p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">{user?.email}</p>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6 px-4 py-6 lg:px-8">
          {/* Seller Store Identity */}
          <section className="rounded-2xl border border-border bg-card/60 p-5 space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building2 className="size-4 text-indigo-600" /> Store &amp; Brand Profile
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="business_name" className="text-xs font-semibold text-foreground">
                  Business Name (Legal Entity)
                </Label>
                <Input
                  id="business_name"
                  value={form.business_name}
                  onChange={(e) => set("business_name", e.target.value)}
                  className="mt-1 h-9.5 rounded-lg text-sm"
                />
              </div>

              <div>
                <Label htmlFor="brand_name" className="text-xs font-semibold text-foreground">
                  Brand / Storefront Name
                </Label>
                <Input
                  id="brand_name"
                  value={form.brand_name}
                  onChange={(e) => set("brand_name", e.target.value)}
                  placeholder="e.g. Aura Studio"
                  className="mt-1 h-9.5 rounded-lg text-sm"
                />
              </div>

              <div>
                <Label htmlFor="primary_category" className="text-xs font-semibold text-foreground">
                  Primary Apparel Category
                </Label>
                <Input
                  id="primary_category"
                  value={form.primary_category}
                  onChange={(e) => set("primary_category", e.target.value)}
                  placeholder="e.g. Women's Ethnic & Sarees"
                  className="mt-1 h-9.5 rounded-lg text-sm"
                />
              </div>

              <div>
                <Label htmlFor="business_email" className="text-xs font-semibold text-foreground">
                  Registered Email
                </Label>
                <Input
                  id="business_email"
                  value={seller.business_email}
                  disabled
                  className="mt-1 h-9.5 rounded-lg text-sm bg-muted/40 text-muted-foreground"
                />
              </div>
            </div>
          </section>

          {/* Fulfillment & Dispatch */}
          <section className="rounded-2xl border border-border bg-card/60 p-5 space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Truck className="size-4 text-indigo-600" /> Fulfillment Preferences
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Shipping Mode
                </Label>
                <div className="mt-1 flex h-9.5 items-center px-3 rounded-lg border border-border bg-muted/30 text-xs text-foreground font-medium">
                  {seller.shipping_mode === "fitseller_pickup" ? "Doorstep Courier Pickup" : "Self-Ship via Courier"}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Assigned Courier Partner
                </Label>
                <div className="mt-1 flex h-9.5 items-center px-3 rounded-lg border border-border bg-muted/30 text-xs text-foreground font-medium uppercase">
                  {seller.courier_partner || "Delhivery & BlueDart"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="dispatch_time_hours" className="text-xs font-semibold text-foreground">
                  Dispatch SLA (Hours)
                </Label>
                <select
                  id="dispatch_time_hours"
                  value={form.dispatch_time_hours}
                  onChange={(e) => set("dispatch_time_hours", Number(e.target.value))}
                  className="mt-1 flex h-9.5 w-full rounded-lg border border-border bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value={24}>24 Hours (Fast Dispatch)</option>
                  <option value={48}>48 Hours (Standard)</option>
                  <option value={72}>72 Hours (Extended Preparation)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Account Status & Identity Anchor */}
          <section className="rounded-2xl border border-border bg-card/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Merchant Account Status</p>
                <p className="text-xs text-muted-foreground">
                  Status is verified and enforced directly at the database layer.
                </p>
              </div>
              <Badge status={seller.status ?? "pending"} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-border/60">
              <div>
                <span className="text-muted-foreground">Seller Reference ID:</span>
                <p className="font-mono text-foreground font-medium mt-0.5">{seller.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Registered Since:</span>
                <p className="text-foreground font-medium mt-0.5">{formatDate(seller.created_at)}</p>
              </div>
            </div>
          </section>

          {/* Save Action */}
          <div className="flex justify-end pt-2">
            <Button
              size="default"
              disabled={!dirty || !form.business_name.trim()}
              loading={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-5 h-9.5 shadow-sm shadow-indigo-600/30 text-xs sm:text-sm"
            >
              Save changes
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
}
