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
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
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
    setSending(true);
    try {
      await resendVerification(email.trim());
      setResent(true);
      setResendCooldown(60);
    } catch (err) {
      navigate("/error", {
        state: {
          category: "auth",
          code: "resend_verification_failed",
          account: email.trim(),
          title: "Verification Email Dispatch Failed",
          message: getHumanErrorMessage(
            err,
            "Unable to dispatch verification email. Please verify the email address."
          ),
          backTo: "/auth/verify-email",
          primaryActionLabel: "Try Again",
          primaryActionUrl: "/auth/verify-email",
        },
      });
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
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

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
                ACTIVATION HUB
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="mailto:sellers@fitmirror.shop?subject=Merchant%20Activation%20Help"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LifeBuoy className="size-3.5 text-indigo-500" />
              <span>Activation Desk</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Activation Card */}
      <main className="mx-auto w-full max-w-lg px-4 py-12 sm:py-16 my-auto relative z-10">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-6">
          {phase === "checking" ? (
            <div className="py-8 text-center">
              <Spinner label="Checking store activation status…" />
            </div>
          ) : phase === "verified" ? (
            <div className="space-y-6 text-left">
              {/* Header with verified badge */}
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <MailCheck className="size-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                  <ShieldCheck className="size-3.5" />
                  <span>Store Activated</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Email Verified Successfully
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Your seller credentials for <strong className="text-foreground">{verifiedEmail}</strong> are now verified.
                </p>
              </div>

              {/* Primary and Next Steps Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-600/20"
                  onClick={() => navigate("/", { replace: true })}
                >
                  <span>Go to dashboard</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              {/* Secondary Account Switcher */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={handleSignOutAndSwitch}
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Switch account</span>
                </button>

                <a
                  href="mailto:sellers@fitmirror.shop?subject=Merchant%20Account%20Assistance"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <LifeBuoy className="size-3.5 text-indigo-500" />
                  <span>Merchant Support</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Mail className="size-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Verify your business email
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  We sent a confirmation link to{" "}
                  <strong className="text-foreground">{email || "your registered email"}</strong>.
                  Click the link inside to unlock full seller operations.
                </p>
              </div>

              {/* Direct webmail launch button */}
              {webmailLink && (
                <a
                  href={webmailLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Check inbox on {webmailLink.name}</span>
                  </div>
                  <ExternalLink className="size-3.5" />
                </a>
              )}

              {resent && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>New verification link dispatched. Please check your inbox and spam folder.</span>
                </div>
              )}

              {/* Resend Action Form */}
              <form onSubmit={handleResend} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="seller@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={sending}
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <Button
                    type="submit"
                    size="lg"
                    loading={sending}
                    disabled={resendCooldown > 0 || sending}
                    className="w-full sm:flex-1 font-medium bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                  >
                    {resendCooldown > 0 ? (
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        Resend in {resendCooldown}s
                      </span>
                    ) : resent ? (
                      "Resend link again"
                    ) : (
                      "Resend verification email"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => window.location.reload()}
                  >
                    I've verified
                  </Button>
                </div>
              </form>

              {/* Troubleshooting Tips */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground space-y-1.5">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-indigo-500" />
                  Helpful Activation Tips:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground leading-relaxed">
                  <li>Check your spam or promotions folder if the email doesn't appear within 2 minutes.</li>
                  <li>Ensure your email address is spelled accurately above.</li>
                </ul>
              </div>

              {/* Bottom Footer Actions */}
              <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={handleSignOutAndSwitch}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Sign in with another account
                </button>

                <Link
                  to="/auth/sign-in"
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground relative z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>FitSeller Merchant Verification</span>
          </div>
          <a href="mailto:sellers@fitmirror.shop" className="hover:text-foreground transition-colors">
            Support Desk
          </a>
        </div>
      </footer>
    </div>
  );
}
