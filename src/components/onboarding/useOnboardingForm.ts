import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import type { OnboardingData } from "./OnboardingTypes";

const INITIAL_ONBOARDING_DATA: OnboardingData = {
  // Step 1: Account
  email: "",
  phone: "",
  fullName: "",
  // Step 2: GST
  gstNumber: "",
  panNumber: "",
  tradeName: "",
  isGstExempt: false,
  // Step 3: Business Details
  businessName: "",
  brandName: "",
  primaryCategory: "Men's Casual & Streetwear",
  description: "",
  // Step 4: Shipping Preferences
  shippingMode: "fitseller_pickup",
  courierPartner: "both",
  dispatchTimeHours: "24",
  offersFreeShipping: true,
  // Step 5: Pickup Address
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  landmark: "",
  pickupContactName: "",
  pickupContactPhone: "",
  // Step 6: Bank Details
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  accountHolderName: "",
  bankName: "",
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

  function handlePincodeChange(pincode: string) {
    updateField("pincode", pincode);
    if (pincode.length === 6) {
      if (pincode.startsWith("11")) {
        updateField("city", "New Delhi");
        updateField("state", "Delhi");
      } else if (pincode.startsWith("40")) {
        updateField("city", "Mumbai");
        updateField("state", "Maharashtra");
      } else if (pincode.startsWith("56")) {
        updateField("city", "Bangalore");
        updateField("state", "Karnataka");
      } else if (pincode.startsWith("60")) {
        updateField("city", "Chennai");
        updateField("state", "Tamil Nadu");
      } else if (pincode.startsWith("70")) {
        updateField("city", "Kolkata");
        updateField("state", "West Bengal");
      } else if (pincode.startsWith("50")) {
        updateField("city", "Hyderabad");
        updateField("state", "Telangana");
      } else if (pincode.startsWith("38")) {
        updateField("city", "Ahmedabad");
        updateField("state", "Gujarat");
      } else if (pincode.startsWith("30")) {
        updateField("city", "Jaipur");
        updateField("state", "Rajasthan");
      }
    }
  }

  function handleGstChange(gst: string) {
    const cleanGst = gst.toUpperCase().trim();
    updateField("gstNumber", cleanGst);
    if (cleanGst.length === 15) {
      const extractedPan = cleanGst.substring(2, 12);
      updateField("panNumber", extractedPan);
    }
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

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        toast("error", "Please enter your full name.");
        return;
      }
    } else if (currentStep === 2) {
      if (
        !formData.isGstExempt &&
        formData.gstNumber.trim().length > 0 &&
        formData.gstNumber.trim().length < 15
      ) {
        toast(
          "error",
          "Please enter a valid 15-character GSTIN or check the exemption box."
        );
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.businessName.trim()) {
        toast("error", "Please enter your registered business or brand name.");
        return;
      }
    } else if (currentStep === 5) {
      if (!formData.addressLine1.trim() || !formData.pincode.trim()) {
        toast("error", "Please enter your full pickup address and pincode.");
        return;
      }
    } else if (currentStep === 6) {
      if (
        formData.accountNumber &&
        formData.confirmAccountNumber &&
        formData.accountNumber !== formData.confirmAccountNumber
      ) {
        toast("error", "Bank account numbers do not match.");
        return;
      }
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
    handlePincodeChange,
    handleGstChange,
    handleNext,
    handleBack,
  };
}
