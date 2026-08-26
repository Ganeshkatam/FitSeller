import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useToast } from "@/components/ui/Toast";
import { Step1Account, validateStep1 } from "@/components/onboarding/Step1Account";
import { OnboardingNavigation } from "@/components/onboarding/OnboardingNavigation";

export default function Step1AccountPage() {
  const { user } = useAuth();
  const { formData, updateField } = useOnboarding();
  const navigate = useNavigate();
  const toast = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateStep1(formData, !!user);
    if (error) {
      toast("error", error);
      return;
    }
    navigate("/onboarding/gst");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Step1Account
        data={formData}
        onChange={updateField}
        onAuthenticated={() => {
          toast("success", "User account authenticated successfully!");
          navigate("/onboarding/gst");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <OnboardingNavigation
        currentStep={1}
        loading={false}
        isUserAuthenticated={!!user}
        onBack={() => {}}
      />
    </form>
  );
}
