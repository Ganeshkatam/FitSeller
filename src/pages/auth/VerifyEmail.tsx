import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";

type Phase = "checking" | "verified" | "pending" | "invalid";

export default function VerifyEmail() {
  const { resendVerification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState(
    (location.state as { email?: string } | null)?.email ?? params.get("email") ?? ""
  );
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase consumes the confirmation token in the URL automatically;
  // check whether that produced a session.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session && (data.session.user.email_confirmed_at || !data.session.user.confirmation_sent_at)) {
        setPhase("verified");
      } else {
        setPhase("pending");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleResend(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await resendVerification(email.trim());
      setResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email");
    } finally {
      setSending(false);
    }
  }

  if (phase === "checking") {
    return <Spinner label="Checking verification status…" />;
  }

  if (phase === "verified") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
          <MailCheck className="size-6 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Email verified
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your seller account is active. Welcome aboard!
        </p>
        <Button size="lg" className="mt-6 w-full" onClick={() => navigate("/", { replace: true })}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">Verify your email</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Click the verification link we emailed you, then come back here. Didn't receive it? Send
        another below.
      </p>

      {resent && (
        <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Verification email sent — please check your inbox.
        </p>
      )}

      <form onSubmit={handleResend} className="mt-6 space-y-4">
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

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" loading={sending} disabled={resent} className="w-full">
          {resent ? "Email sent" : "Resend verification email"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already verified?{" "}
        <Link to="/auth/sign-in" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
