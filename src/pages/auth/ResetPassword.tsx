import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Shirt,
  ShieldCheck,
  LifeBuoy,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";
import { getHumanErrorMessage } from "@/lib/utils";

const RULES = [
  { id: "len", label: "8+ characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "num", label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

export default function ResetPassword() {
  const { updatePassword, signOut } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setHasSession(Boolean(data.session));
      setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Your new password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(async () => {
        await signOut();
        navigate("/auth/sign-in", { replace: true });
      }, 2500);
    } catch (err) {
      setError(
        getHumanErrorMessage(
          err,
          "Failed to update your password. Your reset link may have expired."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500/20 relative overflow-hidden">
      {/* Background with deep scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/auth/reset-password.jpg"
          alt="New password creation"
          className="h-full w-full object-cover object-center filter brightness-[0.35] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
      </div>

      {/* Top Navbar */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 text-white">
              <Shirt className="size-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-foreground text-lg">FitSeller</span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PASSWORD UPDATE
              </span>
            </div>
          </Link>

          <a
            href="mailto:support@fitmirror.in"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <LifeBuoy className="size-3.5 text-indigo-500" />
            <span>Support Desk</span>
          </a>
        </div>
      </header>

      {/* Centered Card */}
      <main className="mx-auto w-full max-w-md px-4 py-12 sm:py-16 my-auto relative z-10">
        <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl space-y-6">
          {checking ? (
            <div className="py-8 text-center space-y-3">
              <Spinner label="Verifying your reset link…" />
            </div>
          ) : !hasSession ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
                <Lock className="size-7" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Link Expired</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                This password reset link is invalid or has already been used. Please request a new link.
              </p>
              <Button size="lg" className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 text-white text-sm" asChild>
                <Link to="/auth/forgot-password">Request New Reset Link</Link>
              </Button>
            </div>
          ) : done ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-7" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Password Updated</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your new password is set. Taking you to the sign in page now…
              </p>
              <div className="pt-2">
                <Button size="lg" className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 text-white text-sm" asChild>
                  <Link to="/auth/sign-in">
                    <span>Sign In Now</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <KeyRound className="size-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Set a new password
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Choose a secure password for your seller account.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs sm:text-sm text-destructive font-medium">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="flex-1 leading-snug">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
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

                  {/* Realtime Password Rules */}
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                    {RULES.map((rule) => {
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
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={loading}
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 rounded-xl h-11 text-sm text-white"
                >
                  Save New Password
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/60 backdrop-blur-md py-4 text-center text-xs text-muted-foreground relative z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Safe &amp; Protected Account Access</span>
          </div>
          <span className="text-[11px]">&copy; {new Date().getFullYear()} FitSeller</span>
        </div>
      </footer>
    </div>
  );
}
