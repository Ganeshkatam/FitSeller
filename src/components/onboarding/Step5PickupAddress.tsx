import { Input, Label } from "@/components/ui/Field";
import type { OnboardingData } from "./OnboardingTypes";

interface StepProps {
  data: OnboardingData;
  onChange: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  onPincodeChange: (pincode: string) => void;
}

export function Step5PickupAddress({ data, onChange, onPincodeChange }: StepProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <span>Step 5 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Pickup Address
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Where courier partners will arrive to collect packaged clothing orders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="sm:col-span-3">
          <Label htmlFor="addressLine1">Address Line 1 (Building, Street, Unit Number)</Label>
          <Input
            id="addressLine1"
            type="text"
            required
            placeholder="e.g. Unit 402, Lotus Fashion Park, Linking Road"
            value={data.addressLine1}
            onChange={(e) => onChange("addressLine1", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div className="sm:col-span-3">
          <Label htmlFor="addressLine2">Address Line 2 (Area, Landmark)</Label>
          <Input
            id="addressLine2"
            type="text"
            placeholder="e.g. Near National College, Bandra West"
            value={data.addressLine2}
            onChange={(e) => onChange("addressLine2", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="pincode">Pincode (6 Digits)</Label>
          <Input
            id="pincode"
            type="text"
            required
            maxLength={6}
            placeholder="e.g. 400050"
            value={data.pincode}
            onChange={(e) => onPincodeChange(e.target.value)}
            className="mt-1.5 h-11 rounded-xl font-mono"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            required
            placeholder="e.g. Mumbai"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            required
            placeholder="e.g. Maharashtra"
            value={data.state}
            onChange={(e) => onChange("state", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="contactName">Pickup Contact Person</Label>
          <Input
            id="contactName"
            type="text"
            placeholder="e.g. Rajesh (Dispatch Manager)"
            value={data.pickupContactName}
            onChange={(e) => onChange("pickupContactName", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="contactPhone">Pickup Contact Mobile</Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="e.g. +91 98765 00000"
            value={data.pickupContactPhone}
            onChange={(e) => onChange("pickupContactPhone", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
