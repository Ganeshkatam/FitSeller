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

    if (password.length < 8) {
      return navigate("/error", {
        state: {
          category: "auth",
          code: "password_short",
          title: "Password Too Short",
          message: "Your new password must be at least 8 characters in length.",
          backTo: "/auth/reset-password",
          primaryActionLabel: "Re-enter Password",
          primaryActionUrl: "/auth/reset-password",
        },
      });
    }

    if (password !== confirm) {
      return navigate("/error", {
        state: {
          category: "auth",
          code: "password_mismatch",
          title: "Passwords Do Not Match",
          message: "The entered passwords do not match. Please try setting your password again.",
          backTo: "/auth/reset-password",
          primaryActionLabel: "Re-enter Password",
          primaryActionUrl: "/auth/reset-password",
        },
      });
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
      navigate("/error", {
        state: {
          category: "auth",
          code: "reset_update_failed",
          title: "Password Update Incomplete",
          message: getHumanErrorMessage(
            err,
            "Failed to update your password. Your security token may have expired."
          ),
          backTo: "/auth/reset-password",
          primaryActionLabel: "Request New Link",
          primaryActionUrl: "/auth/forgot-password",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500/20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 text-white">
              <Shirt className="size-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-foreground text-lg">FitSeller</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                CREDENTIAL VAULT
              </span>
            </div>
          </Link>

          <a
            href="mailto:sellers@fitmirror.shop"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <LifeBuoy className="size-3.5 text-indigo-500" />
            <span>Support Desk</span>
          </a>
        </div>
      </header>

      {/* Centered Hardening Card */}
      <main className="mx-auto w-full max-w-md px-4 py-12 sm:py-16 my-auto relative z-10">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-6">
          {checking ? (
            <div className="py-8 text-center">
              <Spinner label="Validating security token…" />
            </div>
          ) : !hasSession ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Lock className="size-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Security Link Expired</h2>
              <p className="text-sm text-muted-foreground">
                This password reset link is invalid or has already been used. Please request a fresh link.
              </p>
              <Button size="lg" className="w-full mt-2" asChild>
                <Link to="/auth/forgot-password">Request New Reset Link</Link>
              </Button>
            </div>
          ) : done ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-7" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Password Updated</h2>
              <p className="text-sm text-muted-foreground">
                Your credentials have been securely updated. Redirecting you to sign in…
              </p>
              <div className="pt-2">
                <Button size="lg" className="w-full" asChild>
                  <Link to="/auth/sign-in">Sign In Now</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <KeyRound className="size-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Set New Password
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Choose a strong, unique password for your seller account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative mt-1">
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

                  {/* Password rules pills */}
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
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={loading}
                    className="mt-1"
                  />
                  {confirm && password !== confirm && (
                    <p className="mt-1.5 text-xs text-destructive">Passwords do not match.</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Save New Password
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground relative z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>End-to-End Encrypted Session</span>
          </div>
          <Link to="/auth/sign-in" className="hover:text-foreground transition-colors">
            Cancel & Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
