import type { LucideIcon } from "lucide-react";
import { UserCheck, FileCheck, Building2, Truck, MapPin, CreditCard } from "lucide-react";

export interface OnboardingData {
  // Step 1: Account
  email: string;
  phone: string;
  fullName: string;
  password?: string;
  confirmPassword?: string;
  // Step 2: GST
  gstNumber: string;
  panNumber: string;
  tradeName: string;
  isGstExempt: boolean;
  // Step 3: Business Details
  businessName: string;
  brandName: string;
  primaryCategory: string;
  description: string;
  // Step 4: Shipping Preferences
  shippingMode: "fitseller_pickup" | "self_ship";
  courierPartner: "bluedart" | "delhivery" | "both";
  dispatchTimeHours: "24" | "48" | "72";
  offersFreeShipping: boolean;
  // Step 5: Pickup Address
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  landmark: string;
  pickupContactName: string;
  pickupContactPhone: string;
  // Step 6: Bank Details
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

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
