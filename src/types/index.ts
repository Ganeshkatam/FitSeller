export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
}

export interface Seller {
  id: string;
  profile_id: string;
  business_name: string;
  business_email: string;
  status: string | null;
  created_at: string;
}

export type OfferStatus = "draft" | "active" | "paused" | "suspended" | "ended";

export interface ProductOffer {
  id: string;
  product_id: string;
  seller_id: string;
  price_paise: number;
  sale_price_paise: number | null;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
  product?: Product | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_price: number;
  base_price: number | null;
  sale_price: number | null;
  image: string;
  category: string;
  category_id: string | null;
  sub_category_id: string | null;
  gender: string | null;
  brand: string | null;
  material: string;
  sizes: string[];
  sku: string | null;
  color: string | null;
  is_active: boolean;
  rating_avg: number | null;
  rating_count: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInventory {
  id: string;
  product_id: string;
  offer_id: string | null;
  variant_id: string | null;
  size: string | null;
  color: string | null;
  sku: string | null;
  barcode: string | null;
  stock: number;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  name: string | null;
  color: string | null;
  size: string | null;
  material: string | null;
  price_adjustment: number | null;
  is_active: boolean | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: string;
  fulfillment_status: string | null;
  payment_method: string;
  payment_status: string;
  is_paid: boolean;
  tracking_number: string | null;
  shipping_address: Record<string, unknown>;
  discount_amount: number | null;
  shipping_cost: number | null;
  tax_amount: number | null;
  coupon_code: string | null;
  created_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  order?: Order | null;
  product_id: string;
  offer_id: string | null;
  seller_id: string | null;
  product_snapshot: Record<string, unknown>;
  quantity: number;
  unit_price: number;
  total_amount: number;
  commission_rate: number | null;
  commission_amount: number | null;
  seller_amount: number;
  status: string;
  created_at: string;
}

export type ReturnStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "picked_up"
  | "refunded"
  | "completed";

export interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  description: string | null;
  status: ReturnStatus;
  admin_notes: string | null;
  refund_amount: number | null;
  created_at: string;
  updated_at: string;
  items?: ReturnItem[];
}

export interface ReturnItem {
  id: string;
  return_id: string;
  order_item_id: string;
  quantity: number;
  condition: string | null;
  status: string | null;
  comment: string | null;
  order_item?: {
    id?: string;
    seller_id?: string | null;
    product_snapshot?: Record<string, unknown>;
  } | null;
}

export interface Wallet {
  id: string;
  seller_id: string | null;
  available_balance: number | null;
  pending_balance: number | null;
  on_hold_balance: number | null;
  currency: string | null;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string | null;
  reference_type: string | null;
  status: string | null;
  created_at: string;
}

export interface Payout {
  id: string;
  payout_number: string;
  amount: number;
  currency: string | null;
  status: string;
  transaction_reference: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  is_active: boolean | null;
}

export interface SubCategory {
  id: string;
  main_category_id: string;
  name: string;
  slug: string;
}

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export const GENDER_OPTIONS = ["women", "men", "unisex", "kids"];
