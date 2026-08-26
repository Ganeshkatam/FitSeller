import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingStepper } from "./OnboardingStepper";
import { OnboardingSuccess } from "./OnboardingSuccess";

function OnboardingContent() {
  const { user, seller } = useAuth();
  const { completed } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active step number from pathname (e.g. /onboarding/step-3 -> 3)
  const match = location.pathname.match(/step-(\d)/);
  const currentStep = match ? parseInt(match[1], 10) : 1;

  // Guard: if someone visits /onboarding/step-2 through step-6 without a normal user account, redirect to step-1
  if (!user && currentStep > 1) {
    return <Navigate to="/onboarding/step-1" replace />;
  }

  function handleSelectStep(stepId: number) {
    if (!user && stepId > 1) {
      return;
    }
    navigate(`/onboarding/step-${stepId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
            onSelectStep={handleSelectStep}
            isUserAuthenticated={!!user}
          />
        </div>

        {/* Active Step Route Outlet Card */}
        <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl p-6 sm:p-10 shadow-xl shadow-zinc-950/5 dark:shadow-black/20">
          {completed ? <OnboardingSuccess /> : <Outlet />}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-border/80 bg-card/40 py-4 text-center text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} FitSeller Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}

export function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
