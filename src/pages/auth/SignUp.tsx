import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Shirt,
  ShieldCheck,
  ChevronRight,
  Truck,
  IndianRupee,
  Tag,
  Layers,
  Sparkles,
  Lock,
  FileCheck,
  HelpCircle,
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground flex flex-col justify-between selection:bg-indigo-500/20">
      {/* Top Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 text-white">
              <Shirt className="size-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-foreground text-lg">FitSeller</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                SELLER CENTRAL
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/#faqs"
              className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="size-3.5" />
              <span>Seller FAQs</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground hidden sm:inline">Already registered?</span>
              <Link
                to="/auth/sign-in"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
              >
                <span>Sign In</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form + Selling Advantage Frame */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-8 lg:py-12 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* Left: Seller Registration Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg shadow-zinc-950/5 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Sparkles className="size-3.5" />
                <span>Start Selling Clothes Online</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Create Your Seller Account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Sell directly to fashion shoppers across India with daily payouts and doorstep pickup.
              </p>
            </div>

            {/* Error Banner */}
            {activeError && !dismissAlert && (
              <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs sm:text-sm text-destructive font-medium">
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

            {/* Google Fast Sign Up */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              loading={googleLoading}
              disabled={loading || googleLoading}
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-2.5 font-bold border-border hover:bg-muted transition-colors shadow-sm rounded-xl h-11 text-xs sm:text-sm"
            >
              <GoogleIcon className="size-4.5 shrink-0" />
              <span>Sign up with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="bg-card px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground absolute">
                or continue with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-xs font-semibold">
                    Contact Person Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Mobile Phone Number
                  </Label>
                  <div className="flex gap-2 mt-1.5">
                    <div className="flex h-11 items-center justify-center rounded-xl border border-input bg-muted/40 px-2.5 text-xs font-bold text-muted-foreground">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                      className="h-11 rounded-xl flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-semibold">
                  Business Email Address
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
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-xs font-semibold">
                    Password (8+ chars)
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="pr-10 h-11 rounded-xl"
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
                </div>

                <div>
                  <Label htmlFor="confirm" className="text-xs font-semibold">
                    Re-Enter Password
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
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  disabled={googleLoading}
                  className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11.5 text-sm shadow-md shadow-indigo-600/30"
                >
                  Create Seller Account
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground text-center pt-1 leading-relaxed">
                By creating an account, you agree to FitSeller&apos;s Seller Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>

          {/* Right: Seller Selling Network Advantages (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Core Advantages Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Why Fashion Sellers Choose FitSeller</h2>
                <p className="text-xs text-muted-foreground">The dedicated online marketplace for clothing and fashion labels.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <IndianRupee className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">Daily 11:30 PM Bank Deposits</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      Direct deposit into your bank account every night for delivered orders with zero delay.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    <Truck className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">Prepaid Doorstep Courier Pickup</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      BlueDart &amp; Delhivery collect packages right from your address with instant label printing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Tag className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">0% Listing Fees &bull; Flat 8% Commission</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      No monthly software charges or hidden fees. You only pay when a customer buys.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                    <Layers className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">All Sizes In One Listing (XS–3XL)</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      Manage all sizes, colors, and stock in a single catalog item without duplicate listings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Security & Direct Settlements Card */}
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Seller Security &amp; Compliance</span>
              </div>
              <ul className="space-y-2 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Lock className="size-3.5 text-indigo-500 shrink-0" />
                  <span>256-bit encrypted authentication &amp; session security</span>
                </li>
                <li className="flex items-center gap-2">
                  <IndianRupee className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Direct NEFT / IMPS bank transfers without wallet lock-in</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="size-3.5 text-blue-500 shrink-0" />
                  <span>Automated GST invoice generation for every dispatched order</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-md py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Encrypted Seller Registration &bull; Direct Bank Settlements</span>
          </div>
          <span className="text-[11px]">&copy; {new Date().getFullYear()} FitSeller</span>
        </div>
      </footer>
    </div>
  );
}
