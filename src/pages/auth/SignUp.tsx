import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Shirt,
  Lock,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  ShoppingBag,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { getHumanErrorMessage } from "@/lib/utils";

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

export default function SignUp() {
  const { signUp, signInWithGoogle, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [dismissAlert, setDismissAlert] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || authError;

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const allRequirementsMet = hasMinLength && hasUpperCase && hasNumber && hasSpecial;
  const isPasswordValid = hasMinLength && hasUpperCase && hasNumber;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);

    if (!agreed) {
      setLocalError("Please agree to the Seller Terms of Service and Privacy Policy.");
      setDismissAlert(false);
      return;
    }

    if (!isPasswordValid) {
      setLocalError("Password must be at least 8 characters with an uppercase letter and a number.");
      setDismissAlert(false);
      return;
    }

    if (password !== confirm) {
      setLocalError("Passwords do not match.");
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
    <div className="h-screen max-h-screen overflow-hidden bg-[#F5F6F8] dark:bg-zinc-950 text-foreground flex flex-col selection:bg-indigo-500/20">
      {/* Top Bar: Logo left, Sign In right -- aligned to main grid */}
      <header className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between shrink-0 py-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Shirt className="size-4.5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-foreground text-base block leading-none">
              FitSeller
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mt-px">
              Seller Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="hidden sm:inline">Already have an account?</span>
          <Link
            to="/auth/sign-in"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
          >
            <span>Sign in</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content: 40/60 split */}
      <main className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 flex-1 flex items-stretch min-h-0 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 w-full">
          {/* ============================================================ */}
          {/* LEFT PANEL: Brand Visual (~40%)                              */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 relative rounded-2xl bg-[#090D1A] text-white overflow-hidden flex flex-col justify-between p-7 sm:p-9">
            {/* Background Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/auth/sign-up.jpg"
                alt="Fashion atelier and apparel display"
                className="h-full w-full object-cover object-center filter brightness-[0.55] contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B17] via-[#0A0E24]/85 to-[#080B17]/30" />
              <div className="absolute inset-0 bg-radial from-transparent via-[#080B17]/30 to-[#080B17]/85" />
            </div>

            {/* Spacer to push content down */}
            <div className="relative z-10 flex-1" />

            {/* Bottom Content */}
            <div className="relative z-10 space-y-5">
              <div className="space-y-2">
                <h1 className="text-2xl xl:text-[1.7rem] font-extrabold tracking-tight text-white leading-snug">
                  Build and manage your fashion business from one place.
                </h1>
              </div>

              {/* 3 Factual Capabilities */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white">
                    <ShoppingBag className="size-3.5" />
                  </div>
                  <span className="text-[12px] font-medium text-zinc-100">
                    Manage products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white">
                    <ClipboardList className="size-3.5" />
                  </div>
                  <span className="text-[12px] font-medium text-zinc-100">
                    Manage orders
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white">
                    <BarChart3 className="size-3.5" />
                  </div>
                  <span className="text-[12px] font-medium text-zinc-100">
                    Track your earnings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT PANEL: Registration Form (~60%)                       */}
          {/* ============================================================ */}
          <div className="lg:col-span-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 py-6 sm:px-10 sm:py-7 shadow-lg shadow-zinc-200/30 dark:shadow-black/20 flex flex-col justify-center overflow-y-auto">
            <div className="w-full max-w-xl mx-auto space-y-4">
              {/* Header */}
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                  CREATE YOUR ACCOUNT
                </span>
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                  Create your seller account
                </h2>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                  Start managing your fashion business with FitSeller.
                </p>
              </div>

              {/* Error Alert */}
              {activeError && !dismissAlert && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-600 dark:text-red-400 font-medium animate-fadeIn">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  <div className="flex-1 leading-tight">{getHumanErrorMessage(activeError)}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalError(null);
                      setDismissAlert(true);
                      clearAuthError();
                    }}
                    className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                loading={googleLoading}
                disabled={loading || googleLoading}
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-2 font-semibold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl h-11 text-[13px] shadow-none text-zinc-800 dark:text-zinc-200"
              >
                <GoogleIcon className="size-4 shrink-0" />
                <span>Continue with Google</span>
              </Button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-semibold text-zinc-400 lowercase absolute">
                  or
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full name */}
                <div>
                  <Label htmlFor="fullName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Full name (Contact person)
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className="mt-0.5 h-10 rounded-lg text-[13px] border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 focus:bg-white"
                  />
                </div>

                {/* Mobile & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Mobile number
                    </Label>
                    <div className="flex gap-1.5 mt-0.5">
                      <button
                        type="button"
                        className="flex h-10 items-center justify-center gap-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 px-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400"
                      >
                        <span>+91</span>
                        <ChevronDown className="size-3 text-zinc-400" />
                      </button>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        className="h-10 rounded-lg text-[13px] flex-1 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Business email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="business@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="mt-0.5 h-10 rounded-lg text-[13px] border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="password" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Password
                    </Label>
                    <div className="relative mt-0.5">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="pr-9 h-10 rounded-lg text-[13px] border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Confirm password
                    </Label>
                    <div className="relative mt-0.5">
                      <Input
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        disabled={loading}
                        className="pr-9 h-10 rounded-lg text-[13px] border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Requirements -- live validation with collapsed success state */}
                <div className="rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-800/30 px-3 py-2">
                  {allRequirementsMet ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Password meets all requirements
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <p className="text-[10.5px] font-semibold text-zinc-500">
                        Password must contain:
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2
                            className={`size-3.5 shrink-0 transition-colors duration-200 ${
                              hasMinLength ? "text-emerald-600" : "text-zinc-300 dark:text-zinc-600"
                            }`}
                          />
                          <span className={`transition-colors duration-200 ${hasMinLength ? "text-zinc-800 dark:text-zinc-200 font-medium" : "text-zinc-400"}`}>
                            8+ characters
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <CheckCircle2
                            className={`size-3.5 shrink-0 transition-colors duration-200 ${
                              hasUpperCase ? "text-emerald-600" : "text-zinc-300 dark:text-zinc-600"
                            }`}
                          />
                          <span className={`transition-colors duration-200 ${hasUpperCase ? "text-zinc-800 dark:text-zinc-200 font-medium" : "text-zinc-400"}`}>
                            One uppercase letter
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <CheckCircle2
                            className={`size-3.5 shrink-0 transition-colors duration-200 ${
                              hasNumber ? "text-emerald-600" : "text-zinc-300 dark:text-zinc-600"
                            }`}
                          />
                          <span className={`transition-colors duration-200 ${hasNumber ? "text-zinc-800 dark:text-zinc-200 font-medium" : "text-zinc-400"}`}>
                            One number
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <CheckCircle2
                            className={`size-3.5 shrink-0 transition-colors duration-200 ${
                              hasSpecial ? "text-emerald-600" : "text-zinc-300 dark:text-zinc-600"
                            }`}
                          />
                          <span className={`transition-colors duration-200 ${hasSpecial ? "text-zinc-800 dark:text-zinc-200 font-medium" : "text-zinc-400"}`}>
                            One special character
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="size-3.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
                    I agree to the Seller{" "}
                    <Link to="/#faqs" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/#faqs" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                      Privacy Policy
                    </Link>.
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  loading={loading}
                  disabled={googleLoading}
                  className="w-full font-bold bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl h-11 text-[15px] shadow-md shadow-indigo-600/20"
                >
                  Create seller account
                </Button>

                {/* Secure notice */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                  <Lock className="size-3 text-indigo-500" />
                  <span>Your information is protected by secure authentication.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 border-t border-zinc-200/80 dark:border-zinc-800/80 py-2 shrink-0 text-[10px] text-zinc-400 flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} FitSeller. All rights reserved.</span>
        <div className="flex items-center gap-3">
          <Link to="/#faqs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
          <span className="text-zinc-300">|</span>
          <Link to="/#faqs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          <span className="text-zinc-300">|</span>
          <Link to="/#faqs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Seller FAQs</Link>
          <span className="text-zinc-300">|</span>
          <Link to="/#faqs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}
