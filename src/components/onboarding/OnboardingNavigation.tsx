import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingNavigationProps {
  currentStep: number;
  loading: boolean;
  isUserAuthenticated: boolean;
  onBack: () => void;
}

export function OnboardingNavigation({
  currentStep,
  loading,
  isUserAuthenticated,
  onBack,
}: OnboardingNavigationProps) {
  // When unauthenticated on Step 1, Step 1 provides its own dedicated action
  if (currentStep === 1 && !isUserAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border/80">
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="font-bold text-xs rounded-xl h-11 px-5"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back</span>
        </Button>
      ) : (
        <div />
      )}

      <Button
        type="submit"
        loading={loading}
        className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-7 shadow-lg shadow-indigo-600/30 text-sm"
      >
        <span>
          {currentStep === 6
            ? "Complete Seller Registration"
            : currentStep === 1
            ? "Proceed to GST Verification"
            : `Next: Step ${currentStep + 1}`}
        </span>
        <ArrowRight className="size-4 ml-1.5" />
      </Button>
    </div>
  );
}
