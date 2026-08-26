import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { Step6BankData } from "./OnboardingTypes";

interface Step6Props {
  data: Step6BankData;
  onChange: (field: any, value: any) => void;
}

export function Step6Bank({ data, onChange }: Step6Props) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-0.5">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Bank &amp; payouts
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure your bank account for sales earnings deposits.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="holderName" className="text-xs font-semibold text-foreground">
            Account Holder Name (As per Bank Records)
          </Label>
          <Input
            id="holderName"
            type="text"
            required
            placeholder="e.g. Ramesh Sharma or Sharma Apparels LLP"
            value={data.accountHolderName}
            onChange={(e) => onChange("accountHolderName", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="accNumber" className="text-xs font-semibold text-foreground">
            Bank Account Number
          </Label>
          <Input
            id="accNumber"
            type="password"
            required
            placeholder="••••••••••••"
            value={data.accountNumber}
            onChange={(e) => onChange("accountNumber", e.target.value)}
            className="h-9.5 rounded-lg font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmAccNumber" className="text-xs font-semibold text-foreground">
            Re-Enter Bank Account Number
          </Label>
          <Input
            id="confirmAccNumber"
            type="text"
            required
            placeholder="Enter account number again"
            value={data.confirmAccountNumber}
            onChange={(e) => onChange("confirmAccountNumber", e.target.value)}
            className="h-9.5 rounded-lg font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ifsc" className="text-xs font-semibold text-foreground">
            Bank IFSC Code (11 Digits)
          </Label>
          <Input
            id="ifsc"
            type="text"
            required
            maxLength={11}
            placeholder="e.g. HDFC0001234"
            value={data.ifscCode}
            onChange={(e) => onChange("ifscCode", e.target.value.toUpperCase())}
            className="h-9.5 rounded-lg font-mono uppercase text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bankName" className="text-xs font-semibold text-foreground">
            Bank &amp; Branch Name (Optional)
          </Label>
          <Input
            id="bankName"
            type="text"
            placeholder="e.g. HDFC Bank, Bandra Branch"
            value={data.bankName}
            onChange={(e) => onChange("bankName", e.target.value)}
            className="h-9.5 rounded-lg text-sm"
          />
        </div>
      </div>

      <Card className="rounded-xl border-emerald-500/20 bg-emerald-500/5 shadow-none">
        <CardContent className="p-3 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="size-4 shrink-0" />
          <span>Your bank details are used only for seller payout processing.</span>
        </CardContent>
      </Card>
    </div>
  );
}

export const STEP6_INITIAL: Step6BankData = {
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  accountHolderName: "",
  bankName: "",
};

export function validateStep6(data: Step6BankData): string | null {
  if (!data.accountHolderName.trim()) {
    return "Please enter the account holder name.";
  }
  if (!data.accountNumber.trim()) {
    return "Please enter your bank account number.";
  }
  if (data.accountNumber !== data.confirmAccountNumber) {
    return "Bank account numbers do not match.";
  }
  if (!data.ifscCode.trim()) {
    return "Please enter your bank IFSC code.";
  }
  if (data.ifscCode.trim().length !== 11) {
    return "Bank IFSC code must be exactly 11 characters.";
  }
  return null;
}
