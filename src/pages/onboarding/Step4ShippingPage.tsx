import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Step4Shipping } from "@/components/onboarding/Step4Shipping";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";

export default function Step4ShippingPage() {
  const { user } = useAuth();
  const { formData, updateField } = useOnboarding();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/onboarding/step-5");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    navigate("/onboarding/step-3");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Step4Shipping data={formData} onChange={updateField} />

      <OnboardingNavigation
        currentStep={4}
        loading={false}
        isUserAuthenticated={!!user}
        onBack={handleBack}
      />
    </form>
  );
}
