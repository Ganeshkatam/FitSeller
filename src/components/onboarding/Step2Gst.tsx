import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import type { Step2GstData } from "./OnboardingTypes";

interface Step2Props {
  data: Step2GstData;
  onChange: (field: any, value: any) => void;
}

export function extractPanFromGst(gst: string): string {
  const clean = gst.toUpperCase().trim();
  if (clean.length === 15) {
    return clean.substring(2, 12);
  }
  return "";
}

export function Step2Gst({ data, onChange }: Step2Props) {
  function handleGstInput(value: string) {
    const cleanGst = value.toUpperCase().trim();
    onChange("gstNumber", cleanGst);
    if (cleanGst.length === 15) {
      const pan = extractPanFromGst(cleanGst);
      if (pan) {
        onChange("panNumber", pan);
      }
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <span>Step 2 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          GST Verification
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter your GST number for automated tax invoicing and customer orders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="gstNumber" className="text-xs font-semibold text-foreground">
            GST Number (15 Characters)
          </Label>
          <Input
            id="gstNumber"
            type="text"
            maxLength={15}
            placeholder="e.g. 27AAAAA0000A1Z5"
            value={data.gstNumber}
            onChange={(e) => handleGstInput(e.target.value)}
            className="h-11 rounded-xl font-mono uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="panNumber" className="text-xs font-semibold text-foreground">
            Business PAN Card
          </Label>
          <Input
            id="panNumber"
            type="text"
            maxLength={10}
            placeholder="e.g. AAAAA0000A"
            value={data.panNumber}
            onChange={(e) => onChange("panNumber", e.target.value.toUpperCase())}
            className="h-11 rounded-xl font-mono uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradeName" className="text-xs font-semibold text-foreground">
            Registered Legal Entity Name
          </Label>
          <Input
            id="tradeName"
            type="text"
            placeholder="e.g. Sharma Apparels Pvt Ltd"
            value={data.tradeName}
            onChange={(e) => onChange("tradeName", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <Card className="rounded-2xl border-indigo-500/20 bg-indigo-500/5 shadow-none">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="font-bold text-foreground text-xs sm:text-sm">
              Selling under GST exemption?
            </p>
            <p className="text-xs text-muted-foreground">
              Applies to artisanal handloom weavers and regional craft producers under ₹20 Lakh turnover.
            </p>
          </div>
          <Checkbox
            id="isGstExempt"
            checked={data.isGstExempt}
            onCheckedChange={(checked) => onChange("isGstExempt", !!checked)}
            className="size-5 rounded-md border-border text-indigo-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 cursor-pointer"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export const STEP2_INITIAL: Step2GstData = {
  gstNumber: "",
  panNumber: "",
  tradeName: "",
  isGstExempt: false,
};

export function validateStep2(data: Step2GstData): string | null {
  if (data.isGstExempt) {
    return null;
  }
  if (!data.gstNumber.trim()) {
    return "Please enter your 15-character GSTIN or check the exemption box.";
  }
  if (data.gstNumber.trim().length !== 15) {
    return "GSTIN must be exactly 15 characters.";
  }
  return null;
}
