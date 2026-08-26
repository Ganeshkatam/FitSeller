import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
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
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
          <MailCheck className="size-6 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Reset link sent</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists for <strong className="text-foreground">{email}</strong>, you'll
          receive a password reset link shortly.
        </p>
        <Button variant="secondary" className="mt-6 w-full" asChild>
          <Link to="/auth/sign-in">Back to sign in</Link>
        </Button>
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
