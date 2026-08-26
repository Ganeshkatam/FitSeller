import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingStepper } from "./OnboardingStepper";
import { OnboardingSuccess } from "./OnboardingSuccess";
import { Card, CardContent } from "@/components/ui/card";
import { ONBOARDING_STEPS } from "./OnboardingTypes";

function OnboardingContent() {
  const { seller } = useAuth();
  const {
    completed,
    canAccessStep,
    isStepFinished,
    getFirstIncompleteStepSlug,
  } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active step slug from pathname (e.g. /onboarding/shipping -> "shipping")
  const activeSlug = location.pathname.split("/").pop() || "account";
  const matchedStep = ONBOARDING_STEPS.find((s) => s.slug === activeSlug);
  const currentStep = matchedStep ? matchedStep.id : 1;

  // Strict Sequential Guard: Next step is not allowed until the previous step is finished!
  if (!canAccessStep(currentStep)) {
    const fallbackSlug = getFirstIncompleteStepSlug();
    return <Navigate to={`/onboarding/${fallbackSlug}`} replace />;
  }

  function handleSelectStep(slug: string) {
    const targetStep = ONBOARDING_STEPS.find((s) => s.slug === slug);
    if (!targetStep || !canAccessStep(targetStep.id)) {
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
      <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-3 sm:py-5 my-auto">
        {/* Step Progress Tracker */}
        <div className="mb-3 sm:mb-4">
          <OnboardingStepper
            currentStep={currentStep}
            onSelectStep={handleSelectStep}
            canAccessStep={canAccessStep}
            isStepFinished={isStepFinished}
          />
        </div>

        {/* Active Step Route Outlet Card */}
        <Card className="rounded-2xl border-border/80 bg-card/90 backdrop-blur-2xl shadow-lg shadow-zinc-950/5 dark:shadow-black/20 overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            {completed ? <OnboardingSuccess /> : <Outlet />}
          </CardContent>
        </Card>
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-border/80 bg-card/40 py-2.5 text-center text-xs text-muted-foreground">
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
