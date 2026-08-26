import { useState, type FormEvent } from "react";
import { Shirt } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input, Label } from "../components/ui/Field";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") await signIn(email.trim(), password);
      else await signUp(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30">
            <Shirt className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">FitSeller</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage your fitMirror store
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur"
        >
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`rounded-lg py-2 text-sm font-medium transition ${
                  mode === m
                    ? "bg-indigo-600 text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" loading={loading} className="mt-6 w-full">
            {mode === "signin" ? "Sign in" : "Create seller account"}
          </Button>

          {mode === "signup" && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              A store will be linked automatically once your seller profile is approved.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

