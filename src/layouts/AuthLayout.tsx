import { useCallback, useRef, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  Shirt,
  PackageCheck,
  RotateCcw,
  Wallet,
  TrendingUp,
  Users,
  ShieldCheck,
  KeyRound,
  Lock,
  Sparkles,
  BadgeCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

interface RouteFeature {
  icon: LucideIcon;
  label: string;
}

interface RouteHeroContent {
  image: string;
  tag: string;
  headline: string;
  sub: string;
  features: RouteFeature[];
  badgeText: string;
}

const ROUTE_CONTENT: Record<string, RouteHeroContent> = {
  "/auth/sign-in": {
    image: "/images/auth/sign-in.jpg",
    tag: "Merchant Hub",
    headline: "Welcome back to your seller command center",
    sub: "Manage live orders, monitor daily sales revenue, and fulfill shipments with accurate data.",
    badgeText: "Fulfillment & Operations",
    features: [
      { icon: PackageCheck, label: "Live order processing & dispatch tracking" },
      { icon: RotateCcw, label: "Integrated return request inspection & management" },
      { icon: Wallet, label: "Direct seller revenue calculation & wallet payouts" },
    ],
  },
  "/auth/sign-up": {
    image: "/images/auth/sign-up.jpg",
    tag: "Brand Growth",
    headline: "Expand your reach to fashion shoppers",
    sub: "List your apparel collection on fitMirror and scale your brand with transparent merchant tiers.",
    badgeText: "Merchant Onboarding",
    features: [
      { icon: TrendingUp, label: "Direct product listing and multi-size catalogs" },
      { icon: Users, label: "Active fashion shoppers and verified order flow" },
      { icon: BadgeCheck, label: "Streamlined seller setup with secure authentication" },
    ],
  },
  "/auth/forgot-password": {
    image: "/images/auth/forgot-password.jpg",
    tag: "Account Security",
    headline: "Bank-grade protection for your seller account",
    sub: "We enforce strict security controls to safeguard your seller revenue, customer data, and bank details.",
    badgeText: "Access Recovery",
    features: [
      { icon: ShieldCheck, label: "End-to-end encrypted session authentication" },
      { icon: Lock, label: "Expiring single-use recovery tokens sent to your inbox" },
      { icon: KeyRound, label: "Automated session invalidation on password updates" },
    ],
  },
  "/auth/reset-password": {
    image: "/images/auth/reset-password.jpg",
    tag: "Credential Safety",
    headline: "Protect your seller account credentials",
    sub: "Set a strong, private password to keep your seller settings and banking settlements completely secure.",
    badgeText: "Security Update",
    features: [
      { icon: Lock, label: "Multi-factor authentication & encrypted storage" },
      { icon: ShieldCheck, label: "Protected access for authorized sellers" },
      { icon: CheckCircle2, label: "Instant session verification and token refresh" },
    ],
  },
  "/auth/verify-email": {
    image: "/images/auth/verify-email.jpg",
    tag: "Account Activation",
    headline: "You're one step away from live selling",
    sub: "Confirm your registered business email to unlock your seller portal, list products, and start earning.",
    badgeText: "Seller Verification",
    features: [
      { icon: Sparkles, label: "Instant catalog listing and inventory upload" },
      { icon: Wallet, label: "Automated wallet initialization for bank payouts" },
      { icon: PackageCheck, label: "Access to live fulfillment and seller analytics" },
    ],
  },
};

const DEFAULT_CONTENT = ROUTE_CONTENT["/auth/sign-in"];

export default function AuthLayout() {
  const location = useLocation();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  const active = ROUTE_CONTENT[location.pathname] ?? DEFAULT_CONTENT;

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
      frame.current = null;
    });
  }, []);

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-background">
      {/* Left visual showcase panel (Route-specific image & messaging) */}
      <div
        onMouseMove={onMouseMove}
        className="relative hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between overflow-hidden bg-zinc-950 p-10 xl:p-16 select-none"
      >
        {/* Background route-specific image with smooth crossfade */}
        <div className="absolute inset-0 z-0">
          <div
            key={active.image}
            className="absolute inset-0 transition-opacity duration-700 ease-out will-change-transform motion-safe:animate-rise"
          >
            <img
              src={active.image}
              alt=""
              draggable={false}
              className="size-full object-cover object-center"
              style={{
                transform: `scale(1.04) translate3d(${mouse.x * -14}px, ${mouse.y * -10}px, 0)`,
                transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>

          {/* Deep cinematic overlays for crisp white text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-zinc-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/40 to-transparent" />

          {/* Decorative ambient glowing orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-indigo-600/25 blur-3xl"
            style={{ transform: `translate3d(${mouse.x * 35}px, ${mouse.y * 25}px, 0)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-10 bottom-20 size-80 rounded-full bg-purple-600/20 blur-3xl"
            style={{ transform: `translate3d(${mouse.x * -30}px, ${mouse.y * -20}px, 0)` }}
          />
        </div>

        {/* Top brand header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/40">
              <Shirt className="size-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">FitSeller</span>
              <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                SELLER PORTAL
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md border border-white/15">
            <Sparkles className="size-3.5 text-indigo-400" />
            <span>{active.tag}</span>
          </div>
        </div>

        {/* Middle hero content with route-specific animation */}
        <div
          key={location.pathname}
          className="relative z-10 my-auto max-w-xl py-12 motion-safe:animate-rise"
          style={{
            transform: `translate3d(${mouse.x * 8}px, ${mouse.y * 6}px, 0)`,
          }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20 backdrop-blur-sm">
            <span>{active.badgeText}</span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl drop-shadow-md">
            {active.headline}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-200 xl:text-lg drop-shadow">
            {active.sub}
          </p>

          <div className="mt-8 space-y-3">
            {active.features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-4 py-2.5 backdrop-blur-md border border-white/10 text-white/95"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-300">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10">
          <p className="text-xs font-medium text-zinc-300">
            FitSeller Merchant Platform
          </p>
          <p className="text-xs text-zinc-400">
            E-commerce seller portal & fulfillment operations
          </p>
        </div>
      </div>

      {/* Right authentication form container */}
      <div className="lg:col-span-6 xl:col-span-5 flex min-h-screen flex-col justify-between p-6 sm:p-10 lg:p-12 bg-zinc-50/60 dark:bg-zinc-950/30">
        {/* Mobile top header */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30">
              <Shirt className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">FitSeller</span>
          </div>
          <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            Seller Portal
          </span>
        </div>

        {/* Center form card */}
        <div className="my-auto flex w-full justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 sm:p-8">
              <Outlet key={location.pathname} />
            </div>
          </div>
        </div>

        {/* Bottom subtle legal footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-t border-border/40 pt-4">
          <p>&copy; {new Date().getFullYear()} FitSeller Inc.</p>
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


