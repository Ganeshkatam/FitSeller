import { Check } from "lucide-react";
import { ONBOARDING_STEPS } from "./OnboardingTypes";

interface StepperProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
}

export function OnboardingStepper({ currentStep, onSelectStep }: StepperProps) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {ONBOARDING_STEPS.map((step) => {
        const Icon = step.icon;
        const isPassed = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelectStep(step.id)}
            className={`text-left rounded-2xl border p-2.5 sm:p-3.5 transition-all flex flex-col justify-between ${
              isCurrent
                ? "border-indigo-600 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                : isPassed
                ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                : "border-border/60 bg-card/50 opacity-60 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div
                className={`flex size-7 items-center justify-center rounded-lg text-xs font-bold ${
                  isCurrent
                    ? "bg-indigo-600 text-white"
                    : isPassed
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isPassed ? <Check className="size-3.5" /> : step.id}
              </div>
              <Icon
                className={`size-4 hidden sm:block ${
                  isCurrent
                    ? "text-indigo-600"
                    : isPassed
                    ? "text-emerald-600"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-[11px] sm:text-xs font-bold truncate ${
                  isCurrent
                    ? "text-indigo-600 dark:text-indigo-400"
                    : isPassed
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground"
                }`}
              >
                {step.title}
              </p>
              <p className="text-[10px] text-muted-foreground truncate hidden md:block mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
