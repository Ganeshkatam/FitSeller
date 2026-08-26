import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import type { OnboardingData } from "./OnboardingTypes";

import { STEP1_INITIAL, validateStep1 } from "./Step1Account";
import { STEP2_INITIAL, validateStep2 } from "./Step2Gst";
import { STEP3_INITIAL, validateStep3 } from "./Step3Business";
import { STEP4_INITIAL, validateStep4 } from "./Step4Shipping";
import { STEP5_INITIAL, validateStep5 } from "./Step5PickupAddress";
import { STEP6_INITIAL, validateStep6 } from "./Step6Bank";

const INITIAL_ONBOARDING_DATA: OnboardingData = {
  ...STEP1_INITIAL,
  ...STEP2_INITIAL,
  ...STEP3_INITIAL,
  ...STEP4_INITIAL,
  ...STEP5_INITIAL,
  ...STEP6_INITIAL,
};

export function useOnboardingForm() {
  const { user, seller, profile, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    ...INITIAL_ONBOARDING_DATA,
    email: user?.email || profile?.email || "",
    phone: profile?.phone || "",
    fullName: profile?.full_name || profile?.display_name || "",
    tradeName: seller?.business_name || "",
    businessName: seller?.business_name || "",
    pickupContactName: profile?.full_name || "",
    pickupContactPhone: profile?.phone || "",
    accountHolderName: profile?.full_name || "",
  });

  // Synchronize normal user profile data once authenticated
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
      }));
    }
  }, [user, profile]);

  function updateField<K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext(e?: FormEvent) {
    if (e) e.preventDefault();

    // Global guard: a valid normal user account is required before any step can proceed
    if (!user) {
      toast(
        "error",
        "A normal user account is required first. Please create your user account or sign in."
      );
      if (currentStep !== 1) setCurrentStep(1);
      return;
    }

    // Delegate step validation to each step's dedicated validator
    let error: string | null = null;
    if (currentStep === 1) {
      error = validateStep1(formData, !!user);
    } else if (currentStep === 2) {
      error = validateStep2(formData);
    } else if (currentStep === 3) {
      error = validateStep3(formData);
    } else if (currentStep === 4) {
      error = validateStep4(formData);
    } else if (currentStep === 5) {
      error = validateStep5(formData);
    } else if (currentStep === 6) {
      error = validateStep6(formData);
    }

    if (error) {
      toast("error", error);
      return;
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finishOnboarding();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function finishOnboarding() {
    // 1. Strict guard: A valid normal user account MUST exist
    if (!user?.id) {
      toast(
        "error",
        "A valid normal user account is required before a seller account can be created. Please complete Step 1 first."
      );
      setCurrentStep(1);
      return;
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
        setCurrentStep(1);
        return;
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

      setCompleted(true);
      toast("success", "Seller account configuration completed successfully!");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err: unknown) {
      await refreshAuth();
      const message =
        err instanceof Error ? err.message : "Failed to create seller account.";
      toast("error", message);
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    seller,
    profile,
    currentStep,
    setCurrentStep,
    loading,
    completed,
    formData,
    updateField,
    handleNext,
    handleBack,
  };
}
