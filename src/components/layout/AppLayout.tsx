import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RotateCcw,
  Wallet,
  BarChart3,
  Settings as SettingsIcon,
  X,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import Header from "./Header";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Catalog & Offers", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/returns", label: "Returns", icon: RotateCcw },
  { to: "/payouts", label: "Payouts", icon: Wallet },
  { to: "/analytics", label: "Try-on Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { seller } = useAuth();

  return (
    <div className="flex h-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/30">
              F
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-white">FitSeller</p>
              <p className="text-[11px] text-zinc-500">fitMirror Partner Portal</p>
            </div>
          </div>
          <button
            className="text-zinc-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300"
                    : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100",
                  isActive && "[&>svg]:text-indigo-400"
                )
              }
            >
              <Icon className="size-[18px]" />
              {label}
              {location.pathname === to && (
                <span className="ml-auto size-1.5 rounded-full bg-indigo-400" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Seller card */}
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-900 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
              {(seller?.business_name ?? "Seller").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-100">
                {seller?.business_name ?? "My Seller Account"}
              </p>
              <p className="flex items-center gap-1 text-xs capitalize text-zinc-500">
                <StoreIcon className="size-3" />
                {seller?.status ?? "pending"} seller
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
