import { useState, useMemo, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shirt,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Truck,
  CreditCard,
  Layers,
  Sparkles,
  BarChart3,
  HelpCircle,
  ChevronDown,
  Users,
  IndianRupee,
  Lock,
  ShieldCheck,
  Check,
  PackageCheck,
  RotateCcw,
  Sliders,
  ArrowUpRight,
  Menu,
  X,
  Scissors,
  Building2,
  Factory,
  ChevronLeft,
  ChevronRight,
  LogIn,
  ShoppingBag,
  Compass,
  FileCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Field";
import { formatCurrency, formatNumber } from "../lib/utils";

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

const FAQS = [
  {
    q: "What do I need to start selling?",
    a: "You just need a GST number, a bank account for payouts, your business PAN, and photos of your clothes with size details.",
  },
  {
    q: "How much does FitSeller charge?",
    a: "We only charge a simple flat 8% fee when an item is delivered. There are no registration fees, no listing charges, and no monthly subscription costs.",
  },
  {
    q: "How does shipping and doorstep pickup work?",
    a: "When you receive an order, print the prepaid shipping label with one click. Courier partners like BlueDart and Delhivery pick up the package directly from your address.",
  },
  {
    q: "When do I get my money?",
    a: "Your earnings are transferred straight into your bank account every night at 11:30 PM for all delivered orders. You never have to wait 30 days.",
  },
  {
    q: "Can I sell multiple sizes like XS, S, M, L, XL?",
    a: "Yes. You can manage all sizes under a single product listing and track inventory for each size without creating separate listings.",
  },
  {
    q: "How does the 3D virtual try-on help reduce returns?",
    a: "Shoppers can see how your clothes fit their body on a 3D avatar before buying. This gives them confidence in sizing and cuts return rates by up to 68%.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rhea Deshmukh",
    role: "Founder",
    brand: "Aura Linen Wear, Mumbai",
    tag: "Linen & Everyday Wear",
    growth: "+340% Annual Sales",
    avatar: "RD",
    quote:
      "FitSeller helped us take our local boutique nationwide. The doorstep pickups and daily payments make running our business so much easier.",
  },
  {
    name: "Arjun Singhal",
    role: "Co-Founder",
    brand: "Vanguard Streetwear, Delhi",
    tag: "Streetwear & Hoodies",
    growth: "12,400+ Orders Delivered",
    avatar: "AS",
    quote:
      "Managing multiple sizes in one place saves us hours every week. Plus, getting paid every night keeps our cash flow healthy.",
  },
  {
    name: "Meera Krishnan",
    role: "Managing Partner",
    brand: "Kavya Silks & Cottons, Bangalore",
    tag: "Handlooms & Sarees",
    growth: "99.4% On-time Delivery",
    avatar: "MK",
    quote:
      "Getting started on FitSeller took less than an afternoon. The 8% flat fee is completely transparent, and customer support always picks up the phone.",
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Listing & Setup Cost",
    fitseller: "Free / ₹0 to list unlimited clothes",
    legacy: "Monthly fees or charges per item",
  },
  {
    feature: "Platform Commission",
    fitseller: "Flat 8% only when you sell",
    legacy: "25% to 40% + hidden closing cuts",
  },
  {
    feature: "Payout Speed",
    fitseller: "Daily bank deposits at 11:30 PM",
    legacy: "15 to 45 days waiting period",
  },
  {
    feature: "Size Management",
    fitseller: "All sizes (XS–3XL) in one clean listing",
    legacy: "Separate listings for each size",
  },
  {
    feature: "Customer Sizing Help",
    fitseller: "Interactive 3D virtual try-on",
    legacy: "Basic 2D size charts (high returns)",
  },
  {
    feature: "Return Protection",
    fitseller: "Fair return checks protect your earnings",
    legacy: "Heavy return penalties on sellers",
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    tag: "0% Setup Fee",
    accent: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    text: "List your entire clothing catalog for free. Flat 8% fee only when you make a sale.",
    linkText: "Calculate Profit",
    linkUrl: "#calculator",
    icon: IndianRupee,
  },
  {
    id: 2,
    tag: "Daily Payouts",
    accent: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    text: "Earnings deposited straight to your bank account every night at 11:30 PM.",
    linkText: "See How Payouts Work",
    linkUrl: "#interactive-tour",
    icon: CreditCard,
  },
  {
    id: 3,
    tag: "Doorstep Pickup",
    accent: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    text: "BlueDart and Delhivery collect packages directly from your doorstep across India.",
    linkText: "See Shipping Details",
    linkUrl: "#superpowers",
    icon: Truck,
  },
  {
    id: 4,
    tag: "3D Virtual Try-On",
    accent: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    text: "Customers try on your clothes virtually before buying, cutting return rates by 68%.",
    linkText: "Try Interactive Demo",
    linkUrl: "#interactive-tour",
    icon: Shirt,
  },
];

type DemoTab = "dispatch" | "inventory" | "wallet" | "analytics";

export default function SellerLanding() {
  const navigate = useNavigate();
  const [fastEmail, setFastEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Announcement Banner State
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [bannerPaused, setBannerPaused] = useState(false);

  useEffect(() => {
    if (bannerDismissed || bannerPaused) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [bannerDismissed, bannerPaused]);

  // Header Interactive State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Live Demo Workspace State
  const [activeDemoTab, setActiveDemoTab] = useState<DemoTab>("dispatch");
  const [demoOrderPacked, setDemoOrderPacked] = useState(false);
  const [demoStocks, setDemoStocks] = useState<Record<string, number>>({
    XS: 8,
    S: 24,
    M: 36,
    L: 19,
    XL: 12,
  });

  // Profit Simulator State
  const [monthlyOrders, setMonthlyOrders] = useState(320);
  const [avgItemPrice, setAvgItemPrice] = useState(1799);

  const estMonthlyGmv = monthlyOrders * avgItemPrice;
  const fitsellerFee = Math.round(estMonthlyGmv * 0.08); // 8% commission
  const fitsellerNetEarnings = estMonthlyGmv - fitsellerFee;

  // Legacy platform comparison (approx 32% total deductions: 22% commission + 7% ad levy + 3% payment gateway)
  const legacyDeductions = Math.round(estMonthlyGmv * 0.32);
  const legacyNetEarnings = estMonthlyGmv - legacyDeductions;
  const merchantSavings = fitsellerNetEarnings - legacyNetEarnings;

  function handleFastSignUp(e: FormEvent) {
    e.preventDefault();
    if (fastEmail.trim()) {
      navigate(`/auth/sign-up?email=${encodeURIComponent(fastEmail.trim())}`);
    } else {
      navigate("/auth/sign-up");
    }
  }

  function handleStockChange(size: string, delta: number) {
    setDemoStocks((prev) => ({
      ...prev,
      [size]: Math.max(0, (prev[size] ?? 0) + delta),
    }));
  }

  const totalDemoStock = useMemo(
    () => Object.values(demoStocks).reduce((a, b) => a + b, 0),
    [demoStocks]
  );

  const currentBanner = ANNOUNCEMENTS[activeBannerIdx];
  const BannerIcon = currentBanner.icon;

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-indigo-500/20 font-sans">
      {/* ============================================================ */}
      {/* 1. DYNAMIC ANNOUNCEMENT BANNER */}
      {/* ============================================================ */}
      {!bannerDismissed && (
        <div
          onMouseEnter={() => setBannerPaused(true)}
          onMouseLeave={() => setBannerPaused(false)}
          className="relative w-full border-b border-indigo-500/30 bg-gradient-to-r from-slate-950 via-indigo-950/90 to-purple-950 text-white text-xs font-medium py-2.5 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

          <div className="w-full flex items-center justify-between gap-4">
            {/* Left Indicator */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                LIVE UPDATES
              </span>
            </div>

            {/* Center Carousel Active Message */}
            <div className="flex-1 flex items-center justify-center gap-2.5 sm:gap-3 text-center truncate">
              <span
                className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${currentBanner.accent} shrink-0`}
              >
                <BannerIcon className="size-3" />
                <span>{currentBanner.tag}</span>
              </span>

              <span className="text-zinc-200 text-xs truncate">
                {currentBanner.text}
              </span>

              <a
                href={currentBanner.linkUrl}
                className="hidden lg:inline-flex items-center gap-1 text-xs font-bold text-white underline underline-offset-4 hover:text-indigo-300 transition-colors shrink-0 ml-1"
              >
                <span>{currentBanner.linkText}</span>
                <ArrowRight className="size-3" />
              </a>
            </div>

            {/* Right Controls & Dismiss */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1 mr-1">
                {ANNOUNCEMENTS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBannerIdx(idx)}
                    className={`size-1.5 rounded-full transition-all ${
                      activeBannerIdx === idx ? "w-3 bg-white" : "bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Go to announcement ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setActiveBannerIdx(
                    (prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length
                  )
                }
                className="size-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              <button
                onClick={() =>
                  setActiveBannerIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length)
                }
                className="size-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Next announcement"
              >
                <ChevronRight className="size-3.5" />
              </button>

              <button
                onClick={() => setBannerDismissed(true)}
                className="size-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-rose-500/30 text-white/80 hover:text-white transition ml-1"
                aria-label="Dismiss announcement"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. NAVIGATION HEADER */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-2xl transition-all">
        <div className="w-full flex h-20 items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {/* Brand Monogram */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 shadow-lg shadow-indigo-600/30 text-white transition-transform group-hover:scale-105">
              <Shirt className="size-5.5" />
              <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  FitSeller
                </span>
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  SELLER HUB
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Sell clothes online across India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-xs font-semibold text-muted-foreground">
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all ${
                  activeDropdown === "solutions"
                    ? "bg-accent text-foreground"
                    : "hover:text-foreground hover:bg-accent/60"
                }`}
              >
                <span>Brand Solutions</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    activeDropdown === "solutions" ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-0 mt-2 w-[540px] rounded-2xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-2xl animate-rise">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="#testimonials"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 shrink-0">
                        <Scissors className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Designer Boutiques</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Zero listing fees and premium placement for everyday collections and custom designer wear.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#superpowers"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 shrink-0">
                        <Sparkles className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Online Fashion Brands</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Virtual try-on preview for customers and fast nationwide shipping.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#superpowers"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                        <Building2 className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Handloom Houses</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Highlight craft authenticity and receive daily direct bank payouts.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#interactive-tour"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
                        <Factory className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Garment Manufacturers</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Manage all sizes (XS to 3XL) with automated high-volume courier pickups.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#how-it-works"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              How It Works
            </a>

            <a
              href="#superpowers"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              Doorstep Shipping
            </a>

            <a
              href="#calculator"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              Pricing & Fees
            </a>

            <a
              href="#interactive-tour"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              Seller Dashboard
            </a>

            <a
              href="#faqs"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              FAQs
            </a>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold rounded-xl border-border/90 bg-card/80 hover:bg-accent hover:border-border text-foreground px-4.5 h-10 shadow-sm transition-all"
            >
              <Link to="/auth/sign-in">
                <LogIn className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Sign In</span>
              </Link>
            </Button>

            <Button
              size="sm"
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 px-5.5 h-10 transition-all active:scale-[0.98]"
              asChild
            >
              <Link to="/auth/sign-up" className="flex items-center gap-1.5">
                <span>Start Selling</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-accent transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/80 bg-card/95 backdrop-blur-2xl px-6 py-6 space-y-5 animate-rise shadow-2xl">
            <div className="space-y-1">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                How It Works
              </a>
              <a
                href="#superpowers"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Doorstep Shipping
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Pricing & Fees
              </a>
              <a
                href="#interactive-tour"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Seller Dashboard Demo
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Brand Stories
              </a>
              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Help & FAQs
              </a>
            </div>

            <div className="pt-3 border-t border-border/60 flex flex-col gap-2.5">
              <Button
                variant="outline"
                className="w-full justify-center rounded-xl text-xs font-semibold h-11"
                asChild
              >
                <Link to="/auth/sign-in">Sign In</Link>
              </Button>

              <Button
                className="w-full justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-11 shadow-md shadow-indigo-600/30"
                asChild
              >
                <Link to="/auth/sign-up">Start Selling for Free</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 3. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden min-h-[calc(100vh-5rem)] flex items-center py-12 lg:py-0 border-b border-border/50">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 size-[650px] rounded-full bg-indigo-500/10 blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 size-[550px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none -z-10" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-16 items-center">
            {/* Hero Left: Clear Selling Proposition */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="size-4" />
                <span>Sell Your Clothes Online on FitSeller</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-[3.85rem] font-black tracking-tight text-foreground leading-[1.08]">
                Reach millions of fashion shoppers{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  across India.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground font-normal">
                Sell to shoppers in 28,000+ pincodes. Enjoy a flat 8% fee only when you make a sale, zero listing charges, doorstep shipping pickup, and daily bank payouts.
              </p>

              {/* Instant Registration Block */}
              <div className="pt-2 max-w-lg mx-auto lg:mx-0 space-y-3.5">
                <form onSubmit={handleFastSignUp} className="flex flex-col sm:flex-row gap-2.5">
                  <Input
                    type="email"
                    placeholder="Enter your business email"
                    value={fastEmail}
                    onChange={(e) => setFastEmail(e.target.value)}
                    className="h-12 rounded-xl bg-card border-border/90 text-sm shadow-sm px-4"
                  />
                  <Button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/30 text-white shrink-0 text-sm"
                  >
                    <span>Start Selling</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </form>

                {/* 3 Core Trust Pillars */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> Flat 8% Fee Only When Sold
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> Daily Bank Deposits
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> Free to List & Setup
                  </span>
                </div>
              </div>

              {/* Google One-Tap Action */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border bg-card hover:bg-accent text-xs font-bold h-10 px-4.5 shadow-sm"
                  asChild
                >
                  <Link to="/auth/sign-in">
                    <GoogleIcon className="size-4 mr-2" />
                    <span>Sign Up with Google</span>
                  </Link>
                </Button>
                <span className="text-xs text-muted-foreground font-medium">Already have an account? <Link to="/auth/sign-in" className="text-indigo-600 font-bold hover:underline">Log in</Link></span>
              </div>
            </div>

            {/* Hero Right Visual: High-Fashion Studio + Margin Card */}
            <div className="lg:col-span-6 xl:col-span-6 relative">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-indigo-500/10">
                  <img
                    src="/images/landing/fashion-studio.jpg"
                    alt="Fashion designers reviewing clothing collection"
                    className="h-[460px] sm:h-[520px] lg:h-[550px] w-full object-cover object-top filter brightness-[0.96] contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Bottom Showcase Margin Card */}
                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-black/75 p-4.5 backdrop-blur-xl text-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold tracking-tight">Linen Casual Blazer</p>
                        <p className="text-[11px] text-white/70">Aura Studio &bull; Size L</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live on fitMirror</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-2.5 text-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-white/60">Selling Price</p>
                        <p className="text-sm font-extrabold text-white">₹3,499</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-white/60">Platform Fee (8%)</p>
                        <p className="text-sm font-extrabold text-indigo-300">-₹280</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-400">Direct to Your Bank</p>
                        <p className="text-sm font-extrabold text-emerald-400">₹3,219 (92%)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Widget 1: Daily Bank Settlement */}
                <div className="absolute -top-6 -left-6 sm:-left-8 rounded-2xl border border-border bg-card/95 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl max-w-[240px] hidden sm:block">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <IndianRupee className="size-4 text-emerald-600" />
                    <span>Daily Bank Deposit</span>
                  </div>
                  <p className="mt-1 text-2xl font-black text-foreground">₹1,84,320</p>
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <TrendingUp className="size-3.5" /> Sent tonight at 11:30 PM
                  </p>
                </div>

                {/* Floating Widget 2: Fulfillment Status */}
                <div className="absolute -bottom-6 -right-6 sm:-right-8 rounded-2xl border border-border bg-card/95 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl max-w-[250px] hidden sm:block">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                      <Truck className="size-4 text-indigo-600" /> Doorstep Pickup
                    </span>
                    <span className="text-[10px] rounded-md bg-indigo-500/10 text-indigo-600 px-2 py-0.5 font-bold border border-indigo-500/20">
                      DISPATCHED
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">48 Packages Picked Up</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">BlueDart &bull; Delhivery Express</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. KEY STATS BAR */}
      {/* ============================================================ */}
      <section className="w-full border-b border-border/40 bg-muted/20 py-10">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">1,400+</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Clothing Brands & Boutiques
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                28,000+
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Pincodes Served Across India
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                99.8%
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                On-Time Doorstep Pickup
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">₹0</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Listing & Setup Fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. "WHY SELL ON FITSELLER" */}
      {/* ============================================================ */}
      <section id="why-sell" className="w-full py-20 sm:py-28 border-b border-border/50">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Compass className="size-3.5" />
              <span>Why Sell on FitSeller</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Everything you need to sell your clothes across India.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              We take care of doorstep delivery, customer sizing, and fast daily payouts so you can focus on making great clothes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {/* Pillar 1 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                  <ShoppingBag className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Millions of Fashion Shoppers</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Put your clothing collection in front of active buyers looking for daily wear, festive outfits, and designer pieces.
                </p>
              </div>
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                <span>Nationwide Reach</span> <ArrowRight className="size-3" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <Truck className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Doorstep Courier Pickup</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Print prepaid shipping labels with one click. BlueDart and Delhivery pick up packages directly from your doorstep.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span>28,000+ Pincodes</span> <ArrowRight className="size-3" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                  <CreditCard className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Daily Direct Bank Deposits</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  No waiting weeks for your money. Your earnings are deposited directly into your bank account every night at 11:30 PM.
                </p>
              </div>
              <div className="text-xs font-bold text-purple-600 flex items-center gap-1">
                <span>Nightly Settlements</span> <ArrowRight className="size-3" />
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600">
                  <RotateCcw className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">68% Fewer Returns</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Shoppers try on clothes virtually using their 3D avatar before buying, preventing wrong size orders and returns.
                </p>
              </div>
              <div className="text-xs font-bold text-pink-600 flex items-center gap-1">
                <span>3D Virtual Try-On</span> <ArrowRight className="size-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. "HOW TO START SELLING" (4 SIMPLE STEPS) */}
      {/* ============================================================ */}
      <section id="how-it-works" className="w-full py-20 sm:py-28 border-b border-border/50 bg-muted/10">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <FileCheck className="size-3.5" />
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Start selling in 4 simple steps.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Set up your seller account and list your first clothing collection in under 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {/* Step 1 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm relative">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-md shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Create Your Account</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Enter your business name, GST number, and bank account for your daily payouts.
              </p>
              <div className="text-[11px] font-semibold text-indigo-600 pt-2 border-t border-border">
                Takes only 2 minutes
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm relative">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-600 text-white font-black text-lg shadow-md shadow-purple-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">List Your Clothes</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Add photos, choose available sizes (XS to 3XL), write fabric details, and set your price.
              </p>
              <div className="text-[11px] font-semibold text-purple-600 pt-2 border-t border-border">
                All sizes in one listing
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm relative">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-pink-600 text-white font-black text-lg shadow-md shadow-pink-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Pack & Dispatch</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When an order arrives, print the prepaid label in one click and hand the package to the courier.
              </p>
              <div className="text-[11px] font-semibold text-pink-600 pt-2 border-t border-border">
                Prepaid shipping labels
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-sm relative">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-lg shadow-md shadow-emerald-600/30">
                4
              </div>
              <h3 className="text-lg font-bold text-foreground">Receive Daily Money</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Earnings for delivered orders are sent straight to your bank account every night at 11:30 PM.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 pt-2 border-t border-border">
                Direct to your bank
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. INTERACTIVE SELLER DASHBOARD PREVIEW */}
      {/* ============================================================ */}
      <section id="interactive-tour" className="w-full py-20 sm:py-28 border-b border-border/50">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sliders className="size-3.5" />
              <span>Interactive Seller Dashboard</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Run your entire business from one simple dashboard.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Click through the tabs below to try out shipping, inventory tracking, and payout tools.
            </p>

            {/* Tab Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => setActiveDemoTab("dispatch")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "dispatch"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Truck className="size-4" /> 1-Click Shipping
              </button>

              <button
                onClick={() => setActiveDemoTab("inventory")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "inventory"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="size-4" /> Size Stock ({totalDemoStock} Units)
              </button>

              <button
                onClick={() => setActiveDemoTab("wallet")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "wallet"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="size-4" /> Bank Payouts
              </button>

              <button
                onClick={() => setActiveDemoTab("analytics")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "analytics"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="size-4" /> Sales Insights
              </button>
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            {/* Mock Window Titlebar */}
            <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-6 py-3.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 font-semibold text-muted-foreground">
                  Seller Dashboard &mdash; {activeDemoTab === "dispatch" ? "Order Fulfillment" : activeDemoTab === "inventory" ? "Stock Management" : activeDemoTab === "wallet" ? "Daily Payouts" : "Sales Overview"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <Lock className="size-3 text-emerald-600" />
                <span>fitseller.in/dashboard</span>
              </div>
            </div>

            {/* Tab 1: Dispatch */}
            {activeDemoTab === "dispatch" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Order #FS-9482</span>
                      <span className="rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2.5 py-0.5 border border-amber-500/20">
                        {demoOrderPacked ? "LABEL PRINTED & READY" : "READY TO PACK"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mt-1">Oversized Cotton Linen Shirt</h3>
                    <p className="text-xs text-muted-foreground">Size: L &bull; Color: Sand Tan &bull; Delivery to Bangalore, KA</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground font-medium">Your Net Earnings</p>
                    <p className="text-2xl font-black text-emerald-600">{formatCurrency(2299)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs text-muted-foreground font-semibold">Assigned Courier</p>
                    <p className="text-sm font-bold text-foreground mt-1">BlueDart Air Express</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">AWB: BD9481029482</p>
                  </div>

                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs text-muted-foreground font-semibold">Doorstep Pickup</p>
                    <p className="text-sm font-bold text-foreground mt-1">Today, 4:30 PM Slot</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Courier Van Booked</p>
                  </div>

                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs text-muted-foreground font-semibold">Customer Payment</p>
                    <p className="text-sm font-bold text-emerald-600 mt-1">Paid Online via UPI</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Payment Verified</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-foreground">
                    <p className="font-bold text-sm">Try it yourself:</p>
                    <p className="text-muted-foreground text-xs">
                      Click below to print your shipping label and schedule a doorstep pickup.
                    </p>
                  </div>

                  <Button
                    onClick={() => setDemoOrderPacked(!demoOrderPacked)}
                    className={`shrink-0 font-bold text-xs h-10 px-5 rounded-xl ${
                      demoOrderPacked
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {demoOrderPacked ? (
                      <>
                        <Check className="size-4 mr-1.5" /> Label Printed - Ready for Pickup (Reset)
                      </>
                    ) : (
                      <>
                        <PackageCheck className="size-4 mr-1.5" /> Print Shipping Label
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 2: Inventory */}
            {activeDemoTab === "inventory" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Raw Edge Linen Resort Shirt</h3>
                    <p className="text-xs text-muted-foreground">Adjust stock numbers for each size with the + and - buttons</p>
                  </div>
                  <span className="rounded-xl bg-indigo-500/10 text-indigo-600 px-3.5 py-1.5 text-xs font-bold border border-indigo-500/20">
                    Total in Stock: {totalDemoStock} Items
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  {Object.entries(demoStocks).map(([size, count]) => (
                    <div key={size} className="rounded-2xl border border-border p-4 text-center bg-card">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Size {size}</p>
                      <p className="text-3xl font-black text-foreground my-2">{count}</p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStockChange(size, -1)}
                          className="size-8 rounded-lg border border-border bg-muted/40 hover:bg-accent text-sm font-bold text-foreground transition"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleStockChange(size, 1)}
                          className="size-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-muted/30 p-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>Stock levels update in real time for shoppers as soon as you change them.</span>
                  <span className="font-semibold text-emerald-600">Never oversell out-of-stock sizes</span>
                </div>
              </div>
            )}

            {/* Tab 3: Wallet */}
            {activeDemoTab === "wallet" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                    <p className="text-xs font-bold text-emerald-600 uppercase">Ready for Deposit</p>
                    <p className="text-3xl font-black text-foreground mt-1.5">₹84,200</p>
                    <p className="text-xs text-muted-foreground mt-1">Transfers to your bank tonight at 11:30 PM</p>
                  </div>

                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                    <p className="text-xs font-bold text-amber-600 uppercase">Out for Delivery</p>
                    <p className="text-3xl font-black text-foreground mt-1.5">₹32,450</p>
                    <p className="text-xs text-muted-foreground mt-1">Deposited once package is delivered</p>
                  </div>

                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Paid to Bank (Last 30 Days)</p>
                    <p className="text-3xl font-black text-foreground mt-1.5">₹4,92,100</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Sent to your current account</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border p-5 bg-card">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Recent Bank Payouts</p>
                  <div className="divide-y divide-border text-xs">
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Bank Transfer &bull; IMPS #8492019482</p>
                        <p className="text-muted-foreground text-[11px]">Deposited to Current Account ending in **9482</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">+₹34,800</span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Bank Transfer &bull; IMPS #8491048201</p>
                        <p className="text-muted-foreground text-[11px]">Deposited to Current Account ending in **9482</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">+₹49,400</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Analytics */}
            {activeDemoTab === "analytics" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Sales</p>
                    <p className="text-2xl font-black text-foreground mt-1">₹5,75,680</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Net Earnings</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">₹5,29,625</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Pieces Sold</p>
                    <p className="text-2xl font-black text-foreground mt-1">320 pcs</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Return Rate</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">4.2%</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-muted/10 p-5">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-4">
                    <span>14-Day Sales & Daily Orders</span>
                    <span className="text-emerald-600 font-semibold">Updated in real time</span>
                  </div>
                  <div className="h-32 flex items-end gap-2.5 pt-4">
                    {[45, 60, 52, 78, 92, 65, 84, 110, 95, 120, 105, 135, 140, 165].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div
                          className="w-full bg-indigo-600 rounded-t-lg group-hover:bg-indigo-500 transition-all"
                          style={{ height: `${(val / 170) * 100}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground font-mono">{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. PROFIT & PRICING CALCULATOR */}
      {/* ============================================================ */}
      <section id="calculator" className="w-full py-20 sm:py-28 border-b border-border/50 bg-muted/20">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="size-3.5" />
              <span>Profit & Fee Calculator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Calculate your take-home profit.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              We charge a flat 8% fee only when your clothes sell. No listing fees, no closing deductions, and no monthly charges.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Sliders Column */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-foreground">
                      Monthly Clothing Orders
                    </label>
                    <span className="rounded-xl bg-indigo-500/10 px-3.5 py-1 text-sm font-extrabold text-indigo-600">
                      {formatNumber(monthlyOrders)} orders
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="1500"
                    step="10"
                    value={monthlyOrders}
                    onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                    className="w-full h-2.5 rounded-lg bg-muted accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1.5 font-medium">
                    <span>30 orders/mo</span>
                    <span>500 orders/mo</span>
                    <span>1,500 orders/mo</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-foreground">
                      Average Price per Piece
                    </label>
                    <span className="rounded-xl bg-indigo-500/10 px-3.5 py-1 text-sm font-extrabold text-indigo-600">
                      {formatCurrency(avgItemPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="499"
                    max="8999"
                    step="100"
                    value={avgItemPrice}
                    onChange={(e) => setAvgItemPrice(Number(e.target.value))}
                    className="w-full h-2.5 rounded-lg bg-muted accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1.5 font-medium">
                    <span>₹499 (Everyday)</span>
                    <span>₹3,500 (Premium Wear)</span>
                    <span>₹8,999 (Designer Wear)</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 p-5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Estimated Total Monthly Sales:</span>
                  <span className="font-extrabold text-foreground text-base">{formatCurrency(estMonthlyGmv)}</span>
                </div>
              </div>

              {/* Earnings Result Card */}
              <div className="lg:col-span-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 space-y-7 text-center lg:text-left shadow-lg">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Net Money Sent to Your Bank
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-foreground mt-2">
                    {formatCurrency(fitsellerNetEarnings)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                    After flat 8% platform fee ({formatCurrency(fitsellerFee)})
                  </p>
                </div>

                <div className="border-t border-emerald-500/20 pt-5 space-y-2.5 text-xs">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Traditional Marketplace Take:</span>
                    <span className="line-through">{formatCurrency(legacyNetEarnings)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-emerald-600 text-sm">
                    <span>Extra Money You Keep:</span>
                    <span>+{formatCurrency(merchantSavings)} / mo</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-600/25 rounded-xl text-sm"
                  asChild
                >
                  <Link to="/auth/sign-up">
                    <span>Start Selling for Free</span>
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. SIDE-BY-SIDE FEE COMPARISON */}
      {/* ============================================================ */}
      <section id="comparison" className="w-full py-20 sm:py-28 border-b border-border/50">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              FitSeller vs Other Marketplaces.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              See the difference in pricing, payout timelines, and seller support.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-8 py-5 font-bold">What You Get</th>
                    <th className="px-8 py-5 font-bold text-indigo-600 bg-indigo-500/5">FitSeller</th>
                    <th className="px-8 py-5 font-semibold">Other Marketplaces</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-5 font-semibold text-foreground">{row.feature}</td>
                      <td className="px-8 py-5 font-bold text-emerald-600 bg-indigo-500/5 flex items-center gap-2.5">
                        <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" />
                        <span>{row.fitseller}</span>
                      </td>
                      <td className="px-8 py-5 text-muted-foreground font-medium">{row.legacy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. BRAND STORIES */}
      {/* ============================================================ */}
      <section id="testimonials" className="w-full py-20 sm:py-28 border-b border-border/50">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Users className="size-3.5" />
              <span>Brand Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Trusted by fashion brands and designers across India.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-8 space-y-6 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-600">
                      {t.growth}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{t.tag}</span>
                  </div>

                  <p className="text-sm sm:text-base text-foreground/90 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 border-t border-border pt-5">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 font-extrabold text-white text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.brand}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. FAQS */}
      {/* ============================================================ */}
      <section id="faqs" className="w-full py-20 sm:py-28 border-b border-border/50 bg-muted/10">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="size-3.5" />
              <span>Help & FAQs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card overflow-hidden transition">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left text-sm sm:text-base font-bold text-foreground hover:bg-muted/30 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4.5 text-muted-foreground transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. CLOSING CALL TO ACTION */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4.5 py-1.5 text-xs font-bold text-indigo-300 backdrop-blur-md">
            <Sparkles className="size-4" />
            <span>Ready to start selling your clothes online?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Join 1,400+ fashion labels growing on FitSeller today.
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 leading-relaxed font-medium">
            Create your seller account in under 2 minutes. Free setup, doorstep courier pickup, and daily bank payouts.
          </p>

          <div className="max-w-md mx-auto pt-2">
            <form onSubmit={handleFastSignUp} className="flex flex-col sm:flex-row gap-2.5">
              <Input
                type="email"
                placeholder="Enter your business email"
                value={fastEmail}
                onChange={(e) => setFastEmail(e.target.value)}
                className="h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-zinc-400 backdrop-blur-md text-sm px-4"
              />
              <Button
                type="submit"
                className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-xl shadow-indigo-600/40 shrink-0 text-sm"
              >
                <span>Start Selling</span>
                <ArrowUpRight className="size-4 ml-1" />
              </Button>
            </form>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" /> Direct Bank Deposits
            </span>
            <span className="flex items-center gap-2">
              <Lock className="size-4 text-emerald-400" /> Safe & Secure Payments
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" /> Zero Upfront Costs
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. FOOTER */}
      {/* ============================================================ */}
      <footer className="w-full border-t border-border/80 bg-background py-16 text-xs text-muted-foreground">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-12">
          {/* 4-Column Directory */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-10 border-b border-border/60">
            <div className="space-y-3">
              <p className="font-bold text-foreground uppercase tracking-wider text-xs">Selling on FitSeller</p>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#calculator" className="hover:text-foreground transition-colors">Pricing & Fees</a></li>
                <li><a href="#why-sell" className="hover:text-foreground transition-colors">Doorstep Courier Pickup</a></li>
                <li><Link to="/auth/sign-up" className="hover:text-foreground transition-colors">Start Selling</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-foreground uppercase tracking-wider text-xs">Brand Solutions</p>
              <ul className="space-y-2">
                <li><a href="#testimonials" className="hover:text-foreground transition-colors">Designer Boutiques</a></li>
                <li><a href="#superpowers" className="hover:text-foreground transition-colors">Streetwear Labels</a></li>
                <li><a href="#superpowers" className="hover:text-foreground transition-colors">Handlooms & Sarees</a></li>
                <li><a href="#interactive-tour" className="hover:text-foreground transition-colors">Garment Manufacturers</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-foreground uppercase tracking-wider text-xs">Seller Dashboard & Tools</p>
              <ul className="space-y-2">
                <li><a href="#interactive-tour" className="hover:text-foreground transition-colors">1-Click Shipping Labels</a></li>
                <li><a href="#interactive-tour" className="hover:text-foreground transition-colors">Multi-Size Stock (XS–3XL)</a></li>
                <li><a href="#interactive-tour" className="hover:text-foreground transition-colors">Daily Bank Deposits</a></li>
                <li><a href="#interactive-tour" className="hover:text-foreground transition-colors">Sales Reports</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-foreground uppercase tracking-wider text-xs">Support & Trust</p>
              <ul className="space-y-2">
                <li><a href="#faqs" className="hover:text-foreground transition-colors">Seller FAQs</a></li>
                <li><Link to="/auth/sign-in" className="hover:text-foreground transition-colors">Seller Sign In</Link></li>
                <li><a href="mailto:support@fitmirror.in" className="hover:text-foreground transition-colors">Help & Contact</a></li>
                <li><span className="text-emerald-600 font-semibold">Secure Bank Settlements</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Security */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm">
                F
              </div>
              <p>&copy; {new Date().getFullYear()} FitSeller Inc. Built for Indian fashion brands & designers.</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <Lock className="size-3.5" />
              <span>Safe & Secure Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
