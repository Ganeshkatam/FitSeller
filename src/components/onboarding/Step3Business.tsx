import { Input, Label } from "@/components/ui/Field";
import { APPAREL_CATEGORIES, type OnboardingData } from "./OnboardingTypes";

interface StepProps {
  data: OnboardingData;
  onChange: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
}

export function Step3Business({ data, onChange }: StepProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <span>Step 3 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Business &amp; Brand Details
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tell fashion shoppers about your clothing label and main categories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <Label htmlFor="businessName">Seller Display Name</Label>
          <Input
            id="businessName"
            type="text"
            required
            placeholder="e.g. Aura Linen Wear"
            value={data.businessName}
            onChange={(e) => onChange("businessName", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="brandName">Clothing Brand Name (Optional)</Label>
          <Input
            id="brandName"
            type="text"
            placeholder="e.g. Aura Studio"
            value={data.brandName}
            onChange={(e) => onChange("brandName", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="primaryCategory">Primary Clothing Category</Label>
          <select
            id="primaryCategory"
            value={data.primaryCategory}
            onChange={(e) => onChange("primaryCategory", e.target.value)}
            className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {APPAREL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Short Brand Description (Optional)</Label>
          <textarea
            id="description"
            rows={3}
            placeholder="e.g. Crafted pure linen shirts, blazers, and dresses made with sustainable organic fabrics."
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
