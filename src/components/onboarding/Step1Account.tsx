import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getHumanErrorMessage } from "@/lib/utils";
import type { OnboardingData } from "./OnboardingTypes";

function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface StepProps {
  data: OnboardingData;
  onChange: (field: any, value: any) => void;
  onAuthenticated?: () => void;
}

export function Step1Account({ data, onChange, onAuthenticated }: StepProps) {
  const {
    user,
    profile,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    authError,
    clearAuthError,
  } = useAuth();

  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const activeError = localError || authError;

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const allRequirementsMet =
    hasMinLength && hasUpperCase && hasNumber && hasSpecial;

  // Handle user account creation or sign in
  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);

    if (authMode === "signup") {
      if (!data.fullName.trim()) {
        setLocalError("Please enter your full name.");
        return;
      }
      if (!data.email.trim()) {
        setLocalError("Please enter a valid email address.");
        return;
      }
      if (!hasMinLength || !hasUpperCase || !hasNumber) {
        setLocalError(
          "Password must be at least 8 characters with an uppercase letter and a number."
        );
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }

      setAuthLoading(true);
      try {
        await signUp(
          data.email.trim(),
          password,
          data.fullName.trim(),
          data.phone.trim()
        );
        setVerificationSent(true);
        if (onAuthenticated) onAuthenticated();
      } catch (err) {
        setLocalError(
          getHumanErrorMessage(
            err,
            "Unable to create user account. Please check your details and try again."
          )
        );
      } finally {
        setAuthLoading(false);
      }
    } else {
      if (!data.email.trim()) {
        setLocalError("Please enter your email address.");
        return;
      }
      if (!password) {
        setLocalError("Please enter your password.");
        return;
      }

      setAuthLoading(true);
      try {
        await signIn(data.email.trim(), password);
        if (onAuthenticated) onAuthenticated();
      } catch (err) {
        setLocalError(
          getHumanErrorMessage(
            err,
            "Incorrect email or password. Please try again."
          )
        );
      } finally {
        setAuthLoading(false);
      }
    }
  }

  async function handleGoogleAuth() {
    clearAuthError();
    setLocalError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(
        getHumanErrorMessage(
          err,
          "Unable to authenticate with Google. Please try again."
        )
      );
      setGoogleLoading(false);
    }
  }

  // =========================================================================
  // SCENARIO 1: USER IS ALREADY AUTHENTICATED
  // =========================================================================
  if (user) {
    const verifiedEmail = user.email || profile?.email || data.email;

    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Account credentials
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Confirm your authenticated merchant user account.
          </p>
        </div>

        {/* Verified User Card */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <ShieldCheck className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Verified User Account
                </span>
                <CheckCircle2 className="size-3 text-emerald-600" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                {verifiedEmail}
              </p>
              <p className="text-[10px] text-muted-foreground">
                All seller listings, orders, and payouts will be anchored to this account.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              await signOut();
            }}
            className="text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground border-border shrink-0 h-8 px-3"
          >
            <LogOut className="size-3 mr-1.5" />
            <span>Switch Account</span>
          </Button>
        </div>

        {/* Primary Contact Details for the Seller Registration */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            Seller Primary Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold">
                Full Name (Contact Person)
              </Label>
              <Input
                id="fullName"
                type="text"
                required
                placeholder="e.g. Katam Ganesh Reddy"
                value={data.fullName}
                onChange={(e) => onChange("fullName", e.target.value)}
                className="h-9.5 rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Mobile Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={data.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className="h-9.5 rounded-lg text-sm"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Linked User Account Email
              </Label>
              <Input
                id="email"
                type="email"
                disabled
                value={verifiedEmail}
                className="h-9.5 rounded-lg bg-muted/40 text-muted-foreground font-mono text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                This email is verified on your user account and cannot be modified here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 2: USER IS NOT AUTHENTICATED (FACILITY TO CREATE ACCOUNT FIRST)
  // =========================================================================
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Informational Requirement Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <UserCheck className="size-3.5" />
          <span>Step 1 of 6 • User Account Required</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Create your user account first
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          A seller account cannot exist without a normal user account. Create your account below or sign in to proceed with onboarding.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex rounded-xl bg-muted/60 p-1 border border-border/80 max-w-md">
        <button
          type="button"
          onClick={() => {
            setAuthMode("signup");
            clearAuthError();
            setLocalError(null);
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${authMode === "signup"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Create New User Account
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("signin");
            clearAuthError();
            setLocalError(null);
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${authMode === "signin"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Sign In to Existing Account
        </button>
      </div>

      {/* Error Alert */}
      {activeError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 leading-snug">{getHumanErrorMessage(activeError)}</div>
          <button
            type="button"
            onClick={() => {
              setLocalError(null);
              clearAuthError();
            }}
            className="text-red-500/70 hover:text-red-500 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Verification Notice if Email Sent */}
      {verificationSent && (
        <div className="flex items-start gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs text-indigo-700 dark:text-indigo-300">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-indigo-600" />
          <div>
            <p className="font-bold">Confirmation email dispatched</p>
            <p className="mt-0.5 text-muted-foreground">
              Please click the link sent to <strong>{data.email}</strong> to verify your user account, then return here to complete your seller onboarding.
            </p>
          </div>
        </div>
      )}

      {/* Google OAuth Option */}
      <div className="pt-1">
        <Button
          type="button"
          variant="outline"
          loading={googleLoading}
          disabled={authLoading || googleLoading}
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-2 font-bold border-border hover:bg-accent rounded-xl h-11 text-xs sm:text-sm text-foreground"
        >
          <GoogleIcon className="size-4 shrink-0" />
          <span>Continue with Google</span>
        </Button>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <div className="w-full border-t border-border" />
        <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground lowercase absolute">
          or use email
        </span>
      </div>

      {/* Sub-Form for Account Creation / Sign-In */}
      <div className="space-y-4">
        {authMode === "signup" && (
          <div>
            <Label htmlFor="fullName" className="text-xs font-semibold">
              Full Name (Contact Person)
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              placeholder="e.g. Katam Ganesh Reddy"
              value={data.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className="mt-1 h-10.5 rounded-xl text-xs"
            />
          </div>
        )}

        <div className={authMode === "signup" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
          <div>
            <Label htmlFor="email" className="text-xs font-semibold">
              Business Email Address
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="business@example.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="mt-1 h-10.5 rounded-xl text-xs"
            />
          </div>

          {authMode === "signup" && (
            <div>
              <Label htmlFor="phone" className="text-xs font-semibold">
                Mobile Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={data.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className="mt-1 h-10.5 rounded-xl text-xs"
              />
            </div>
          )}
        </div>

        <div className={authMode === "signup" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
          <div>
            <Label htmlFor="password" className="text-xs font-semibold">
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  onChange("password", e.target.value);
                }}
                className="pr-10 h-10.5 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {authMode === "signup" && (
            <div>
              <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    onChange("confirmPassword", e.target.value);
                  }}
                  className="pr-10 h-10.5 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Password Requirements (Signup Only) */}
        {authMode === "signup" && (
          <div className="rounded-xl border border-border/80 bg-muted/40 px-3.5 py-2.5">
            {allRequirementsMet ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Password meets all complexity criteria
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[10.5px] font-semibold text-muted-foreground">
                  Password must contain:
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                  <span
                    className={
                      hasMinLength
                        ? "text-emerald-600 font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    ✓ 8+ characters
                  </span>
                  <span
                    className={
                      hasUpperCase
                        ? "text-emerald-600 font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    ✓ Uppercase letter
                  </span>
                  <span
                    className={
                      hasNumber
                        ? "text-emerald-600 font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    ✓ One number
                  </span>
                  <span
                    className={
                      hasSpecial
                        ? "text-emerald-600 font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    ✓ Special character
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Action for Step 1 Authentication */}
        <div className="pt-2">
          <Button
            type="button"
            loading={authLoading}
            disabled={googleLoading}
            onClick={handleAuthSubmit}
            className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs sm:text-sm shadow-md shadow-indigo-600/20"
          >
            <span>
              {authMode === "signup"
                ? "Create User Account & Proceed"
                : "Sign In & Proceed"}
            </span>
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
          <Lock className="size-3 text-indigo-500" />
          <span>User account credentials are encrypted and securely authenticated.</span>
        </div>
      </div>
    </div>
  );
}

export const STEP1_INITIAL = {
  email: "",
  phone: "",
  fullName: "",
};

export function validateStep1(
  data: { fullName: string },
  isAuthenticated: boolean
): string | null {
  if (!isAuthenticated) {
    return "A normal user account is required first. Please create your user account or sign in.";
  }
  if (!data.fullName.trim()) {
    return "Please enter your full name.";
  }
  return null;
}

