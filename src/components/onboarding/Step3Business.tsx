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
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Business details
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Set your public brand name and primary clothing catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
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
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brandName" className="text-xs font-semibold text-foreground">
            Clothing Brand Name (Optional)
          </Label>
          <Input
            id="brandName"
            type="text"
            placeholder="e.g. Aura Studio"
            value={data.brandName}
            onChange={(e) => onChange("brandName", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="primaryCategory" className="text-xs font-semibold text-foreground">
            Primary Clothing Category
          </Label>
          <Select
            value={data.primaryCategory}
            onValueChange={(val) => onChange("primaryCategory", val)}
          >
            <SelectTrigger id="primaryCategory" className="w-full h-9.5 rounded-lg text-sm">
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

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="description" className="text-xs font-semibold text-foreground">
            Short Brand Description (Optional)
          </Label>
          <Textarea
            id="description"
            rows={2}
            placeholder="e.g. Crafted pure linen shirts, blazers, and dresses made with sustainable organic fabrics."
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full rounded-lg p-2.5 text-sm min-h-16"
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
