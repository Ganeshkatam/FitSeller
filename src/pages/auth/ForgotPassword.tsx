import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  MailCheck,
  ExternalLink,
  Shirt,
  LifeBuoy,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { getHumanErrorMessage } from "@/lib/utils";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(
        getHumanErrorMessage(
          err,
          "We could not send the password reset email. Please double-check your email address and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const domain = email.split("@")[1]?.toLowerCase();
  let webmail: { name: string; url: string } | null = null;
  if (domain?.includes("gmail") || domain?.includes("google")) {
    webmail = { name: "Open Gmail", url: "https://mail.google.com" };
  } else if (domain?.includes("outlook") || domain?.includes("hotmail") || domain?.includes("live")) {
    webmail = { name: "Open Outlook", url: "https://outlook.live.com" };
  } else if (domain?.includes("yahoo")) {
    webmail = { name: "Open Yahoo Mail", url: "https://mail.yahoo.com" };
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500/20 relative overflow-hidden">
      {/* Background with deep scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/auth/forgot-password.jpg"
          alt="Password recovery"
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
                ACCOUNT HELP
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="mailto:support@fitmirror.in?subject=Password%20Reset%20Help"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LifeBuoy className="size-3.5 text-indigo-500" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </header>

      {/* Centered Recovery Chamber */}
      <main className="mx-auto w-full max-w-md px-4 py-12 sm:py-16 my-auto relative z-10">
        <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl space-y-6">
          {sent ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <MailCheck className="size-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Check your inbox</h2>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  If an account exists for <strong className="text-foreground">{email}</strong>, we have sent a secure password reset link.
                </p>
              </div>

              {webmail && (
                <a
                  href={webmail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors text-left"
                >
                  <span>Open {webmail.name}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}

              <div className="space-y-2.5 pt-2">
                <Button variant="default" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl h-11 text-white" asChild>
                  <Link to="/auth/sign-in">Return to Sign In</Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold rounded-xl h-10"
                  onClick={() => setSent(false)}
                >
                  Try a different email
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <KeyRound className="size-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Reset your password
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enter your business email and we will send you a link to reset your password.
                </p>
              </div>

              {/* Simple Step Guide */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-indigo-500" />
                  How password reset works:
                </p>
                <div className="space-y-1.5 pl-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Enter your registered email address below</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Click the reset link sent to your inbox</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Choose a strong new password</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs sm:text-sm text-destructive font-medium">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="flex-1 leading-snug">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Your Business Email</Label>
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

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 rounded-xl h-11 text-sm text-white"
                >
                  Send Reset Link
                </Button>
              </form>

              <div className="text-center pt-1">
                <Link
                  to="/auth/sign-in"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Sign In</span>
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
            <span>Safe &amp; Secure Account Recovery</span>
          </div>
          <span className="text-[11px]">&copy; {new Date().getFullYear()} FitSeller</span>
        </div>
      </footer>
    </div>
  );
}
