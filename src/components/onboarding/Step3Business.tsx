import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPAREL_CATEGORIES, type Step3BusinessData } from "./OnboardingTypes";

interface Step3Props {
  data: Step3BusinessData;
  onChange: (field: any, value: any) => void;
}

export function Step3Business({ data, onChange }: Step3Props) {
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
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-xs font-semibold text-foreground">
            Seller Display Name
          </Label>
          <Input
            id="businessName"
            type="text"
            required
            placeholder="e.g. Aura Linen Wear"
            value={data.businessName}
            onChange={(e) => onChange("businessName", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandName" className="text-xs font-semibold text-foreground">
            Clothing Brand Name (Optional)
          </Label>
          <Input
            id="brandName"
            type="text"
            placeholder="e.g. Aura Studio"
            value={data.brandName}
            onChange={(e) => onChange("brandName", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="primaryCategory" className="text-xs font-semibold text-foreground">
            Primary Clothing Category
          </Label>
          <Select
            value={data.primaryCategory}
            onValueChange={(val) => onChange("primaryCategory", val)}
          >
            <SelectTrigger id="primaryCategory" className="w-full h-11 rounded-xl text-sm">
              <SelectValue placeholder="Select primary category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {APPAREL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold text-foreground">
            Short Brand Description (Optional)
          </Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="e.g. Crafted pure linen shirts, blazers, and dresses made with sustainable organic fabrics."
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full rounded-xl p-3 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export const STEP3_INITIAL: Step3BusinessData = {
  businessName: "",
  brandName: "",
  primaryCategory: "Men's Casual & Streetwear",
  description: "",
};

export function validateStep3(data: Step3BusinessData): string | null {
  if (!data.businessName.trim()) {
    return "Please enter your registered business or brand name.";
  }
  return null;
}
