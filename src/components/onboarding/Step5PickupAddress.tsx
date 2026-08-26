import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Step5PickupAddressData } from "./OnboardingTypes";

interface Step5Props {
  data: Step5PickupAddressData;
  onChange: (field: any, value: any) => void;
}

export function lookupCityStateFromPincode(pincode: string): { city: string; state: string } | null {
  if (pincode.length !== 6) return null;

  if (pincode.startsWith("11")) return { city: "New Delhi", state: "Delhi" };
  if (pincode.startsWith("40")) return { city: "Mumbai", state: "Maharashtra" };
  if (pincode.startsWith("56")) return { city: "Bangalore", state: "Karnataka" };
  if (pincode.startsWith("60")) return { city: "Chennai", state: "Tamil Nadu" };
  if (pincode.startsWith("70")) return { city: "Kolkata", state: "West Bengal" };
  if (pincode.startsWith("50")) return { city: "Hyderabad", state: "Telangana" };
  if (pincode.startsWith("38")) return { city: "Ahmedabad", state: "Gujarat" };
  if (pincode.startsWith("30")) return { city: "Jaipur", state: "Rajasthan" };

  return null;
}

export function Step5PickupAddress({ data, onChange }: Step5Props) {
  function handlePincodeInput(pincode: string) {
    onChange("pincode", pincode);
    const lookup = lookupCityStateFromPincode(pincode);
    if (lookup) {
      onChange("city", lookup.city);
      onChange("state", lookup.state);
    }
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Pickup Address
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Where courier partners will arrive to collect packaged clothing orders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="sm:col-span-3 space-y-1.5">
          <Label htmlFor="addressLine1" className="text-xs font-semibold text-foreground">
            Address Line 1 (Building, Street, Unit Number)
          </Label>
          <Input
            id="addressLine1"
            type="text"
            required
            placeholder="e.g. Unit 402, Lotus Fashion Park, Linking Road"
            value={data.addressLine1}
            onChange={(e) => onChange("addressLine1", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="sm:col-span-3 space-y-1.5">
          <Label htmlFor="addressLine2" className="text-xs font-semibold text-foreground">
            Address Line 2 (Area, Landmark)
          </Label>
          <Input
            id="addressLine2"
            type="text"
            placeholder="e.g. Near National College, Bandra West"
            value={data.addressLine2}
            onChange={(e) => onChange("addressLine2", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pincode" className="text-xs font-semibold text-foreground">
            Pincode (6 Digits)
          </Label>
          <Input
            id="pincode"
            type="text"
            required
            maxLength={6}
            placeholder="e.g. 400050"
            value={data.pincode}
            onChange={(e) => handlePincodeInput(e.target.value)}
            className="h-9.5 rounded-lg font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-xs font-semibold text-foreground">
            City
          </Label>
          <Input
            id="city"
            type="text"
            required
            placeholder="e.g. Mumbai"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state" className="text-xs font-semibold text-foreground">
            State
          </Label>
          <Input
            id="state"
            type="text"
            required
            placeholder="e.g. Maharashtra"
            value={data.state}
            onChange={(e) => onChange("state", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="contactName" className="text-xs font-semibold text-foreground">
            Pickup Contact Person
          </Label>
          <Input
            id="contactName"
            type="text"
            placeholder="e.g. Rajesh (Dispatch Manager)"
            value={data.pickupContactName}
            onChange={(e) => onChange("pickupContactName", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactPhone" className="text-xs font-semibold text-foreground">
            Pickup Contact Phone
          </Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={data.pickupContactPhone}
            onChange={(e) => onChange("pickupContactPhone", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export const STEP5_INITIAL: Step5PickupAddressData = {
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  landmark: "",
  pickupContactName: "",
  pickupContactPhone: "",
};

export function validateStep5(data: Step5PickupAddressData): string | null {
  if (!data.addressLine1.trim()) {
    return "Please enter your pickup address line 1.";
  }
  if (!data.pincode.trim() || data.pincode.trim().length !== 6) {
    return "Please enter a valid 6-digit pickup pincode.";
  }
  if (!data.city.trim() || !data.state.trim()) {
    return "Please enter the pickup city and state.";
  }
  return null;
}
