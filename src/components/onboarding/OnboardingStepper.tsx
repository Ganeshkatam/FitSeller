import { Check, Lock } from "lucide-react";
import { ONBOARDING_STEPS } from "./OnboardingTypes";

interface StepperProps {
  currentStep: number;
  onSelectStep: (slug: string) => void;
  canAccessStep?: (stepId: number) => boolean;
  isStepFinished?: (stepId: number) => boolean;
}

export function OnboardingStepper({
  currentStep,
  onSelectStep,
  canAccessStep = () => true,
  isStepFinished = () => false,
}: StepperProps) {
  return (
    <nav aria-label="Onboarding Progress Timeline" className="w-full py-4">
      <ol className="relative flex items-start justify-between w-full">
        {ONBOARDING_STEPS.map((step, idx) => {
          const isPassed = isStepFinished(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = canAccessStep(step.id);
          const isLocked = !isAccessible;
          const isFirst = idx === 0;
          const isLast = idx === ONBOARDING_STEPS.length - 1;

          // Connector line states:
          // Left half connector: colored if this step is current or passed
          const isLeftActive = isPassed || isCurrent;
          // Right half connector: colored if this step is passed
          const isRightActive = isPassed;

          return (
            <li
              key={step.id}
              className="relative flex-1 flex flex-col items-center group"
            >
              {/* Left Connector Line */}
              {!isFirst && (
                <div
                  aria-hidden="true"
                  className={`absolute top-4 sm:top-5 left-0 right-1/2 -translate-y-1/2 h-0.5 sm:h-1 transition-colors duration-300 ${
                    isLeftActive
                      ? "bg-indigo-600 dark:bg-indigo-500"
                      : "bg-border/60 dark:bg-border/40"
                  }`}
                />
              )}

              {/* Right Connector Line */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`absolute top-4 sm:top-5 left-1/2 right-0 -translate-y-1/2 h-0.5 sm:h-1 transition-colors duration-300 ${
                    isRightActive
                      ? "bg-indigo-600 dark:bg-indigo-500"
                      : "bg-border/60 dark:bg-border/40"
                  }`}
                />
              )}

              {/* Timeline Node Button */}
              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) onSelectStep(step.slug);
                }}
                aria-current={isCurrent ? "step" : undefined}
                className={`relative z-10 flex flex-col items-center focus:outline-none transition-transform ${
                  isLocked ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"
                }`}
              >
                {/* Circle Marker */}
                <div
                  className={`size-8 sm:size-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                    isPassed
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-background"
                      : isCurrent
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35 ring-4 ring-indigo-500/20 scale-110"
                      : isLocked
                      ? "border-2 border-border/50 bg-muted/40 text-muted-foreground/40"
                      : "border-2 border-border bg-background text-muted-foreground hover:border-indigo-500 hover:text-indigo-600 ring-2 ring-background"
                  }`}
                >
                  {isPassed ? (
                    <Check className="size-4 sm:size-4.5 stroke-[2.5]" />
                  ) : isLocked ? (
                    <Lock className="size-3.5 text-muted-foreground/40" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Timeline Step Label */}
                <div className="mt-2.5 text-center px-0.5 sm:px-1 max-w-[80px] sm:max-w-[130px]">
                  <p
                    className={`text-[11px] sm:text-xs font-semibold leading-tight transition-colors truncate ${
                      isCurrent
                        ? "text-indigo-600 dark:text-indigo-400 font-bold"
                        : isPassed
                        ? "text-foreground font-medium"
                        : isLocked
                        ? "text-muted-foreground/40"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.shortTitle}</span>
                  </p>

                  <span
                    className={`hidden md:block text-[10px] mt-0.5 transition-colors ${
                      isCurrent
                        ? "text-indigo-600/80 dark:text-indigo-400/80 font-medium"
                        : isPassed
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : isLocked
                        ? "text-muted-foreground/30"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {isPassed
                      ? "Done"
                      : isCurrent
                      ? "In Progress"
                      : isLocked
                      ? "Locked"
                      : step.subtitle}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
