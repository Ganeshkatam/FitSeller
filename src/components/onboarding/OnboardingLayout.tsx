import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingStepper } from "./OnboardingStepper";
import { OnboardingSuccess } from "./OnboardingSuccess";

import { ONBOARDING_STEPS } from "./OnboardingTypes";

function OnboardingContent() {
  const { user, seller } = useAuth();
  const { completed } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active step slug from pathname (e.g. /onboarding/shipping -> "shipping")
  const activeSlug = location.pathname.split("/").pop() || "account";
  const matchedStep = ONBOARDING_STEPS.find((s) => s.slug === activeSlug);
  const currentStep = matchedStep ? matchedStep.id : 1;

  // Guard: if someone visits any subsequent step without a normal user account, redirect to /onboarding/account
  if (!user && currentStep > 1) {
    return <Navigate to="/onboarding/account" replace />;
  }

  function handleSelectStep(slug: string) {
    const targetStep = ONBOARDING_STEPS.find((s) => s.slug === slug);
    if (!user && targetStep && targetStep.id > 1) {
      return;
    }
    navigate(`/onboarding/${slug}`);
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
