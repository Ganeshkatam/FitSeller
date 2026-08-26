import { Input, Label } from "@/components/ui/Field";
import type { OnboardingData } from "./OnboardingTypes";

interface StepProps {
  data: OnboardingData;
  onChange: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

export function Step1Account({ data, onChange }: StepProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <span>Step 1 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Seller Account Creation
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Confirm your primary seller contact details and credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <Label htmlFor="fullName">Full Name / Primary Contact</Label>
          <Input
            id="fullName"
            type="text"
            required
            placeholder="e.g. Rajesh Singhal"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="phone">Mobile Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="email">Registered Seller Email</Label>
          <Input
            id="email"
            type="email"
            disabled
            value={data.email}
            className="mt-1.5 h-11 rounded-xl bg-muted/40 text-muted-foreground"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Linked to your authenticated user account.
          </p>
        </div>
      </div>
    </div>
  );
}
