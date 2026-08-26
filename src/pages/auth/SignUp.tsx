import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Shirt,
  CheckCircle2,
  Sparkles,
  Zap,
  Tag,
  Store,
  Layers,
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

const PASSWORD_RULES = [
  { id: "length", label: "8+ characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

export default function SignUp() {
  const { signUp, signInWithGoogle, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
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

    if (!PASSWORD_RULES.every((r) => r.test(password))) {
      setLocalError("Your password must be at least 8 characters long and include an uppercase letter and a number.");
      setDismissAlert(false);
      return;
    }

    if (password !== confirm) {
      setLocalError("The entered passwords do not match. Please re-enter your confirmation password.");
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
        getHumanErrorMessage(err, "Unable to complete Google sign-up. Please try again.")
      );
      setDismissAlert(false);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground grid grid-cols-1 lg:grid-cols-12 selection:bg-indigo-500/20">
      {/* LEFT COLUMN: Store Onboarding Studio Canvas (7 Cols) */}
      <div className="relative hidden lg:flex lg:col-span-7 flex-col justify-between overflow-hidden bg-zinc-950 p-10 xl:p-14 text-white">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/auth/sign-up.jpg"
            alt="Store Growth and Catalog"
            className="h-full w-full object-cover object-center filter brightness-[0.45] contrast-110 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/40" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/40 border border-indigo-400/20">
              <Shirt className="size-5.5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-xl">FitSeller</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Merchant Onboarding Studio
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-zinc-300">
            <Sparkles className="size-3.5 text-indigo-400" />
            <span>Instant Store Provisioning</span>
          </div>
        </div>

        {/* Center Onboarding Value Prop & Roadmap */}
        <div className="relative z-10 max-w-xl my-auto py-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Zap className="size-3.5" />
            <span>0% Platform Listing Fee</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Launch your store and reach verified fashion shoppers nationwide.
          </h1>

          <p className="text-sm xl:text-base leading-relaxed text-zinc-300">
            Join thousands of apparel brands growing their sales with automated inventory sync, transparent analytics, and guaranteed payouts.
          </p>

          {/* 3-Step Merchant Roadmap */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Your 3-Step Store Launch Path
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/20 p-2.5 space-y-1">
                <span className="font-bold text-white block">1. Register</span>
                <span className="text-[10px] text-indigo-200 block">Create credentials</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 space-y-1">
                <span className="font-bold text-white block">2. Verify</span>
                <span className="text-[10px] text-zinc-400 block">Activate store</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 space-y-1">
                <span className="font-bold text-white block">3. Go Live</span>
                <span className="text-[10px] text-zinc-400 block">Publish offers</span>
              </div>
            </div>
          </div>

          {/* Value Prop Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 text-xs text-zinc-300">
              <Store className="size-4 text-emerald-400" />
              <span>Dedicated Merchant Portal</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-300">
              <Tag className="size-4 text-indigo-400" />
              <span>Custom Pricing & Discounts</span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>Automatic Profile & Wallet Creation</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-indigo-400" />
            <span>Real Multi-Variant Inventory</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign Up Form Container (5 Cols) */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-card/60 backdrop-blur-xl border-l border-border/40">
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Shirt className="size-5" />
            </div>
            <span className="font-bold tracking-tight text-foreground text-lg">FitSeller</span>
          </Link>

          <Link
            to="/auth/sign-in"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Sign in &rarr;
          </Link>
        </div>

        {/* Centered Form Body */}
        <div className="my-auto max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Register your store
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Get instant access to inventory listing and order management.
            </p>
          </div>

          {/* Active Error Alert Banner */}
          {activeError && !dismissAlert && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs sm:text-sm text-destructive font-medium">
              <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-destructive" />
              <div className="flex-1 leading-snug">{getHumanErrorMessage(activeError)}</div>
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  setDismissAlert(true);
                  clearAuthError();
                }}
                className="text-destructive/70 hover:text-destructive transition-colors cursor-pointer"
                aria-label="Dismiss error"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Google One-Click Auth */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            loading={googleLoading}
            disabled={loading || googleLoading}
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2.5 font-medium border-border hover:bg-muted/50 transition-colors shadow-sm"
          >
            <GoogleIcon className="size-4.5 shrink-0" />
            <span>Sign up with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="bg-card px-3 text-xs font-medium uppercase text-muted-foreground absolute">
              or register with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Business Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seller@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Create Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10"
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

              {/* Password Rule Validation Pills */}
              <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                {PASSWORD_RULES.map((rule) => {
                  const pass = rule.test(password);
                  return (
                    <span
                      key={rule.id}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium border transition-colors ${
                        pass
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <CheckCircle2 className={`size-3 ${pass ? "text-emerald-500" : "text-muted-foreground/40"}`} />
                      <span>{rule.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              disabled={googleLoading}
              className="w-full font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
            >
              Create Merchant Account
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground space-y-1">
            <p>
              Already registered?{" "}
              <Link
                to="/auth/sign-in"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Sign in to your store
              </Link>
            </p>
          </div>
        </div>

        {/* Security Reassurance Footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-6 text-[11px] text-muted-foreground">
          <span>By signing up, you accept FitSeller Merchant Terms.</span>
          <Link to="/auth/sign-in" className="hover:text-foreground transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
