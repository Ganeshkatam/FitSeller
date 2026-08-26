import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, UserRound, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayName =
    profile?.display_name || profile?.full_name || user?.email?.split("@")[0] || "Seller";

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex-1" />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 py-1.5 pl-1.5 pr-3 transition hover:border-zinc-700 hover:bg-zinc-800"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold uppercase text-white">
            {displayName.slice(0, 2)}
          </span>
          <span className="hidden text-sm font-medium text-zinc-200 sm:block">
            {displayName}
          </span>
          <ChevronDown className="size-4 text-zinc-500" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
            <div className="border-b border-zinc-800 px-4 py-3">
              <p className="truncate text-sm font-medium text-zinc-100">{displayName}</p>
              <p className="truncate text-xs text-zinc-500">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/settings");
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <UserRound className="size-4" /> Store settings
            </button>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-950/40"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
