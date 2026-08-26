import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  MailCheck,
  ArrowRight,
  PlusCircle,
  CreditCard,
  LogOut,
  Mail,
  ExternalLink,
  ShieldCheck,
  LifeBuoy,
  Store,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";
import { getHumanErrorMessage } from "@/lib/utils";

type Phase = "checking" | "verified" | "pending";

export default function VerifyEmail() {
  const { session, seller, profile, signOut, resendVerification } = useAuth();
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
      setResendCooldown(60); // 60s cooldown
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

  if (phase === "checking") {
    return <Spinner label="Checking verification status…" />;
  }

  if (phase === "verified") {
    const businessName = seller?.business_name || profile?.full_name || "Merchant Store";
    const verifiedEmail = email || session?.user?.email || "Registered Email";

    return (
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Email Verified Successfully
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your seller credentials for <strong className="text-foreground">{verifiedEmail}</strong> are now verified.
          </p>
        </div>

        {/* Store readiness card */}
        <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Store className="size-4 text-indigo-500" />
              <span>{businessName}</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Ready for Live Selling
            </span>
          </div>
          
          <div className="border-t border-border/60 pt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80">Account Type</p>
              <p className="font-medium text-foreground">Verified Merchant</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80">Settlement Wallet</p>
              <p className="font-medium text-foreground">Auto-Initialized (INR)</p>
            </div>
          </div>
        </div>

        {/* Primary and Next Steps Actions */}
        <div className="space-y-2.5">
          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 font-semibold"
            onClick={() => navigate("/", { replace: true })}
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="size-4" />
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs"
              onClick={() => navigate("/products")}
            >
              <PlusCircle className="size-3.5 text-indigo-500" />
              <span>List Products</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs"
              onClick={() => navigate("/payouts")}
            >
              <CreditCard className="size-3.5 text-emerald-500" />
              <span>Setup Payouts</span>
            </Button>
          </div>
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
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Mail className="size-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Verify your email</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          We sent a verification link to{" "}
          <strong className="text-foreground">{email || "your registered email"}</strong>.
          Click the link in the message to activate your merchant account.
        </p>
      </div>

      {/* Direct webmail launch button if recognized domain */}
      {webmailLink && (
        <a
          href={webmailLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span>Check your inbox on {webmailLink.name}</span>
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
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <Button
            type="submit"
            size="lg"
            loading={sending}
            disabled={resendCooldown > 0 || sending}
            className="w-full sm:flex-1 font-medium"
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

      {/* Troubleshooting Tips Card */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground space-y-1.5">
        <p className="font-semibold text-foreground flex items-center gap-1.5">
          <LifeBuoy className="size-3.5 text-indigo-500" />
          Troubleshooting Tips:
        </p>
        <ul className="list-disc pl-4 space-y-1 text-muted-foreground leading-relaxed">
          <li>Check your spam or promotions folder if the email doesn't appear within 2 minutes.</li>
          <li>Ensure your mailbox is not full and allows messages from our domain.</li>
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
  );
}

