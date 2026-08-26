import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, MailCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { getHumanErrorMessage } from "@/lib/utils";

function GoogleIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function SignUp() {
  const { signUp, signInWithGoogle, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();

    if (!RULES.every((r) => r.test(password))) {
      return navigate("/error", {
        state: {
          category: "auth",
          code: "password_policy_unmet",
          account: email.trim(),
          title: "Password Requirements Not Met",
          message: "Your password must be at least 8 characters long and include an uppercase letter and a number.",
          backTo: "/auth/sign-up",
          primaryActionLabel: "Review Password",
          primaryActionUrl: "/auth/sign-up",
        },
      });
    }

    if (password !== confirm) {
      return navigate("/error", {
        state: {
          category: "auth",
          code: "password_mismatch",
          account: email.trim(),
          title: "Passwords Do Not Match",
          message: "The entered confirmation password does not match. Please re-enter your password.",
          backTo: "/auth/sign-up",
          primaryActionLabel: "Re-enter Password",
          primaryActionUrl: "/auth/sign-up",
        },
      });
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password);
      setAwaitingVerification(true);
    } catch (err) {
      const raw = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
      let code = "signup_failed";
      if (raw.includes("already registered") || raw.includes("already exists")) {
        code = "already_registered";
      } else if (raw.includes("network") || raw.includes("connection")) {
        code = "network_error";
      }

      navigate("/error", {
        state: {
          category: "auth",
          code,
          account: email.trim(),
          message: getHumanErrorMessage(err, "Unable to create your seller account. Please try again."),
          backTo: "/auth/sign-up",
          primaryActionLabel: code === "already_registered" ? "Sign In Instead" : "Try Again",
          primaryActionUrl: code === "already_registered" ? "/auth/sign-in" : "/auth/sign-up",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    clearAuthError();
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      navigate("/error", {
        state: {
          category: "auth",
          code: "google_oauth_failed",
          account: email.trim() || undefined,
          message: getHumanErrorMessage(err, "Unable to complete Google sign-up."),
          backTo: "/auth/sign-up",
          primaryActionLabel: "Retry Authorization",
          primaryActionUrl: "/auth/sign-up",
        },
      });
      setGoogleLoading(false);
    }
  }

  if (awaitingVerification) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
          <MailCheck className="size-6 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Check your inbox
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a verification link to <strong className="text-foreground">{email}</strong>.
          Click it to activate your seller account.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate("/auth/verify-email", { state: { email } })}>
          I've verified — continue
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link to="/auth/sign-in" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Create your seller account
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Start selling on fitMirror in minutes
      </p>

      {/* Google OAuth Button */}
      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          loading={googleLoading}
          disabled={loading || googleLoading}
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2.5 font-medium border-border/80 hover:bg-muted/50"
        >
          <GoogleIcon className="size-4.5 shrink-0" />
          <span>Sign up with Google</span>
        </Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2.5 text-muted-foreground font-medium">
            or sign up with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Business email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@brand.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ul className="mt-2 space-y-1">
            {RULES.map((r) => {
              const ok = r.test(password);
              return (
                <li
                  key={r.label}
                  className={`flex items-center gap-1.5 text-xs ${
                    ok ? "text-emerald-600" : "text-muted-foreground"
                  }`}
                >
                  <CheckCircle2 className="size-3.5" />
                  {r.label}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" loading={loading} disabled={googleLoading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/sign-in" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

