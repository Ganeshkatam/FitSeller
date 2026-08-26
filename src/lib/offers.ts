import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { ProductOffer } from "../types";

export function useMyOffers(sellerId: string | null | undefined) {
  return useQuery({
    queryKey: ["my-offers", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_offers")
        .select("*, product:product_id(*)")
        .eq("seller_id", sellerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductOffer[];
    },
  });
}

export async function fetchMyOfferProductIds(sellerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("product_offers")
    .select("product_id")
    .eq("seller_id", sellerId);
  if (error) throw error;
  return (data ?? []).map((r) => r.product_id);
}
