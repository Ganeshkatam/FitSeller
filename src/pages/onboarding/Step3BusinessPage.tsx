import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useToast } from "@/components/ui/Toast";
import { Step3Business, validateStep3 } from "@/components/onboarding/Step3Business";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";

export default function Step3BusinessPage() {
  const { user } = useAuth();
  const { formData, updateField } = useOnboarding();
  const navigate = useNavigate();
  const toast = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateStep3(formData);
    if (error) {
      toast("error", error);
      return;
    }
    navigate("/onboarding/step-4");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    navigate("/onboarding/step-2");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Step3Business data={formData} onChange={updateField} />

      <OnboardingNavigation
        currentStep={3}
        loading={false}
        isUserAuthenticated={!!user}
        onBack={handleBack}
      />
    </form>
  );
}
