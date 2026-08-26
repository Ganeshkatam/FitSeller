import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useToast } from "@/components/ui/Toast";
import { Step2Gst, validateStep2 } from "@/components/onboarding/Step2Gst";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";

export default function Step2GstPage() {
  const { user } = useAuth();
  const { formData, updateField } = useOnboarding();
  const navigate = useNavigate();
  const toast = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateStep2(formData);
    if (error) {
      toast("error", error);
      return;
    }
    navigate("/onboarding/step-3");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    navigate("/onboarding/step-1");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Step2Gst data={formData} onChange={updateField} />

      <OnboardingNavigation
        currentStep={2}
        loading={false}
        isUserAuthenticated={!!user}
        onBack={handleBack}
      />
    </form>
  );
}
