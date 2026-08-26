import { describe, it, expect } from "vitest";
import type {
  SellerStatus,
  OrderStatus,
  OrderItemStatus,
  PaymentStatus,
  OfferStatus,
} from "../types";

describe("Database State Machine & Enum Conformance", () => {
  it("conforms to PostgreSQL seller_status enum values", () => {
    const validSellerStatuses: SellerStatus[] = [
      "pending",
      "active",
      "suspended",
      "terminated",
    ];

    expect(validSellerStatuses).toHaveLength(4);
    expect(validSellerStatuses).toContain("active");
    expect(validSellerStatuses).toContain("suspended");
    expect(validSellerStatuses).toContain("terminated");
  });

  it("conforms to PostgreSQL order_status enum values", () => {
    const validOrderStatuses: OrderStatus[] = [
      "pending_payment",
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];

    expect(validOrderStatuses).toHaveLength(8);
    expect(validOrderStatuses).toContain("placed");
    expect(validOrderStatuses).toContain("delivered");
    expect(validOrderStatuses).toContain("returned");
  });

  it("conforms to PostgreSQL order_item_status enum values", () => {
    const validItemStatuses: OrderItemStatus[] = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "return_requested",
      "returned",
    ];

    expect(validItemStatuses).toHaveLength(7);
    expect(validItemStatuses).toContain("processing");
    expect(validItemStatuses).toContain("return_requested");
  });

  it("conforms to PostgreSQL product_offer_status enum values", () => {
    const validOfferStatuses: OfferStatus[] = [
      "draft",
      "active",
      "paused",
      "suspended",
      "ended",
    ];

    expect(validOfferStatuses).toHaveLength(5);
    expect(validOfferStatuses).toContain("draft");
    expect(validOfferStatuses).toContain("active");
    expect(validOfferStatuses).toContain("ended");
  });

  it("conforms to PostgreSQL payment_status enum values", () => {
    const validPaymentStatuses: PaymentStatus[] = [
      "pending",
      "authorized",
      "captured",
      "failed",
      "refunded",
    ];

    expect(validPaymentStatuses).toHaveLength(5);
    expect(validPaymentStatuses).toContain("captured");
    expect(validPaymentStatuses).toContain("failed");
    expect(validPaymentStatuses).toContain("refunded");
  });
});
