import { describe, it, expect } from "vitest";
import {
  extractPanFromGst,
  GSTIN_REGEX,
  PAN_REGEX,
  validateStep2,
} from "../components/onboarding/Step2Gst";
import { validateStep5 } from "../components/onboarding/Step5PickupAddress";
import { validateStep6 } from "../components/onboarding/Step6Bank";
import {
  SENSITIVE_FIELDS,
  sanitizeDraftForStorage,
} from "../contexts/OnboardingContext";
import type { OnboardingData } from "../components/onboarding/OnboardingTypes";

describe("GST and Tax Format Validation", () => {
  it("validates legitimate 15-character Indian GSTIN format", () => {
    expect(GSTIN_REGEX.test("27AAAAA0000A1Z5")).toBe(true);
    expect(GSTIN_REGEX.test("29BBBBB1111B2Z8")).toBe(true);
  });

  it("rejects malformed or incomplete GSTIN formats", () => {
    expect(GSTIN_REGEX.test("INVALID_GST")).toBe(false);
    expect(GSTIN_REGEX.test("27AAAAA0000A1")).toBe(false); // short
    expect(GSTIN_REGEX.test("27AAAAA0000A1Z55")).toBe(false); // long
    expect(GSTIN_REGEX.test("")).toBe(false);
  });

  it("extracts 10-character PAN directly from 15-character GSTIN", () => {
    expect(extractPanFromGst("27AAAAA0000A1Z5")).toBe("AAAAA0000A");
    expect(PAN_REGEX.test("AAAAA0000A")).toBe(true);
    expect(extractPanFromGst("INVALID")).toBe("");
  });

  it("enforces step 2 validation logic with exemption support", () => {
    // Valid GSTIN
    expect(
      validateStep2({
        gstNumber: "27AAAAA0000A1Z5",
        panNumber: "AAAAA0000A",
        tradeName: "Sharma Apparels",
        isGstExempt: false,
      })
    ).toBeNull();

    // Exempt mode requires no GSTIN
    expect(
      validateStep2({
        gstNumber: "",
        panNumber: "AAAAA0000A",
        tradeName: "Artisanal Looms",
        isGstExempt: true,
      })
    ).toBeNull();

    // Missing GST without exemption
    expect(
      validateStep2({
        gstNumber: "",
        panNumber: "",
        tradeName: "",
        isGstExempt: false,
      })
    ).toContain("Please provide your GST number");
  });
});

describe("Bank and Payout Format Validation", () => {
  it("rejects mismatched bank account numbers", () => {
    const res = validateStep6({
      accountHolderName: "Ganesh Reddy",
      accountNumber: "1234567890",
      confirmAccountNumber: "9876543210",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
    });
    expect(res).toBe("Bank account numbers do not match.");
  });

  it("rejects IFSC codes not exactly 11 characters", () => {
    const res = validateStep6({
      accountHolderName: "Ganesh Reddy",
      accountNumber: "1234567890",
      confirmAccountNumber: "1234567890",
      ifscCode: "HDFC",
      bankName: "HDFC Bank",
    });
    expect(res).toBe("Bank IFSC code must be exactly 11 characters.");
  });

  it("passes valid bank payload", () => {
    const res = validateStep6({
      accountHolderName: "Ganesh Reddy",
      accountNumber: "1234567890",
      confirmAccountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
    });
    expect(res).toBeNull();
  });
});

describe("Pickup Address Validation", () => {
  it("rejects invalid pincodes", () => {
    const res = validateStep5({
      addressLine1: "100 Fashion Street",
      addressLine2: "",
      pincode: "1234", // 4 digits
      city: "Mumbai",
      state: "Maharashtra",
      landmark: "",
      pickupContactName: "Ganesh Reddy",
      pickupContactPhone: "+919876543210",
    });
    expect(res).toBe("Please enter a valid 6-digit pickup pincode.");
  });

  it("passes valid address and 6-digit pincode", () => {
    const res = validateStep5({
      addressLine1: "100 Fashion Street",
      addressLine2: "",
      pincode: "400001",
      city: "Mumbai",
      state: "Maharashtra",
      landmark: "",
      pickupContactName: "Ganesh Reddy",
      pickupContactPhone: "+919876543210",
    });
    expect(res).toBeNull();
  });
});

describe("Storage Sanitization and Sensitive Memory Isolation", () => {
  it("guarantees sensitive fields are excluded from client storage serialization", () => {
    const fullDraft: OnboardingData = {
      // Step 1
      email: "seller@fitseller.app",
      phone: "+919876543210",
      fullName: "Ganesh Reddy",
      password: "SuperSecretPassword123!",
      confirmPassword: "SuperSecretPassword123!",
      // Step 2
      gstNumber: "27AAAAA0000A1Z5",
      panNumber: "AAAAA0000A",
      tradeName: "Sharma Apparels",
      isGstExempt: false,
      // Step 3
      businessName: "Sharma Apparels",
      brandName: "Sharma Studio",
      primaryCategory: "Men's Casual & Streetwear",
      description: "Organic cotton apparel.",
      // Step 4
      shippingMode: "fitseller_pickup",
      courierPartner: "both",
      dispatchTimeHours: "24",
      offersFreeShipping: true,
      // Step 5
      addressLine1: "100 Fashion Street",
      addressLine2: "Suite 4B",
      pincode: "400001",
      city: "Mumbai",
      state: "Maharashtra",
      landmark: "Near Metro",
      pickupContactName: "Ganesh Reddy",
      pickupContactPhone: "+919876543210",
      // Step 6
      accountNumber: "123456789012",
      confirmAccountNumber: "123456789012",
      ifscCode: "HDFC0001234",
      accountHolderName: "Ganesh Reddy",
      bankName: "HDFC Bank",
    };

    const sanitized = sanitizeDraftForStorage(fullDraft);

    // Verify all sensitive keys are deleted
    for (const key of SENSITIVE_FIELDS) {
      expect(sanitized).not.toHaveProperty(key);
    }

    // Verify non-sensitive workflow keys remain intact
    expect(sanitized.businessName).toBe("Sharma Apparels");
    expect(sanitized.brandName).toBe("Sharma Studio");
    expect(sanitized.shippingMode).toBe("fitseller_pickup");
    expect(sanitized.courierPartner).toBe("both");
    expect(sanitized.primaryCategory).toBe("Men's Casual & Streetwear");
  });
});
