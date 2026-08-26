import { ShieldCheck } from "lucide-react";
import { Input, Label } from "@/components/ui/Field";
import type { Step6BankData } from "./OnboardingTypes";

interface Step6Props {
  data: Step6BankData;
  onChange: (field: any, value: any) => void;
}

export function Step6Bank({ data, onChange }: Step6Props) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <span>Step 6 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Bank Details for Daily Deposits
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Earnings from delivered clothing orders will be deposited into this account every night at 11:30 PM.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="sm:col-span-2">
          <Label htmlFor="holderName">Account Holder Name (As per Bank Records)</Label>
          <Input
            id="holderName"
            type="text"
            required
            placeholder="e.g. Ramesh Sharma or Sharma Apparels LLP"
            value={data.accountHolderName}
            onChange={(e) => onChange("accountHolderName", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="accNumber">Bank Account Number</Label>
          <Input
            id="accNumber"
            type="password"
            required
            placeholder="••••••••••••"
            value={data.accountNumber}
            onChange={(e) => onChange("accountNumber", e.target.value)}
            className="mt-1.5 h-11 rounded-xl font-mono"
          />
        </div>

        <div>
          <Label htmlFor="confirmAccNumber">Re-Enter Bank Account Number</Label>
          <Input
            id="confirmAccNumber"
            type="text"
            required
            placeholder="Enter account number again"
            value={data.confirmAccountNumber}
            onChange={(e) => onChange("confirmAccountNumber", e.target.value)}
            className="mt-1.5 h-11 rounded-xl font-mono"
          />
        </div>

        <div>
          <Label htmlFor="ifsc">Bank IFSC Code (11 Digits)</Label>
          <Input
            id="ifsc"
            type="text"
            required
            maxLength={11}
            placeholder="e.g. HDFC0001234"
            value={data.ifscCode}
            onChange={(e) => onChange("ifscCode", e.target.value.toUpperCase())}
            className="mt-1.5 h-11 rounded-xl font-mono uppercase"
          />
        </div>

        <div>
          <Label htmlFor="bankName">Bank &amp; Branch Name (Optional)</Label>
          <Input
            id="bankName"
            type="text"
            placeholder="e.g. HDFC Bank, Bandra Branch"
            value={data.bankName}
            onChange={(e) => onChange("bankName", e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-400">
        <ShieldCheck className="size-5 shrink-0" />
        <span>Bank account details are securely encrypted and used solely for nightly sales settlements.</span>
      </div>
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
