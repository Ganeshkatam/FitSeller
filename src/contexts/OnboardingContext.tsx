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
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, seller, profile, refreshAuth } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Initialize from sessionStorage if available, else defaults
  const [formData, setFormData] = useState<OnboardingData>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_ONBOARDING_DATA, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore sessionStorage read errors
    }
    return DEFAULT_ONBOARDING_DATA;
  });

  // Keep draft persisted in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
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

    setLoading(true);
    try {
      // 2. Verify normal user profile exists in database
      const { data: userProfile, error: profileErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileErr || !userProfile) {
        toast(
          "error",
          "Cannot create seller account: No valid normal user profile found. Please re-authenticate your user account."
        );
        return false;
      }

      const businessName =
        formData.businessName.trim() || formData.tradeName.trim() || "Seller";

      if (seller?.id) {
        await supabase
          .from("sellers")
          .update({
            business_name: businessName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", seller.id);
      } else {
        const { error: insertSellerErr } = await supabase
          .from("sellers")
          .insert({
            profile_id: user.id,
            business_email: user.email || formData.email.trim(),
            business_name: businessName,
            status: "active",
          });

        if (insertSellerErr) {
          throw insertSellerErr;
        }
      }

      await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          role: "seller",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

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

  return (
    <OnboardingContext.Provider
      value={{
        formData,
        updateField,
        submitOnboarding,
        loading,
        completed,
        clearDraft,
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
