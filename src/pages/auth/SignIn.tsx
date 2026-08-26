import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
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

export default function SignIn() {
  const { signIn, signInWithGoogle, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [dismissAlert, setDismissAlert] = useState(false);

  const incomingError =
    (location.state as { error?: string; message?: string } | null)?.error ||
    (location.state as { error?: string; message?: string } | null)?.message ||
    params.get("error") ||
    params.get("message") ||
    authError;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const raw = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
      let code = "auth_failed";
      if (raw.includes("password") || raw.includes("credential")) {
        code = "wrong_password";
      } else if (raw.includes("verify") || raw.includes("unconfirmed")) {
        code = "unverified_email";
      } else if (raw.includes("network") || raw.includes("fetch") || raw.includes("timeout")) {
        code = "network_error";
      }

      navigate("/error", {
        state: {
          category: "auth",
          code,
          account: email.trim(),
          message: getHumanErrorMessage(err, "Incorrect email or password for this seller account."),
          backTo: "/auth/sign-in",
          primaryActionLabel: "Try Again",
          primaryActionUrl: "/auth/sign-in",
          secondaryActionLabel: "Reset Password",
          secondaryActionUrl: `/auth/forgot-password?email=${encodeURIComponent(email.trim())}`,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
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
          message: getHumanErrorMessage(err, "Unable to complete Google authentication."),
          backTo: "/auth/sign-in",
          primaryActionLabel: "Retry Sign In",
          primaryActionUrl: "/auth/sign-in",
        },
      });
      setGoogleLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to manage your fitMirror store
      </p>

      {incomingError && !dismissAlert && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive font-medium">
          <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-destructive" />
          <div className="flex-1 leading-snug">{getHumanErrorMessage(incomingError)}</div>
          <button
            type="button"
            onClick={() => {
              setDismissAlert(true);
              clearAuthError();
            }}
            className="text-destructive/70 hover:text-destructive transition-colors cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Google OAuth Button */}
      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          loading={googleLoading}
          disabled={loading || googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2.5 font-medium border-border/80 hover:bg-muted/50"
        >
          <GoogleIcon className="size-4.5 shrink-0" />
          <span>Continue with Google</span>
        </Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2.5 text-muted-foreground font-medium">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="mb-1.5">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" loading={loading} disabled={googleLoading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to fitMirror?{" "}
        <Link to="/auth/sign-up" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          Create a seller account
        </Link>
      </p>
    </div>
  );
}

