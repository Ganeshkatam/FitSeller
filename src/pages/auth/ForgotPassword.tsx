import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  MailCheck,
  ExternalLink,
  Shirt,
  LifeBuoy,
  KeyRound,
  Shield,
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
          "We could not send a reset email. Please verify your business email and try again."
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
                SECURITY VAULT
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="mailto:sellers@fitmirror.shop?subject=Account%20Recovery%20Assistance"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LifeBuoy className="size-3.5 text-indigo-500" />
              <span>Recovery Desk</span>
            </a>
          </div>
        </div>
      </header>

      {/* Centered Recovery Chamber */}
      <main className="mx-auto w-full max-w-md px-4 py-12 sm:py-16 my-auto relative z-10">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 space-y-6">
          {sent ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MailCheck className="size-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Check your inbox</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  If a merchant account exists for <strong className="text-foreground">{email}</strong>, you'll
                  receive a secure password reset link shortly.
                </p>
              </div>

              {webmail && (
                <a
                  href={webmail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors text-left"
                >
                  <span>Launch {webmail.name}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}

              <div className="space-y-2.5 pt-2">
                <Button variant="default" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link to="/auth/sign-in">Return to sign in</Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setSent(false)}
                >
                  Send to a different email
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <KeyRound className="size-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Forgot your password?
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Enter your registered business email and we'll send you a secure one-time recovery link.
                </p>
              </div>

              {/* Step info card */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="size-3.5 text-indigo-500" />
                  Password Recovery Procedure:
                </p>
                <div className="space-y-1.5 pl-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    <span>Enter your registered seller email below</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    <span>Click the authenticated link inside your email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    <span>Set a strong new password in our security vault</span>
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
                  <Label htmlFor="email">Registered Email</Label>
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

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Send Recovery Link
                </Button>
              </form>

              <div className="border-t border-border/60 pt-4 text-center">
                <Link
                  to="/auth/sign-in"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground relative z-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <Lock className="size-3 text-emerald-600" />
            <span>Encrypted Credential Recovery</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth/sign-in" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link to="/auth/sign-up" className="hover:text-foreground transition-colors">
              Register store
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
