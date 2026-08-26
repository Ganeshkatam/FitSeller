import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Shirt,
  ChevronRight,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { getHumanErrorMessage } from "@/lib/utils";

function GoogleIcon({ className = "size-4.5" }: { className?: string }) {
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

export default function SignUp() {
  const { signUp, signInWithGoogle, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [dismissAlert, setDismissAlert] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || authError;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);

    if (password.length < 8) {
      setLocalError("Passwords must be at least 8 characters.");
      setDismissAlert(false);
      return;
    }

    if (password !== confirm) {
      setLocalError("Passwords do not match. Please retype your password.");
      setDismissAlert(false);
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password);
      navigate("/auth/verify-email", { state: { email: email.trim() } });
    } catch (err) {
      setLocalError(
        getHumanErrorMessage(err, "Unable to create your seller account. Please try again.")
      );
      setDismissAlert(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    clearAuthError();
    setLocalError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(
        getHumanErrorMessage(err, "Unable to sign up with Google. Please try again.")
      );
      setDismissAlert(false);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/80 dark:bg-zinc-950 text-foreground flex flex-col justify-between selection:bg-indigo-500/20 py-8 px-4 sm:px-6">
      {/* Centered Minimal Brand Logo */}
      <div className="mx-auto text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 text-white">
            <Shirt className="size-5" />
          </div>
          <span className="font-bold tracking-tight text-foreground text-2xl">FitSeller</span>
        </Link>
      </div>

      {/* Centered Minimalist Registration Card */}
      <div className="mx-auto w-full max-w-[420px]">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 sm:p-8 shadow-sm space-y-5">
          {/* Card Title */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create Seller Account
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Start selling your clothes to shoppers across India.
            </p>
          </div>

          {/* Error Alert */}
          {activeError && !dismissAlert && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div className="flex-1 leading-snug">{getHumanErrorMessage(activeError)}</div>
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  setDismissAlert(true);
                  clearAuthError();
                }}
                className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Dismiss error"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Quick Google Auth */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            loading={googleLoading}
            disabled={loading || googleLoading}
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2.5 font-semibold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl h-11 text-xs text-foreground shadow-none"
          >
            <GoogleIcon className="size-4 shrink-0" />
            <span>Sign up with Google</span>
          </Button>

          {/* Clean Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-medium text-muted-foreground uppercase absolute">
              or
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <Label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                Your name
              </Label>
              <Input
                id="fullName"
                type="text"
                required
                placeholder="First and last name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="mt-1 h-10 rounded-lg text-xs"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Business email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seller@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1 h-10 rounded-lg text-xs"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                Mobile number <span className="text-[10px] text-muted-foreground font-normal">(for delivery alerts)</span>
              </Label>
              <div className="flex gap-2 mt-1">
                <div className="flex h-10 items-center justify-center rounded-lg border border-input bg-muted/40 px-2.5 text-xs font-semibold text-muted-foreground">
                  IN +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Mobile phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="h-10 rounded-lg text-xs flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10 h-10 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <Info className="size-3 text-indigo-500" />
                <span>Passwords must be at least 8 characters.</span>
              </p>
            </div>

            <div>
              <Label htmlFor="confirm" className="text-xs font-semibold text-foreground">
                Re-enter password
              </Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className="mt-1 h-10 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={googleLoading}
                className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10.5 text-xs shadow-sm"
              >
                Create your seller account
              </Button>
            </div>
          </form>

          {/* Legal Notice */}
          <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
            By creating an account, you agree to FitSeller&apos;s{" "}
            <Link to="/#faqs" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Conditions of Use
            </Link>{" "}
            and{" "}
            <Link to="/#faqs" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Notice
            </Link>.
          </p>

          {/* Sign In Link Divider */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Already have a seller account?</span>
              <Link
                to="/auth/sign-in"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center"
              >
                <span>Sign in</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="mt-8 text-center text-[11px] text-muted-foreground space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Link to="/#faqs" className="hover:underline">Conditions of Use</Link>
          <span>&bull;</span>
          <Link to="/#faqs" className="hover:underline">Privacy Notice</Link>
          <span>&bull;</span>
          <Link to="/#faqs" className="hover:underline">Seller Help</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} FitSeller, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}
