import { Link, useNavigate } from "react-router-dom";
import { Shirt, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import type { Seller } from "@/types";

interface OnboardingHeaderProps {
  currentStep?: number;
  seller?: Seller | null;
}

export function OnboardingHeader(_props: OnboardingHeaderProps) {
  const { user, seller, profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/auth/sign-in", { replace: true });
  }

  const userEmail = user?.email || profile?.email;

  return (
    <header className="border-b border-border/80 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex h-13 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Shirt className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-foreground text-base sm:text-lg">
            FitSeller
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {userEmail && (
                <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground bg-muted/40 border border-border/50 px-2.5 py-1 rounded-lg">
                  <User className="size-3.5 text-muted-foreground/70" />
                  <span className="max-w-[170px] truncate font-medium text-foreground text-[11px]">
                    {userEmail}
                  </span>
                </div>
              )}

              {seller?.id && (
                <Link
                  to="/dashboard"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Dashboard
                </Link>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors gap-1.5 border border-border/60 hover:border-destructive/30"
                title="Sign out of current account"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link
              to="/auth/sign-in"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In &rarr;
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
