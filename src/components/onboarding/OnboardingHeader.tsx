import { Link } from "react-router-dom";
import { Shirt } from "lucide-react";
import type { Seller } from "@/types";

interface OnboardingHeaderProps {
  currentStep: number;
  seller: Seller | null;
}

export function OnboardingHeader({ currentStep, seller }: OnboardingHeaderProps) {
  return (
    <header className="border-b border-border/80 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Shirt className="size-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-foreground text-lg">
              FitSeller
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              6-STEP SELLER ONBOARDING
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground font-medium hidden sm:inline">
            Step <strong className="text-foreground">{currentStep}</strong> of 6
          </span>
          {seller?.id ? (
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <span className="text-[11px] font-semibold text-muted-foreground">
              Seller Registration
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
