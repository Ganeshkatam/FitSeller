import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useToast } from "@/components/ui/Toast";
import { Step5PickupAddress, validateStep5 } from "@/components/onboarding/Step5PickupAddress";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";

export default function Step5PickupAddressPage() {
  const { user } = useAuth();
  const { formData, updateField } = useOnboarding();
  const navigate = useNavigate();
  const toast = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateStep5(formData);
    if (error) {
      toast("error", error);
      return;
    }
    navigate("/onboarding/bank");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    navigate("/onboarding/shipping");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Step5PickupAddress data={formData} onChange={updateField} />

      <OnboardingNavigation
        currentStep={5}
        loading={false}
        isUserAuthenticated={!!user}
        onBack={handleBack}
      />
    </form>
  );
}
