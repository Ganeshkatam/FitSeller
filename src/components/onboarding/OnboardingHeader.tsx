import { Link } from "react-router-dom";
import { Shirt } from "lucide-react";
import type { Seller } from "@/types";

interface OnboardingHeaderProps {
  currentStep: number;
  seller: Seller | null;
}

export function OnboardingHeader({ seller }: OnboardingHeaderProps) {
  return (
    <header className="border-b border-border/80 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex h-13 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Shirt className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-foreground text-base sm:text-lg">
            FitSeller
          </span>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          {seller?.id ? (
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <span className="text-[11px] font-medium text-muted-foreground">
              Seller Registration
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
