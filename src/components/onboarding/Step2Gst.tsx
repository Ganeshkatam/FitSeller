import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Step2GstData } from "./OnboardingTypes";

interface Step2Props {
  data: Step2GstData;
  onChange: (field: any, value: any) => void;
}

function extractPanFromGst(gst: string): string {
  const clean = gst.toUpperCase().trim();
  if (clean.length >= 12 && /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]/.test(clean)) {
    return clean.substring(2, 12);
  }
  return "";
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

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

  const isGstValid = GSTIN_REGEX.test(data.gstNumber.trim().toUpperCase());
  const isPanValid = PAN_REGEX.test(data.panNumber.trim().toUpperCase());

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          GST &amp; tax details
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tell us how your business is registered for GST.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        {/* Primary Field: GSTIN */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="gstNumber" className="text-xs font-semibold text-foreground">
              GST registration
            </Label>
            {data.isGstExempt ? (
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                GST-exempt mode
              </span>
            ) : isGstValid ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" />
                Format valid
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                Required (15 characters)
              </span>
            )}
          </div>
          <Input
            id="gstNumber"
            type="text"
            maxLength={15}
            disabled={data.isGstExempt}
            placeholder="e.g. 27AAAAA0000A1Z5"
            value={data.gstNumber}
            onChange={(e) => handleGstInput(e.target.value)}
            className="h-9.5 rounded-lg font-mono uppercase text-sm disabled:opacity-50 disabled:bg-muted/50"
          />
        </div>

        {/* Secondary 2-Column Group: PAN & Legal Entity Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="panNumber" className="text-xs font-semibold text-foreground">
                PAN
              </Label>
              {isPanValid ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Format valid
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  10 characters
                </span>
              )}
            </div>
            <Input
              id="panNumber"
              type="text"
              maxLength={10}
              placeholder="e.g. AAAAA0000A"
              value={data.panNumber}
              onChange={(e) => onChange("panNumber", e.target.value.toUpperCase())}
              className="h-9.5 rounded-lg font-mono uppercase text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="tradeName" className="text-xs font-semibold text-foreground">
                Legal entity name
              </Label>
              <span className="text-[11px] text-muted-foreground">
                As per tax records
              </span>
            </div>
            <Input
              id="tradeName"
              type="text"
              placeholder="e.g. Sharma Apparels Pvt Ltd"
              value={data.tradeName}
              onChange={(e) => onChange("tradeName", e.target.value)}
              className="h-9.5 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Exemption Selectable Card */}
        <div
          onClick={() => onChange("isGstExempt", !data.isGstExempt)}
          className={`rounded-xl border p-3 cursor-pointer transition-all ${
            data.isGstExempt
              ? "border-indigo-500/50 bg-indigo-500/5 ring-1 ring-indigo-500/20"
              : "border-border/80 bg-card hover:bg-muted/30"
          }`}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id="isGstExempt"
              checked={data.isGstExempt}
              onCheckedChange={(checked) => onChange("isGstExempt", !!checked)}
              className="mt-0.5 size-4 rounded border-border data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <div className="space-y-0.5 flex-1">
              <Label
                htmlFor="isGstExempt"
                className="text-xs font-semibold text-foreground cursor-pointer block"
              >
                My business is GST-exempt
              </Label>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Applies to artisanal weavers, craft producers, or businesses below statutory marketplace thresholds.
              </p>
              {data.isGstExempt && (
                <div className="pt-1.5 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <ShieldAlert className="size-3.5 shrink-0" />
                  <span>
                    Your business will be registered under GST-exempt guidelines. Automated invoicing will reflect exempt status.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
  const cleanGst = data.gstNumber.trim().toUpperCase();
  if (!cleanGst) {
    return "Please provide your GST number or select GST exemption.";
  }
  if (!GSTIN_REGEX.test(cleanGst)) {
    return "Please enter a valid 15-character Indian GSTIN.";
  }
  return null;
}
