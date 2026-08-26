import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shirt,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

import type { OnboardingData } from "@/components/onboarding/OnboardingTypes";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { Step1Account } from "@/components/onboarding/Step1Account";
import { Step2Gst } from "@/components/onboarding/Step2Gst";
import { Step3Business } from "@/components/onboarding/Step3Business";
import { Step4Shipping } from "@/components/onboarding/Step4Shipping";
import { Step5PickupAddress } from "@/components/onboarding/Step5PickupAddress";
import { Step6Bank } from "@/components/onboarding/Step6Bank";

export default function SellerOnboarding() {
  const { user, seller, profile, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    // Step 1
    email: user?.email || profile?.email || "",
    phone: profile?.phone || "",
    fullName: profile?.full_name || profile?.display_name || "",
    // Step 2
    gstNumber: "",
    panNumber: "",
    tradeName: seller?.business_name || "",
    isGstExempt: false,
    // Step 3
    businessName: seller?.business_name || "",
    brandName: "",
    primaryCategory: "Men's Casual & Streetwear",
    description: "",
    // Step 4
    shippingMode: "fitseller_pickup",
    courierPartner: "both",
    dispatchTimeHours: "24",
    offersFreeShipping: true,
    // Step 5
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    state: "",
    landmark: "",
    pickupContactName: profile?.full_name || "",
    pickupContactPhone: profile?.phone || "",
    // Step 6
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accountHolderName: profile?.full_name || "",
    bankName: "",
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

  function updateField<K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) {
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
      if (!formData.isGstExempt && formData.gstNumber.trim().length > 0 && formData.gstNumber.trim().length < 15) {
        toast("error", "Please enter a valid 15-character GSTIN or check the exemption box.");
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
      if (formData.accountNumber && formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber) {
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500/20">
      {/* Top Header */}
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Shirt className="size-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-foreground text-lg">FitSeller</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                6-STEP SELLER ONBOARDING
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground font-medium hidden sm:inline">
              Step <strong className="text-foreground">{currentStep}</strong> of 6
            </span>
            {seller?.id ? (
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Go to Dashboard &rarr;
              </Link>
            ) : (
              <span className="text-[11px] font-semibold text-muted-foreground">
                Seller Registration
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-8 py-8 sm:py-12 my-auto">
        {/* Step Progress Tracker */}
        <div className="mb-10">
          <OnboardingStepper
            currentStep={currentStep}
            onSelectStep={(stepId) => setCurrentStep(stepId)}
            isUserAuthenticated={!!user}
          />
        </div>

        {/* Active Step Form Card */}
        <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl p-6 sm:p-10 shadow-xl shadow-zinc-950/5 dark:shadow-black/20">
          {completed ? (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Seller Account Ready
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                All 6 registration steps have been saved. Taking you to your seller dashboard…
              </p>
            </div>
          ) : (
            <form onSubmit={handleNext} className="space-y-8">
              {currentStep === 1 && (
                <Step1Account
                  data={formData}
                  onChange={updateField}
                  onAuthenticated={() => {
                    toast("success", "User account authenticated successfully!");
                    setCurrentStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}

              {currentStep === 2 && (
                <Step2Gst
                  data={formData}
                  onChange={updateField}
                  onGstChange={handleGstChange}
                />
              )}

              {currentStep === 3 && (
                <Step3Business data={formData} onChange={updateField} />
              )}

              {currentStep === 4 && (
                <Step4Shipping data={formData} onChange={updateField} />
              )}

              {currentStep === 5 && (
                <Step5PickupAddress
                  data={formData}
                  onChange={updateField}
                  onPincodeChange={handlePincodeChange}
                />
              )}

              {currentStep === 6 && (
                <Step6Bank data={formData} onChange={updateField} />
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-border/80">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="font-bold text-xs rounded-xl h-11 px-5"
                  >
                    <ArrowLeft className="size-3.5 mr-1.5" />
                    <span>Back</span>
                  </Button>
                ) : (
                  <div />
                )}

                {/* Hide generic next button when unauthenticated on step 1 (Step 1 has its own dedicated auth action) */}
                {!(currentStep === 1 && !user) && (
                  <Button
                    type="submit"
                    loading={loading}
                    className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-7 shadow-lg shadow-indigo-600/30 text-sm"
                  >
                    <span>
                      {currentStep === 6
                        ? "Complete Seller Registration"
                        : currentStep === 1
                        ? "Proceed to GST Verification"
                        : `Next: Step ${currentStep + 1}`}
                    </span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/60 backdrop-blur-md py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Lock className="size-3 text-emerald-600" />
            <span>Safe &amp; Protected Seller Registration</span>
          </div>
          <span className="text-[11px]">&copy; {new Date().getFullYear()} FitSeller</span>
        </div>
      </footer>
    </div>
  );
}
