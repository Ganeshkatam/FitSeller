import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { getHumanErrorMessage } from "@/lib/utils";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      navigate("/error", {
        state: {
          category: "auth",
          code: "reset_failed",
          account: email.trim(),
          title: "Unable to Send Reset Link",
          message: getHumanErrorMessage(
            err,
            "We could not send a reset email. Please verify your business email and try again."
          ),
          backTo: "/auth/forgot-password",
          primaryActionLabel: "Try Again",
          primaryActionUrl: "/auth/forgot-password",
          secondaryActionLabel: "Sign In",
          secondaryActionUrl: "/auth/sign-in",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
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
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <MailCheck className="size-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Check your inbox</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            If an account exists for <strong className="text-foreground">{email}</strong>, you'll
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
          <Button variant="default" size="lg" className="w-full" asChild>
            <Link to="/auth/sign-in">Back to sign in</Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              setSent(false);
            }}
          >
            Send to a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">Forgot your password?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email and we'll send you a secure reset link.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
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

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link to="/auth/sign-in" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
