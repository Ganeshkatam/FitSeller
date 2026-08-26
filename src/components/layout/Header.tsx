import { useNavigate } from "react-router-dom";
import { Menu, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName =
    profile?.display_name || profile?.full_name || user?.email?.split("@")[0] || "Seller";

  async function handleSignOut() {
    await signOut();
    navigate("/auth/sign-in", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            data-slot="user-menu-trigger"
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3 transition hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 aria-expanded:border-ring aria-expanded:ring-3 aria-expanded:ring-ring/30"
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold uppercase text-primary-foreground">
                {displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-foreground sm:block">
              {displayName}
            </span>
            <span className="hidden text-muted-foreground sm:block">▾</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="truncate">{displayName}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <UserRound className="size-4" /> Seller settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

