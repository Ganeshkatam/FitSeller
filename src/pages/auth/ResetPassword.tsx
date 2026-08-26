import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/States";
import { getHumanErrorMessage } from "@/lib/utils";

export default function ResetPassword() {
  const { updatePassword, signOut } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase auto-detects the recovery token in the URL and establishes a
  // session; give it a moment then check.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      return navigate("/error", {
        state: {
          category: "auth",
          code: "password_short",
          title: "Password Too Short",
          message: "Your new password must be at least 8 characters in length.",
          backTo: "/auth/reset-password",
          primaryActionLabel: "Re-enter Password",
          primaryActionUrl: "/auth/reset-password",
        },
      });
    }

    if (password !== confirm) {
      return navigate("/error", {
        state: {
          category: "auth",
          code: "password_mismatch",
          title: "Passwords Do Not Match",
          message: "The entered passwords do not match. Please try setting your password again.",
          backTo: "/auth/reset-password",
          primaryActionLabel: "Re-enter Password",
          primaryActionUrl: "/auth/reset-password",
        },
      });
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(async () => {
        await signOut();
        navigate("/auth/sign-in", { replace: true });
      }, 2500);
    } catch (err) {
      navigate("/error", {
        state: {
          category: "auth",
          code: "reset_update_failed",
          title: "Password Update Incomplete",
          message: getHumanErrorMessage(
            err,
            "Failed to update your password. Your security token may have expired."
          ),
          backTo: "/auth/reset-password",
          primaryActionLabel: "Request New Link",
          primaryActionUrl: "/auth/forgot-password",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <Spinner label="Validating reset link…" />;
  }

  if (!hasSession) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Link expired</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This password reset link is invalid or has expired. Request a new one.
        </p>
        <Button className="mt-6 w-full" asChild>
          <Link to="/auth/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
          <KeyRound className="size-6 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Password updated</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting you to sign in with your new password…
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">Set a new password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a strong password for your seller account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm new password</Label>
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
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}
