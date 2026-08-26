import { Truck, Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Step4ShippingData } from "./OnboardingTypes";

interface Step4Props {
  data: Step4ShippingData;
  onChange: (field: any, value: any) => void;
}

export function Step4Shipping({ data, onChange }: Step4Props) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Shipping Preferences
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose how customer clothing orders are picked up and dispatched.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Doorstep Pickup */}
        <div
          onClick={() => onChange("shippingMode", "fitseller_pickup")}
          className={`rounded-xl border p-3.5 cursor-pointer transition-all space-y-1.5 ${
            data.shippingMode === "fitseller_pickup"
              ? "border-indigo-600 bg-indigo-500/10 shadow-sm shadow-indigo-500/10"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="size-4.5 text-indigo-600" />
              <span className="font-semibold text-foreground text-xs sm:text-sm">Doorstep Courier Pickup</span>
            </div>
            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-600 px-1.5 py-0.5 rounded-full">
              Recommended
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            BlueDart and Delhivery pick up orders directly from your address. 1-click prepaid shipping labels.
          </p>
        </div>

        {/* Self-Ship */}
        <div
          onClick={() => onChange("shippingMode", "self_ship")}
          className={`rounded-xl border p-3.5 cursor-pointer transition-all space-y-1.5 ${
            data.shippingMode === "self_ship"
              ? "border-indigo-600 bg-indigo-500/10 shadow-sm shadow-indigo-500/10"
              : "border-border/80 bg-card hover:border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4.5 text-indigo-600" />
              <span className="font-semibold text-foreground text-xs sm:text-sm">Self-Ship Dispatch</span>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            Ship orders using your own preferred local logistics carrier and upload tracking numbers manually.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <Label htmlFor="dispatchTime" className="text-xs font-semibold text-foreground">
            Order Handling &amp; Dispatch Time
          </Label>
          <Select
            value={data.dispatchTimeHours}
            onValueChange={(val) => onChange("dispatchTimeHours", val)}
          >
            <SelectTrigger id="dispatchTime" className="w-full h-9.5 rounded-lg text-sm">
              <SelectValue placeholder="Select handling window" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="24">Within 24 Hours (Fastest delivery badge)</SelectItem>
              <SelectItem value="48">Within 48 Hours (Standard)</SelectItem>
              <SelectItem value="72">Within 72 Hours (Custom / Made-to-order)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="courierPref" className="text-xs font-semibold text-foreground">
            Preferred Courier Network
          </Label>
          <Select
            value={data.courierPartner}
            onValueChange={(val) => onChange("courierPartner", val)}
          >
            <SelectTrigger id="courierPref" className="w-full h-9.5 rounded-lg text-sm">
              <SelectValue placeholder="Select courier network" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="both">Both BlueDart &amp; Delhivery (Fastest routing)</SelectItem>
              <SelectItem value="bluedart">BlueDart Express Only</SelectItem>
              <SelectItem value="delhivery">Delhivery Surface &amp; Express</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-xl border-border/80 bg-card shadow-none">
        <CardContent className="p-3 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground text-xs sm:text-sm">
              Provide Free Nationwide Shipping
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              Sellers offering free shipping convert 3.2x more fashion shoppers.
            </p>
          </div>
          <Checkbox
            id="offersFreeShipping"
            checked={data.offersFreeShipping}
            onCheckedChange={(checked) => onChange("offersFreeShipping", !!checked)}
            className="size-4.5 rounded border-border text-indigo-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 cursor-pointer shrink-0"
          />
        </CardContent>
      </Card>
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
  return null;
}
