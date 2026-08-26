import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Package, Tag } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Page, PageHeader } from "../components/layout/Page";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input, Label, Select, Textarea } from "../components/ui/Field";
import { EmptyState, TableSkeleton } from "../components/ui/States";
import { useToast } from "../components/ui/Toast";
import { formatPaise, paiseToRupees } from "../lib/utils";
import {
  GENDER_OPTIONS,
  SIZE_OPTIONS,
  type MainCategory,
  type OfferStatus,
  type Product,
  type ProductOffer,
  type SubCategory,
} from "../types";

type Tab = "offers" | "catalog";

const OFFER_STATUSES: OfferStatus[] = ["draft", "active", "paused", "ended"];

export default function Products() {
  const { seller } = useAuth();
  const qc = useQueryClient();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>("offers");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OfferStatus>("all");
  const [offerModalOffer, setOfferModalOffer] = useState<ProductOffer | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // All platform products (for catalog browsing)
  const { data: catalog, isLoading: catalogLoading } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .neq("is_deleted", true)
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return data as Product[];
    },
  });

  // My offers with product joined
  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["my-offers", seller?.id],
    enabled: !!seller?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_offers")
        .select("*, product:product_id(*)")
        .eq("seller_id", seller!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductOffer[];
    },
  });

  const offeredProductIds = useMemo(
    () => new Set((offers ?? []).map((o) => o.product_id)),
    [offers]
  );

  const filteredOffers = useMemo(() => {
    let list = offers ?? [];
    if (search)
      list = list.filter((o) =>
        (o.product?.name ?? "").toLowerCase().includes(search.toLowerCase())
      );
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    return list;
  }, [offers, search, statusFilter]);

  const filteredCatalog = useMemo(() => {
    let list = catalog ?? [];
    if (search)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.brand ?? "").toLowerCase().includes(search.toLowerCase())
      );
    return tab === "catalog"
      ? list
      : list.filter((p) => !offeredProductIds.has(p.id));
  }, [catalog, search, tab, offeredProductIds]);

  async function handleDeleteOffer(o: ProductOffer) {
    if (!confirm("End this offer? The product will no longer sell under your account.")) return;
    const { error } = await supabase
      .from("product_offers")
      .update({ status: "ended", updated_at: new Date().toISOString() })
      .eq("id", o.id);
    if (error) toast("error", error.message);
    else {
      toast("success", "Offer ended");
      qc.invalidateQueries({ queryKey: ["my-offers"] });
    }
  }

  const isLoading = tab === "offers" ? offersLoading : catalogLoading;

  return (
    <Page>
      <PageHeader
        title="Catalog & Offers"
        description={
          seller
            ? `Selling as ${seller.business_name}`
            : "Browse the fitMirror catalog and manage your selling offers"
        }
        action={
          <Button onClick={() => setCreateOpen(true)} disabled={!seller}>
            <Plus className="size-4" /> New product
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 px-4 py-4 lg:px-8">
        <div className="flex gap-1 rounded-xl bg-zinc-900 p-1">
          <button
            onClick={() => setTab("offers")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
              tab === "offers" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tag className="size-3.5" /> My offers ({offers?.length ?? 0})
          </button>
          <button
            onClick={() => setTab("catalog")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
              tab === "catalog" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Package className="size-3.5" /> Browse catalog
          </button>
        </div>

        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {tab === "offers" && (
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-auto min-w-[130px]"
          >
            <option value="all">All statuses</option>
            {OFFER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        )}
      </div>

      <div className="px-4 lg:px-8">
        {!seller ? (
          <EmptyState title="No seller profile" description="Your account isn't registered as a seller yet." icon="package" />
        ) : isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : tab === "offers" && filteredOffers.length === 0 ? (
          <EmptyState
            title="No offers yet"
            description="Browse the catalog and start selling a product by creating an offer."
            icon="package"
            action={<Button onClick={() => setTab("catalog")}>Browse catalog</Button>}
          />
        ) : tab === "catalog" && filteredCatalog.length === 0 ? (
          <EmptyState
            title="Nothing found"
            description="Try a different search."
            icon="search"
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Platform price</th>
                    {tab === "offers" ? (
                      <>
                        <th className="px-5 py-3 font-medium">Your price</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="px-5 py-3 font-medium">Sizes</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {tab === "offers"
                    ? filteredOffers.map((o) => (
                        <tr key={o.id} className="group transition hover:bg-zinc-800/40">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Thumb image={o.product?.image} name={o.product?.name} />
                              <div className="min-w-0 max-w-[240px]">
                                <p className="truncate font-medium text-zinc-100">{o.product?.name}</p>
                                {o.product?.brand && (
                                  <p className="truncate text-xs text-zinc-500">{o.product.brand}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 capitalize text-zinc-400">{o.product?.category}</td>
                          <td className="px-5 py-3.5 text-zinc-400">{formatPaise(o.product?.price ?? 0)}</td>
                          <td className="px-5 py-3.5">
                            <span className="font-semibold text-emerald-400">{formatPaise(o.price_paise)}</span>
                            {o.sale_price_paise != null && Number(o.sale_price_paise) > 0 && (
                              <span className="ml-2 text-xs text-zinc-500 line-through">
                                {formatPaise(o.sale_price_paise)}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5"><Badge status={o.status} /></td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-end gap-1 opacity-60 transition group-hover:opacity-100">
                              <Button variant="ghost" size="icon" onClick={() => setOfferModalOffer(o)}>
                                <Pencil className="size-4" />
                              </Button>
                              {o.status !== "ended" && (
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteOffer(o)} className="hover:bg-red-950/50 hover:text-red-400">
                                  <Trash2 className="size-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    : filteredCatalog.map((p) => (
                        <tr key={p.id} className="group transition hover:bg-zinc-800/40">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Thumb image={p.image} name={p.name} />
                              <div className="min-w-0 max-w-[240px]">
                                <p className="truncate font-medium text-zinc-100">{p.name}</p>
                                {p.brand && <p className="truncate text-xs text-zinc-500">{p.brand}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 capitalize text-zinc-400">{p.category}</td>
                          <td className="px-5 py-3.5 font-semibold text-zinc-100">{formatPaise(Number(p.price) * 100)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {(p.sizes ?? []).slice(0, 5).map((s) => (
                                <span key={s} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Button
                              size="sm"
                              disabled={!seller || offeredProductIds.has(p.id)}
                              onClick={() => setOfferModalOffer({ id: "", product_id: p.id, seller_id: seller!.id, price_paise: Math.round(Number(p.price) * 100), sale_price_paise: null, status: "draft", created_at: "", updated_at: "", product: p })}
                            >
                              {offeredProductIds.has(p.id) ? "Offered" : "Start selling"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {offerModalOffer && (
        <OfferModal
          offer={offerModalOffer}
          onClose={() => setOfferModalOffer(null)}
          onSaved={() => {
            setOfferModalOffer(null);
            qc.invalidateQueries({ queryKey: ["my-offers"] });
          }}
        />
      )}

      {createOpen && (
        <CreateProductModal
          onClose={() => setCreateOpen(false)}
          onSaved={(offerId) => {
            setCreateOpen(false);
            qc.invalidateQueries({ queryKey: ["my-offers"] });
            qc.invalidateQueries({ queryKey: ["catalog"] });
            toast("success", offerId ? "Product created and offer started" : "Product created");
          }}
        />
      )}
    </Page>
  );
}

function Thumb({ image, name }: { image?: string | null; name?: string | null }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800 text-xs font-bold uppercase text-zinc-400">
      {image ? <img src={image} alt="" className="size-full object-cover" /> : (name ?? "?").slice(0, 2)}
    </span>
  );
}

function OfferModal({
  offer,
  onClose,
  onSaved,
}: {
  offer: ProductOffer;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !offer.id;
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState(paiseToRupees(offer.price_paise));
  const [salePrice, setSalePrice] = useState(offer.sale_price_paise ? paiseToRupees(offer.sale_price_paise) : "");
  const [status, setStatus] = useState<OfferStatus>(isNew ? "active" : offer.status);

  async function handleSave() {
    setError(null);
    const p = Math.round(Number(price) * 100);
    if (!Number.isFinite(Number(price)) || p <= 0) return setError("Enter a valid price.");
    setSaving(true);
    try {
      const payload = {
        product_id: offer.product_id,
        seller_id: offer.seller_id,
        price_paise: p,
        sale_price_paise: salePrice ? Math.round(Number(salePrice) * 100) : null,
        status,
        updated_at: new Date().toISOString(),
      };
      const { error } = isNew
        ? await supabase.from("product_offers").insert(payload)
        : await supabase.from("product_offers").update(payload).eq("id", offer.id);
      if (error) throw error;
      toast("success", isNew ? "You're now selling this product" : "Offer updated");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save offer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalFrame title={isNew ? `Sell "${offer.product?.name}"` : "Edit offer"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <Label>Your selling price (₹) *</Label>
          <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          <p className="mt-1 text-xs text-zinc-600">Stored in paise — e.g. ₹4299 → 429900</p>
        </div>
        <div>
          <Label>Sale price (₹)</Label>
          <Input type="number" min="0" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as OfferStatus)}>
            {OFFER_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
          </Select>
        </div>
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>
        )}
      </div>
      <ModalFooter onClose={onClose} saving={saving} onSave={handleSave} saveLabel={isNew ? "Create offer" : "Save changes"} />
    </ModalFrame>
  );
}

function CreateProductModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (offerId?: boolean) => void;
}) {
  const { seller } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: mainCats } = useQuery({
    queryKey: ["main-categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("main_categories")
        .select("id,name,slug,is_active")
        .order("sort_order");
      return (data ?? []) as MainCategory[];
    },
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    sub_category_id: "",
    gender: "women",
    material: "",
    brand: "",
    color: "",
    price: "",
    compare_price: "",
    sku: "",
    is_active: true,
  });
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L"]);
  const [sellPrice, setSellPrice] = useState("");

  const selectedMainId = form.category_id;

  const { data: subCats } = useQuery({
    queryKey: ["sub-categories", selectedMainId],
    enabled: !!selectedMainId,
    queryFn: async () => {
      const { data } = await supabase
        .from("sub_categories")
        .select("id,main_category_id,name,slug")
        .eq("main_category_id", selectedMainId)
        .order("sort_order");
      return (data ?? []) as SubCategory[];
    },
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setError(null);
    if (!seller) return setError("Seller profile missing.");
    const priceNum = Number(form.price);
    if (!form.name.trim()) return setError("Product name is required.");
    if (!Number.isFinite(priceNum) || priceNum <= 0) return setError("Enter a valid price.");
    if (!form.material.trim()) return setError("Material is required.");
    if (sizes.length === 0) return setError("Select at least one size.");

    setSaving(true);
    try {
      const cat = mainCats?.find((c) => c.id === form.category_id);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: priceNum,
        compare_price: Number(form.compare_price) || priceNum,
        base_price: priceNum,
        sale_price: priceNum,
        image: "",
        category: cat?.slug ?? "general",
        category_id: form.category_id || null,
        sub_category_id: form.sub_category_id || null,
        gender: form.gender,
        material: form.material.trim(),
        brand: form.brand.trim() || null,
        color: form.color.trim() || null,
        sku: form.sku.trim() || null,
        sizes,
        is_active: form.is_active,
        owner_type: "seller",
      };
      const { data: created, error: prodErr } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (prodErr) throw prodErr;

      // Auto-create own offer so the product is sellable immediately
      if (sellPrice && Number(sellPrice) > 0) {
        const { error: offerErr } = await supabase.from("product_offers").insert({
          product_id: created.id,
          seller_id: seller.id,
          price_paise: Math.round(Number(sellPrice) * 100),
          status: "active",
        });
        if (offerErr) throw offerErr;
      }

      onSaved(!!sellPrice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      toast("error", err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalFrame title="New product" onClose={onClose}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Product name *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Floral Midi Dress" />
          </div>
          <div>
            <Label>Main category</Label>
            <Select value={form.category_id} onChange={(e) => { set("category_id", e.target.value); set("sub_category_id", ""); }}>
              <option value="">Select…</option>
              {(mainCats ?? []).map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </Select>
          </div>
          <div>
            <Label>Sub category</Label>
            <Select value={form.sub_category_id} onChange={(e) => set("sub_category_id", e.target.value)} disabled={!selectedMainId}>
              <option value="">Select…</option>
              {(subCats ?? []).map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </Select>
          </div>
          <div>
            <Label>Audience</Label>
            <Select value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {GENDER_OPTIONS.map((g) => (<option key={g} value={g}>{g[0].toUpperCase() + g.slice(1)}</option>))}
            </Select>
          </div>
          <div>
            <Label>Brand</Label>
            <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <Label>Material *</Label>
            <Input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="Cotton blend" />
          </div>
          <div>
            <Label>Color</Label>
            <Input value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Navy blue" />
          </div>
          <div>
            <Label>Platform price (₹) *</Label>
            <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <Label>Compare-at price (₹)</Label>
            <Input type="number" min="0" step="0.01" value={form.compare_price} onChange={(e) => set("compare_price", e.target.value)} />
          </div>
          <div>
            <Label>Your selling price (₹)</Label>
            <Input type="number" min="0" step="0.01" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="Creates your offer automatically" />
          </div>
          <div>
            <Label>SKU</Label>
            <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="Optional" />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Describe fabric, fit and styling…" />
          </div>
        </div>

        <div>
          <Label>Available sizes *</Label>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSizes((cur) => (active ? cur.filter((x) => x !== s) : [...cur, s]))}
                  className={`size-10 rounded-lg text-xs font-bold transition ${
                    active ? "bg-indigo-600 text-white shadow shadow-indigo-600/30" : "border border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="size-4 rounded accent-indigo-600" />
          Active — visible to buyers on fitMirror
        </label>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>
        )}
      </div>
      <ModalFooter onClose={onClose} saving={saving} onSave={handleSave} saveLabel="Create product" />
    </ModalFrame>
  );
}

function ModalFrame({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-sm text-zinc-500 hover:text-white">✕</button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({
  onClose,
  saving,
  onSave,
  saveLabel,
}: {
  onClose: () => void;
  saving: boolean;
  onSave: () => void;
  saveLabel: string;
}) {
  return (
    <div className="sticky bottom-0 -mx-5 -mb-5 mt-2 flex justify-end gap-2 border-t border-zinc-800 bg-zinc-900 px-5 py-4">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={onSave} loading={saving}>{saveLabel}</Button>
    </div>
  );
}
