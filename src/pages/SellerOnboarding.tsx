import { useToast } from "@/components/ui/Toast";
import { useOnboardingForm } from "@/components/onboarding/useOnboardingForm";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";
import { OnboardingSuccess } from "@/components/onboarding/OnboardingSuccess";

import { Step1Account } from "@/components/onboarding/Step1Account";
import { Step2Gst } from "@/components/onboarding/Step2Gst";
import { Step3Business } from "@/components/onboarding/Step3Business";
import { Step4Shipping } from "@/components/onboarding/Step4Shipping";
import { Step5PickupAddress } from "@/components/onboarding/Step5PickupAddress";
import { Step6Bank } from "@/components/onboarding/Step6Bank";

export default function SellerOnboarding() {
  const toast = useToast();
  const {
    user,
    seller,
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
  } = useOnboardingForm();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500/20">
      {/* Top Header */}
      <OnboardingHeader currentStep={currentStep} seller={seller} />

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
            <OnboardingSuccess />
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
              <OnboardingNavigation
                currentStep={currentStep}
                loading={loading}
                isUserAuthenticated={!!user}
                onBack={handleBack}
              />
            </form>
          )}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-border/80 bg-card/40 py-4 text-center text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} FitSeller Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
