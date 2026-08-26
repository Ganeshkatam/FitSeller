import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import type { OnboardingData } from "@/components/onboarding/OnboardingTypes";
import { STEP1_INITIAL } from "@/components/onboarding/Step1Account";
import { STEP2_INITIAL } from "@/components/onboarding/Step2Gst";
import { STEP3_INITIAL } from "@/components/onboarding/Step3Business";
import { STEP4_INITIAL } from "@/components/onboarding/Step4Shipping";
import { STEP5_INITIAL } from "@/components/onboarding/Step5PickupAddress";
import { STEP6_INITIAL } from "@/components/onboarding/Step6Bank";

import { validateStep1 } from "@/components/onboarding/Step1Account";
import { validateStep2 } from "@/components/onboarding/Step2Gst";
import { validateStep3 } from "@/components/onboarding/Step3Business";
import { validateStep4 } from "@/components/onboarding/Step4Shipping";
import { validateStep5 } from "@/components/onboarding/Step5PickupAddress";
import { validateStep6 } from "@/components/onboarding/Step6Bank";

const STORAGE_KEY = "fitseller_onboarding_draft";

const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  ...STEP1_INITIAL,
  ...STEP2_INITIAL,
  ...STEP3_INITIAL,
  ...STEP4_INITIAL,
  ...STEP5_INITIAL,
  ...STEP6_INITIAL,
};

interface OnboardingContextType {
  formData: OnboardingData;
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  submitOnboarding: () => Promise<boolean>;
  loading: boolean;
  completed: boolean;
  clearDraft: () => void;
  isStepFinished: (stepId: number) => boolean;
  canAccessStep: (stepId: number) => boolean;
  getFirstIncompleteStepSlug: () => string;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

// Sensitive fields that MUST NEVER be stored in browser storage (sessionStorage/localStorage)
const SENSITIVE_FIELDS: (keyof OnboardingData)[] = [
  "accountNumber",
  "confirmAccountNumber",
  "ifscCode",
  "gstNumber",
  "panNumber",
  "password",
  "confirmPassword",
  "addressLine1",
  "addressLine2",
  "pickupContactPhone",
];

function sanitizeDraftForStorage(data: OnboardingData): Partial<OnboardingData> {
  const safeData: Partial<OnboardingData> = { ...data };
  for (const field of SENSITIVE_FIELDS) {
    delete safeData[field];
  }
  return safeData;
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, seller, profile, refreshAuth } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Initialize non-sensitive progress from sessionStorage if available
  const [formData, setFormData] = useState<OnboardingData>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        for (const field of SENSITIVE_FIELDS) {
          delete parsed[field];
        }
        return { ...DEFAULT_ONBOARDING_DATA, ...parsed };
      }
    } catch {
      // Ignore sessionStorage read errors
    }
    return DEFAULT_ONBOARDING_DATA;
  });

  // Persist ONLY non-sensitive draft progress in sessionStorage
  useEffect(() => {
    try {
      const safeData = sanitizeDraftForStorage(formData);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    } catch {
      // Ignore quota/storage errors
    }
  }, [formData]);

  // Synchronize authenticated user/profile attributes
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        fullName:
          prev.fullName ||
          profile?.full_name ||
          profile?.display_name ||
          (user.user_metadata?.full_name as string) ||
          "",
        phone:
          prev.phone ||
          profile?.phone ||
          user.phone ||
          (user.user_metadata?.phone as string) ||
          "",
        tradeName: prev.tradeName || seller?.business_name || "",
        businessName: prev.businessName || seller?.business_name || "",
      }));
    }
  }, [user, profile, seller]);

  function updateField<K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function clearDraft() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setFormData(DEFAULT_ONBOARDING_DATA);
  }

  async function submitOnboarding(): Promise<boolean> {
    // 1. Strict guard: A normal user account MUST exist
    if (!user?.id) {
      toast(
        "error",
        "A valid normal user account is required before a seller account can be created. Please complete Step 1 first."
      );
      return false;
    }

    // 2. Pre-activation compliance validation: All 6 steps must be valid
    if (
      validateStep1(formData, true) ||
      validateStep2(formData) ||
      validateStep3(formData) ||
      validateStep4(formData) ||
      validateStep5(formData) ||
      validateStep6(formData)
    ) {
      toast(
        "error",
        "Please ensure all required onboarding steps are completed before activating your seller account."
      );
      return false;
    }

    setLoading(true);
    try {
      const businessName =
        formData.businessName.trim() || formData.tradeName.trim() || "Seller";

      // 3. Execute atomic PostgreSQL activation transaction via RPC
      const { error: rpcErr } = await supabase.rpc("activate_seller", {
        p_business_name: businessName,
        p_business_email: user.email || formData.email.trim(),
        p_full_name: formData.fullName.trim() || null,
        p_phone: formData.phone.trim() || null,
      });

      if (rpcErr) {
        throw rpcErr;
      }

      await refreshAuth();
      clearDraft();
      setCompleted(true);
      return true;
    } catch (err: unknown) {
      await refreshAuth();
      const message =
        err instanceof Error ? err.message : "Failed to create seller account.";
      toast("error", message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function isStepFinished(stepId: number): boolean {
    switch (stepId) {
      case 1:
        return !validateStep1(formData, !!user);
      case 2:
        return isStepFinished(1) && !validateStep2(formData);
      case 3:
        return isStepFinished(2) && !validateStep3(formData);
      case 4:
        return isStepFinished(3) && !validateStep4(formData);
      case 5:
        return isStepFinished(4) && !validateStep5(formData);
      case 6:
        return isStepFinished(5) && !validateStep6(formData);
      default:
        return false;
    }
  }

  function canAccessStep(stepId: number): boolean {
    if (stepId <= 1) return true;
    return isStepFinished(stepId - 1);
  }

  function getFirstIncompleteStepSlug(): string {
    if (!isStepFinished(1)) return "account";
    if (!isStepFinished(2)) return "gst";
    if (!isStepFinished(3)) return "business";
    if (!isStepFinished(4)) return "shipping";
    if (!isStepFinished(5)) return "pickup-address";
    return "bank";
  }

  return (
    <OnboardingContext.Provider
      value={{
        formData,
        updateField,
        submitOnboarding,
        loading,
        completed,
        clearDraft,
        isStepFinished,
        canAccessStep,
        getFirstIncompleteStepSlug,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
