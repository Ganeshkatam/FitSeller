import { CheckCircle2 } from "lucide-react";

export function OnboardingSuccess() {
  return (
    <div className="text-center py-10 space-y-4 animate-fadeIn">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-500/10">
        <CheckCircle2 className="size-8" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Seller Account Ready
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        All 6 registration steps have been saved and your seller profile is activated. Taking you to your seller dashboard…
      </p>
    </div>
  );
}
