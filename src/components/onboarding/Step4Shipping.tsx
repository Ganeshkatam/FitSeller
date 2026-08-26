import { Truck, Building2 } from "lucide-react";
import { Label } from "@/components/ui/Field";
import type { Step4ShippingData } from "./OnboardingTypes";

interface Step4Props {
  data: Step4ShippingData;
  onChange: (field: any, value: any) => void;
}

export function Step4Shipping({ data, onChange }: Step4Props) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <span>Step 4 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Shipping Preferences
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose how customer clothing orders are picked up and dispatched.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Doorstep Pickup */}
        <div
          onClick={() => onChange("shippingMode", "fitseller_pickup")}
          className={`rounded-2xl border p-5 cursor-pointer transition-all space-y-2 ${
            data.shippingMode === "fitseller_pickup"
              ? "border-indigo-600 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="size-5 text-indigo-600" />
              <span className="font-bold text-foreground text-sm">Doorstep Courier Pickup</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-full">
              Recommended
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            BlueDart and Delhivery pick up orders directly from your address. 1-click prepaid shipping labels.
          </p>
        </div>

        {/* Self-Ship */}
        <div
          onClick={() => onChange("shippingMode", "self_ship")}
          className={`rounded-2xl border p-5 cursor-pointer transition-all space-y-2 ${
            data.shippingMode === "self_ship"
              ? "border-indigo-600 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-indigo-600" />
              <span className="font-bold text-foreground text-sm">Self-Ship Dispatch</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ship orders using your own preferred local logistics carrier and upload tracking numbers manually.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <Label htmlFor="dispatchTime">Order Handling &amp; Dispatch Time</Label>
          <select
            id="dispatchTime"
            value={data.dispatchTimeHours}
            onChange={(e) =>
              onChange("dispatchTimeHours", e.target.value as "24" | "48" | "72")
            }
            className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="24">Within 24 Hours (Fastest delivery badge)</option>
            <option value="48">Within 48 Hours (Standard)</option>
            <option value="72">Within 72 Hours (Custom / Made-to-order)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="courierPref">Preferred Courier Network</Label>
          <select
            id="courierPref"
            value={data.courierPartner}
            onChange={(e) =>
              onChange("courierPartner", e.target.value as "bluedart" | "delhivery" | "both")
            }
            className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="both">Both BlueDart &amp; Delhivery (Fastest routing)</option>
            <option value="bluedart">BlueDart Express Only</option>
            <option value="delhivery">Delhivery Surface &amp; Express</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 flex items-center justify-between text-xs">
        <div className="space-y-0.5">
          <p className="font-bold text-foreground">Provide Free Nationwide Shipping</p>
          <p className="text-muted-foreground">
            Sellers offering free shipping convert 3.2x more fashion shoppers.
          </p>
        </div>
        <input
          type="checkbox"
          checked={data.offersFreeShipping}
          onChange={(e) => onChange("offersFreeShipping", e.target.checked)}
          className="size-5 rounded border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>
    </div>
  );
}

export const STEP4_INITIAL: Step4ShippingData = {
  shippingMode: "fitseller_pickup",
  courierPartner: "both",
  dispatchTimeHours: "24",
  offersFreeShipping: true,
};

export function validateStep4(_data: Step4ShippingData): string | null {
  return null; // Step 4 options always default to valid selections
}
