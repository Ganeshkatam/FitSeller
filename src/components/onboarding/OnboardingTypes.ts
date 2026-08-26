import type { LucideIcon } from "lucide-react";
import {
  UserCheck,
  FileCheck,
  Building2,
  Truck,
  MapPin,
  CreditCard,
} from "lucide-react";

// ============================================================================
// STEP-SPECIFIC DATA INTERFACES
// ============================================================================

export interface Step1AccountData {
  email: string;
  phone: string;
  fullName: string;
  password?: string;
  confirmPassword?: string;
}

export interface Step2GstData {
  gstNumber: string;
  panNumber: string;
  tradeName: string;
  isGstExempt: boolean;
}

export interface Step3BusinessData {
  businessName: string;
  brandName: string;
  primaryCategory: string;
  description: string;
}

export interface Step4ShippingData {
  shippingMode: "fitseller_pickup" | "self_ship";
  courierPartner: "bluedart" | "delhivery" | "both";
  dispatchTimeHours: "24" | "48" | "72";
  offersFreeShipping: boolean;
}

export interface Step5PickupAddressData {
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  landmark: string;
  pickupContactName: string;
  pickupContactPhone: string;
}

export interface Step6BankData {
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

// Composite type for the overall onboarding form
export type OnboardingData = Step1AccountData &
  Step2GstData &
  Step3BusinessData &
  Step4ShippingData &
  Step5PickupAddressData &
  Step6BankData;

// ============================================================================
// STEPPER DEFINITION & CATEGORIES
// ============================================================================

export interface StepItem {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export const ONBOARDING_STEPS: StepItem[] = [
  { id: 1, title: "Seller Account", subtitle: "Basic Credentials", icon: UserCheck },
  { id: 2, title: "GST Verification", subtitle: "Tax & PAN Details", icon: FileCheck },
  { id: 3, title: "Business Details", subtitle: "Brand & Categories", icon: Building2 },
  { id: 4, title: "Shipping Preferences", subtitle: "Courier & Timelines", icon: Truck },
  { id: 5, title: "Pickup Address", subtitle: "Warehouse Location", icon: MapPin },
  { id: 6, title: "Bank Details", subtitle: "Daily Payout Account", icon: CreditCard },
];

export const APPAREL_CATEGORIES = [
  "Women's Ethnic & Sarees",
  "Men's Casual & Streetwear",
  "Designer & Premium Wear",
  "Linen & Handloom Collections",
  "Activewear & Loungewear",
  "Kids & Teens Fashion",
  "Accessories & Footwear",
];
