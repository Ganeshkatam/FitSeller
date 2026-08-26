import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  MailCheck,
  ArrowRight,
  LogOut,
  Mail,
  ExternalLink,
  ShieldCheck,
  LifeBuoy,
  Clock,
  Shirt,
  AlertCircle,
  Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/States";
import { getHumanErrorMessage } from "@/lib/utils";

type Phase = "checking" | "verified" | "pending";

export default function VerifyEmail() {
  const { session, signOut, resendVerification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState(
    (location.state as { email?: string } | null)?.email ??
      params.get("email") ??
      session?.user?.email ??
      ""
  );
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Check verification state
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (
        data.session &&
        (data.session.user.email_confirmed_at || !data.session.user.confirmation_sent_at)
      ) {
        if (!email && data.session.user.email) {
          setEmail(data.session.user.email);
        }
        setPhase("verified");
      } else {
        setPhase("pending");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [email]);

  async function handleResend(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || resendCooldown > 0) return;
    setError(null);
    setSending(true);
    try {
      await resendVerification(email.trim());
      setResent(true);
      setResendCooldown(60);
    } catch (err) {
      setError(
        getHumanErrorMessage(
          err,
          "Unable to send the verification email. Please double-check your email address."
        )
      );
    } finally {
      setSending(false);
    }
  }

  async function handleSignOutAndSwitch() {
    await signOut();
    navigate("/auth/sign-in", { replace: true });
  }

  // Detect email domain for one-click webmail open
  const webmailLink = (() => {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return null;
    if (domain.includes("gmail") || domain.includes("google")) {
      return { name: "Open Gmail", url: "https://mail.google.com" };
    }
    if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live")) {
      return { name: "Open Outlook", url: "https://outlook.live.com" };
    }
    if (domain.includes("yahoo")) {
      return { name: "Open Yahoo Mail", url: "https://mail.yahoo.com" };
    }
    if (domain.includes("icloud") || domain.includes("me.com")) {
      return { name: "Open iCloud Mail", url: "https://www.icloud.com/mail" };
    }
    return null;
  })();

  const verifiedEmail = email || session?.user?.email || "Registered Email";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500/20 relative overflow-hidden">
      {/* Background with deep scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/auth/verify-email.jpg"
          alt="Email verification"
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
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                ACCOUNT ACTIVATION
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="mailto:support@fitmirror.in?subject=Account%20Activation%20Help"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LifeBuoy className="size-3.5 text-indigo-500" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Activation Card */}
      <main className="mx-auto w-full max-w-lg px-4 py-12 sm:py-16 my-auto relative z-10">
        <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl space-y-6">
          {phase === "checking" ? (
            <div className="py-8 text-center space-y-3">
              <Spinner label="Checking seller account status…" />
            </div>
          ) : phase === "verified" ? (
            <div className="space-y-6 text-center">
              <div>
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <MailCheck className="size-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                  <ShieldCheck className="size-3.5" />
                  <span>Account Ready</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Email Verified
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  Your seller account for <strong className="text-foreground">{verifiedEmail}</strong> is now active.
                </p>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Button
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl h-11 text-white text-sm shadow-md shadow-indigo-600/20"
                  onClick={() => navigate("/dashboard", { replace: true })}
                >
                  <span>Go to Seller Dashboard</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              {/* Account Switcher */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <button
                  type="button"
                  onClick={handleSignOutAndSwitch}
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Switch account</span>
                </button>

                <a
                  href="mailto:support@fitmirror.in"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <LifeBuoy className="size-3.5 text-indigo-500" />
                  <span>Seller Support</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Mail className="size-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Verify your email
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  We sent a confirmation link to{" "}
                  <strong className="text-foreground">{email || "your registered email"}</strong>.
                  Click the link inside to start listing your clothes.
                </p>
              </div>

              {/* Direct Webmail Launch Button */}
              {webmailLink && (
                <a
                  href={webmailLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Check inbox on {webmailLink.name}</span>
                  </div>
                  <ExternalLink className="size-3.5" />
                </a>
              )}

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive font-medium flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-destructive" />
                  <span>{error}</span>
                </div>
              )}

              {resent && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span>New verification email sent. Please check your inbox.</span>
                </div>
              )}

              {/* Resend Action Form */}
              <form onSubmit={handleResend} className="space-y-4">
                <div>
                  <Label htmlFor="resendEmail">Email Address</Label>
                  <Input
                    id="resendEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seller@example.com"
                    disabled={sending || resendCooldown > 0}
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  loading={sending}
                  disabled={sending || resendCooldown > 0}
                  className="w-full font-bold rounded-xl h-11 text-xs border-border"
                >
                  {resendCooldown > 0 ? (
                    <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                      <Clock className="size-3.5 text-indigo-500" />
                      <span>Resend link in {resendCooldown}s</span>
                    </span>
                  ) : (
                    <span>Resend Confirmation Email</span>
                  )}
                </Button>
              </form>

              {/* Navigation Options */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <button
                  type="button"
                  onClick={handleSignOutAndSwitch}
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign in with different email</span>
                </button>

                <Link
                  to="/"
                  className="hover:text-foreground transition-colors font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/60 backdrop-blur-md py-4 text-center text-xs text-muted-foreground relative z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Lock className="size-3 text-emerald-600" />
            <span>Safe &amp; Secure Seller Registration</span>
          </div>
          <span className="text-[11px]">&copy; {new Date().getFullYear()} FitSeller</span>
        </div>
      </footer>
    </div>
  );
}
