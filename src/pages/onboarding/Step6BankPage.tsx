import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useToast } from "@/components/ui/Toast";
import { Step6Bank, validateStep6 } from "@/components/onboarding/Step6Bank";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";

export default function Step6BankPage() {
  const { user } = useAuth();
  const { formData, updateField, submitOnboarding, loading } = useOnboarding();
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateStep6(formData);
    if (error) {
      toast("error", error);
      return;
    }

    const success = await submitOnboarding();
    if (success) {
      toast("success", "Seller account configuration completed successfully!");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    }
  }

  function handleBack() {
    navigate("/onboarding/pickup-address");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Step6Bank data={formData} onChange={updateField} />

      <OnboardingNavigation
        currentStep={6}
        loading={loading}
        isUserAuthenticated={!!user}
        onBack={handleBack}
      />
    </form>
  );
}
