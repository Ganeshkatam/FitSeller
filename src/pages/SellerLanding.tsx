import { useState, useMemo, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shirt,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Truck,
  Zap,
  CreditCard,
  Layers,
  Sparkles,
  BarChart3,
  HelpCircle,
  ChevronDown,
  Users,
  Award,
  IndianRupee,
  Lock,
  ShieldCheck,
  Check,
  PackageCheck,
  RotateCcw,
  Sliders,
  BadgeCheck,
  ArrowUpRight,
  Menu,
  X,
  Scissors,
  Building2,
  Factory,
  Globe,
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
    q: "How fast can I start selling on FitSeller?",
    a: "You can register your merchant account in under 2 minutes. Once your email is verified, you can immediately add products, configure size variants and custom pricing, and start receiving customer orders right away.",
  },
  {
    q: "When and how do I receive my earnings?",
    a: "All earnings are settled directly to your registered Indian bank account via automated IMPS/NEFT transfers. Settlements are processed daily upon order delivery with 0% hidden payment gateway deductions.",
  },
  {
    q: "What are the platform listing and maintenance fees?",
    a: "FitSeller charges 0% platform listing fees and 0% monthly store maintenance fees. We only charge a small 8% performance commission when your apparel items are successfully delivered to buyers.",
  },
  {
    q: "How does shipping and order pickup work?",
    a: "FitSeller partners directly with national courier networks (BlueDart, Delhivery, Xpressbees). When an order is placed, you click once to generate a pre-paid courier label, pack the garment, and our courier partner collects it from your warehouse or boutique.",
  },
  {
    q: "Can I manage apparel with multiple sizes and colors?",
    a: "Yes. Our catalog management system supports complete size matrices (XS, S, M, L, XL, XXL, 3XL), multi-color variants, custom SKU mapping, and individual stock quantity tracking per size.",
  },
  {
    q: "How does the virtual 3D try-on benefit me as a merchant?",
    a: "Buyers on the fitMirror app visualize how garments drape on their exact 3D avatar before buying. This builds buyer confidence, dramatically increases checkout conversion, and reduces sizing-related returns by up to 68%.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rhea Deshmukh",
    role: "Founder & Creative Director",
    brand: "Aura Linen Wear, Mumbai",
    tag: "Minimalist Linen & Pret",
    growth: "+340% YoY Revenue",
    avatar: "RD",
    quote:
      "FitSeller transformed our boutique production into a nationwide brand. The automated courier pickups and daily bank payouts let us focus purely on designing high-quality garments.",
  },
  {
    name: "Arjun Singhal",
    role: "Co-Founder",
    brand: "Vanguard Streetwear, Delhi",
    tag: "Heavyweight Cotton Streetwear",
    growth: "12,400+ Units Shipped",
    avatar: "AS",
    quote:
      "The multi-size inventory matrix and authentic real-time dashboard give us total visibility over GMV and returns. It is the most reliable, honest seller hub we have used in Indian e-commerce.",
  },
  {
    name: "Meera Krishnan",
    role: "Managing Partner",
    brand: "Kavya Silks & Cottons, Bangalore",
    tag: "Artisanal Handlooms & Sarees",
    growth: "99.4% On-time Dispatch",
    avatar: "MK",
    quote:
      "Transitioning our traditional handloom business onto FitSeller took less than an afternoon. The transparent 8% commission and prompt customer support are unmatched.",
  },
];

const CATEGORIES = [
  "Contemporary Pret",
  "Ethnic & Festive Wear",
  "Minimalist Streetwear",
  "Artisanal Handlooms",
  "Luxury Loungewear",
  "Performance Athleisure",
  "D2C Designer Denim",
  "Sustainable Linen",
];

const COMPARISON_ROWS = [
  {
    feature: "Upfront Listing Fees",
    fitseller: "₹0 / Free Unlimited Listings",
    legacy: "₹250 – ₹500 per SKU / month",
  },
  {
    feature: "Platform Commission",
    fitseller: "Transparent 8% Flat",
    legacy: "25% to 40% + Advertising Levy",
  },
  {
    feature: "Bank Settlement Schedule",
    fitseller: "Daily Automated IMPS",
    legacy: "15 to 45 Days Lock-in Period",
  },
  {
    feature: "Inventory & Size Matrix",
    fitseller: "Unified Multi-size (XS–3XL)",
    legacy: "Fragmented Single-item SKUs",
  },
  {
    feature: "Customer 3D Sizing Experience",
    fitseller: "Integrated fitMirror 3D Try-on",
    legacy: "Static 2D Size Charts (high returns)",
  },
  {
    feature: "Return Dispute Protection",
    fitseller: "Fair Automated Inspection Shield",
    legacy: "Heavy Penalties on Merchants",
  },
];

type DemoTab = "dispatch" | "inventory" | "wallet" | "analytics";

export default function SellerLanding() {
  const navigate = useNavigate();
  const [fastEmail, setFastEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-indigo-500/20 font-sans">
      {/* ============================================================ */}
      {/* 1. FULL-WIDTH TOP MICRO TRUST STRIP */}
      {/* ============================================================ */}
      <div className="w-full border-b border-border/40 bg-zinc-950 text-zinc-300 text-[11px] font-medium py-2 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
              <Globe className="size-3.5 text-indigo-400" />
              <span>Pan-India Fashion Commerce &bull; 28,000+ Pin Codes Served</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Logistics & Escrow Payouts Operational</span>
            </span>
          </div>

          <div className="flex items-center gap-5 text-zinc-400">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-indigo-400" />
              <span>RBI-Compliant Escrow Banking</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-zinc-200 font-semibold">
              <IndianRupee className="size-3.5 text-emerald-400" />
              <span>Flat 8% Commission &bull; ₹0 Setup Fee</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. FULL-WIDTH LUXURY FLOATING HEADER */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-2xl transition-all">
        <div className="w-full flex h-20 items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {/* Brand Monogram & Partner Tag */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 shadow-lg shadow-indigo-600/30 text-white transition-transform group-hover:scale-105">
              <Shirt className="size-5.5" />
              <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  FitSeller
                </span>
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  PARTNER
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                fitMirror Apparel Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Mega-Flyouts */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-xs font-semibold text-muted-foreground">
            {/* Merchant Types Mega-Menu Trigger */}
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
                <span>Merchant Types</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    activeDropdown === "solutions" ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>

              {/* Mega-Flyout for Solutions */}
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
                          0% catalog fees, premium editorial curation for luxury pret & bespoke.
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
                        <p className="text-xs font-bold text-foreground">D2C Fashion Labels</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          High-converting 3D try-on previews and same-day national dispatch.
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
                          Authenticity certificate tagging and daily IMPS direct bank deposits.
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
                        <p className="text-xs font-bold text-foreground">Garment Factories</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Unified size matrix (XS–3XL) and high-volume courier pickups.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Platform Capabilities Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("pillars")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all ${
                  activeDropdown === "pillars"
                    ? "bg-accent text-foreground"
                    : "hover:text-foreground hover:bg-accent/60"
                }`}
              >
                <span>Capabilities</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    activeDropdown === "pillars" ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>

              {/* Mega-Flyout for Capabilities */}
              {activeDropdown === "pillars" && (
                <div className="absolute top-full left-0 mt-2 w-[540px] rounded-2xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-2xl animate-rise">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="#superpowers"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 shrink-0">
                        <Truck className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">1-Click Dispatch</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Integrated BlueDart, Delhivery, and Xpressbees door collection.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#superpowers"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                        <CreditCard className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Daily IMPS Payouts</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Funds hit your registered Indian current account every night.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#interactive-tour"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600 shrink-0">
                        <RotateCcw className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">68% Lower Returns</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          3D sizing visualization eliminates customer fit uncertainty.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#superpowers"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition text-left"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 shrink-0">
                        <BarChart3 className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Honest SQL Analytics</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                          Zero fake metrics. 100% verified database transactions.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#interactive-tour"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              Interactive Demo
            </a>

            <a
              href="#calculator"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              Profit Simulator
            </a>

            <a
              href="#comparison"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              Commission Compare
            </a>

            <a
              href="#testimonials"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              Brand Stories
            </a>

            <a
              href="#faqs"
              className="rounded-xl px-3.5 py-2 hover:text-foreground hover:bg-accent/60 transition"
            >
              FAQs
            </a>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex text-xs font-semibold rounded-xl text-foreground hover:bg-accent px-4"
            >
              <Link to="/auth/sign-in">Merchant Sign In</Link>
            </Button>

            <Button
              size="sm"
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 px-5.5 h-10 transition-all active:scale-[0.98]"
              asChild
            >
              <Link to="/auth/sign-up" className="flex items-center gap-1.5">
                <span>Start Selling Free</span>
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
                href="#interactive-tour"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Interactive Demo
              </a>
              <a
                href="#superpowers"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Platform Capabilities
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                Profit Simulator
              </a>
              <a
                href="#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                FitSeller vs Legacy
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
                Support & FAQs
              </a>
            </div>

            <div className="pt-3 border-t border-border/60 flex flex-col gap-2.5">
              <Button
                variant="outline"
                className="w-full justify-center rounded-xl text-xs font-semibold h-11"
                asChild
              >
                <Link to="/auth/sign-in">Merchant Sign In</Link>
              </Button>

              <Button
                className="w-full justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-11 shadow-md shadow-indigo-600/30"
                asChild
              >
                <Link to="/auth/sign-up">Start Selling at 0% Setup Cost</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 3. FULL VIEWPORT IMMERSIVE HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden min-h-[calc(100vh-5rem)] flex items-center py-12 lg:py-0 border-b border-border/50">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 size-[700px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 size-[550px] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none -z-10" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 xl:gap-16 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="size-4" />
                <span>Premier Apparel Merchant Operating System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold tracking-tight text-foreground leading-[1.06]">
                Scale your fashion brand across{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  millions of apparel shoppers.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground">
                0% upfront listing fees, unified multi-size variant tracking (XS&ndash;3XL), 1-click nationwide courier dispatch, and guaranteed daily IMPS bank settlements.
              </p>

              {/* Fast Email Onboarding */}
              <div className="pt-2 max-w-lg mx-auto lg:mx-0 space-y-3">
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
                    <span>Launch Store</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </Button>
                </form>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> 0% Listing Fee
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> Daily IMPS Bank Payouts
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> 2-Min Setup
                  </span>
                </div>
              </div>

              {/* Instant Google Action */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border bg-card/90 hover:bg-accent text-xs font-semibold h-10 px-4"
                  asChild
                >
                  <Link to="/auth/sign-in">
                    <GoogleIcon className="size-4 mr-2" />
                    <span>Quick Sign Up with Google</span>
                  </Link>
                </Button>
                <span className="text-xs text-muted-foreground">or connect an existing store account</span>
              </div>
            </div>

            {/* Hero Right Visual: High-Fashion Studio + Floating Live UI Cards */}
            <div className="lg:col-span-6 xl:col-span-6 relative">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                {/* Main Luxury Fashion Studio Image */}
                <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-indigo-500/10">
                  <img
                    src="/images/landing/fashion-studio.jpg"
                    alt="Fashion designers reviewing luxury apparel collections"
                    className="h-[460px] sm:h-[520px] lg:h-[560px] w-full object-cover object-top filter brightness-[0.96] contrast-[1.04]"
                  />
                  {/* Subtle inner gradient shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* On-image status bar */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/15 bg-black/65 p-4 backdrop-blur-md text-white">
                    <div>
                      <p className="text-sm font-bold">Active Collection &bull; SS 2026</p>
                      <p className="text-xs text-white/70">Aura Linen Studio, Mumbai</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live on fitMirror</span>
                    </div>
                  </div>
                </div>

                {/* Floating Widget 1: Daily Settled Revenue */}
                <div className="absolute -top-6 -left-6 sm:-left-8 rounded-2xl border border-border bg-card/95 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl max-w-[230px] hidden sm:block animate-float">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <IndianRupee className="size-4 text-emerald-600" />
                    <span>Daily Net Payout</span>
                  </div>
                  <p className="mt-1 text-2xl font-black text-foreground">₹1,84,320</p>
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <TrendingUp className="size-3.5" /> Transferred via IMPS
                  </p>
                </div>

                {/* Floating Widget 2: Courier Dispatch Status */}
                <div className="absolute -bottom-6 -right-6 sm:-right-8 rounded-2xl border border-border bg-card/95 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl max-w-[240px] hidden sm:block">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Truck className="size-4 text-indigo-600" /> Courier Pickup
                    </span>
                    <span className="text-[10px] rounded-md bg-indigo-500/10 text-indigo-600 px-2 py-0.5 font-extrabold">
                      READY
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">48 Parcels Picked Up</p>
                  <p className="text-xs text-muted-foreground mt-0.5">BlueDart &bull; Delhivery Air Express</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FULL-WIDTH APPAREL CATEGORIES TICKER */}
      {/* ============================================================ */}
      <div className="w-full border-b border-border/40 bg-muted/25 py-4 overflow-x-auto scrollbar-none">
        <div className="w-full flex items-center justify-between gap-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 min-w-max text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <span className="text-foreground flex items-center gap-2">
            <Award className="size-4 text-indigo-600" /> Categories Selling Live:
          </span>
          {CATEGORIES.map((cat, i) => (
            <span key={i} className="hover:text-foreground transition-colors cursor-default">
              &bull; {cat}
            </span>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. FULL-WIDTH INTERACTIVE LIVE WORKSPACE DEMO */}
      {/* ============================================================ */}
      <section id="interactive-tour" className="w-full py-20 sm:py-28 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sliders className="size-3.5" />
              <span>Experience The Workspace</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              A seller command center engineered for real speed.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Try the interactive modules below. See how easily you fulfill orders, manage multi-size garment inventory, track bank payouts, and audit honest metrics.
            </p>

            {/* Interactive Tab Switcher */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => setActiveDemoTab("dispatch")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "dispatch"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Truck className="size-4" /> 1-Click Dispatch
              </button>

              <button
                onClick={() => setActiveDemoTab("inventory")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "inventory"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="size-4" /> Size Matrix ({totalDemoStock} Units)
              </button>

              <button
                onClick={() => setActiveDemoTab("wallet")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "wallet"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="size-4" /> Daily Payout Ledger
              </button>

              <button
                onClick={() => setActiveDemoTab("analytics")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeDemoTab === "analytics"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="size-4" /> Authentic Analytics
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
                  FitSeller Partner Hub &mdash; {activeDemoTab.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <Lock className="size-3 text-emerald-600" />
                <span>fitseller.fitmirror.in/dashboard</span>
              </div>
            </div>

            {/* Interactive Tab 1: Dispatch Demo */}
            {activeDemoTab === "dispatch" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Order #FS-9482</span>
                      <span className="rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2.5 py-0.5 border border-amber-500/20">
                        {demoOrderPacked ? "COURIER MANIFESTED" : "AWAITING PACKING"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mt-1">Oversized Khadi Cotton Blazer</h3>
                    <p className="text-xs text-muted-foreground">Size: L &bull; Color: Sandstone Tan &bull; Buyer: Bangalore, KA</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground font-medium">Your Net Earnings</p>
                    <p className="text-2xl font-black text-emerald-600">{formatCurrency(2299)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs text-muted-foreground font-semibold">Assigned Courier</p>
                    <p className="text-sm font-bold text-foreground mt-1">BlueDart Air Surface</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">AWB: BD9481029482</p>
                  </div>

                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs text-muted-foreground font-semibold">Warehouse Pickup</p>
                    <p className="text-sm font-bold text-foreground mt-1">Today, 4:30 PM Slot</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Courier Van En Route</p>
                  </div>

                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs text-muted-foreground font-semibold">Customer Payment</p>
                    <p className="text-sm font-bold text-emerald-600 mt-1">Paid via UPI Instant</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Escrow Secured</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-foreground">
                    <p className="font-bold text-sm">Interactive Action Test:</p>
                    <p className="text-muted-foreground text-xs">
                      Click below to generate the pre-paid courier label and notify courier dispatch.
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
                        <Check className="size-4 mr-1.5" /> Manifest Printed & Dispatched (Reset)
                      </>
                    ) : (
                      <>
                        <PackageCheck className="size-4 mr-1.5" /> 1-Click Print Label & Pack
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Interactive Tab 2: Inventory Demo */}
            {activeDemoTab === "inventory" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Raw Edge Linen Resort Shirt</h3>
                    <p className="text-xs text-muted-foreground">Test changing size stock quantities in real time below</p>
                  </div>
                  <span className="rounded-xl bg-indigo-500/10 text-indigo-600 px-3.5 py-1.5 text-xs font-bold border border-indigo-500/20">
                    Total Inventory: {totalDemoStock} Units
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
                  <span>Stock levels automatically synchronize across the fitMirror consumer catalog in real time.</span>
                  <span className="font-semibold text-emerald-600">Zero overselling protection guaranteed</span>
                </div>
              </div>
            )}

            {/* Interactive Tab 3: Wallet Demo */}
            {activeDemoTab === "wallet" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                    <p className="text-xs font-bold text-emerald-600 uppercase">Available to Settle</p>
                    <p className="text-3xl font-black text-foreground mt-1.5">₹84,200</p>
                    <p className="text-xs text-muted-foreground mt-1">Auto-scheduled for 11:30 PM IMPS</p>
                  </div>

                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                    <p className="text-xs font-bold text-amber-600 uppercase">In Courier Transit</p>
                    <p className="text-3xl font-black text-foreground mt-1.5">₹32,450</p>
                    <p className="text-xs text-muted-foreground mt-1">Releases upon order delivery</p>
                  </div>

                  <div className="rounded-2xl border border-border p-5 bg-muted/20">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Total Settled (30d)</p>
                    <p className="text-3xl font-black text-foreground mt-1.5">₹4,92,100</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Direct to Current Bank A/c</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border p-5 bg-card">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Recent Transfer Feeds</p>
                  <div className="divide-y divide-border text-xs">
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">IMPS Auto-Transfer &bull; Reference #8492019482</p>
                        <p className="text-muted-foreground text-[11px]">Settled to Current A/c **9482</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">+₹34,800</span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">IMPS Auto-Transfer &bull; Reference #8491048201</p>
                        <p className="text-muted-foreground text-[11px]">Settled to Current A/c **9482</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">+₹49,400</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Tab 4: Analytics Demo */}
            {activeDemoTab === "analytics" && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Gross GMV</p>
                    <p className="text-2xl font-black text-foreground mt-1">₹5,75,680</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Net Earnings</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">₹5,29,625</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Units Sold</p>
                    <p className="text-2xl font-black text-foreground mt-1">320 pcs</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4 bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Return Rate</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">4.2%</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-muted/10 p-5">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-4">
                    <span>14-Day Sales Velocity (Real Database Aggregations)</span>
                    <span className="text-emerald-600">Zero Fabricated Data Guarantee</span>
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
      {/* 6. FULL-WIDTH BENTO GRID OF CORE SELLER SUPERPOWERS */}
      {/* ============================================================ */}
      <section id="superpowers" className="w-full py-20 sm:py-28 border-b border-border/50">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Zap className="size-3.5" />
              <span>The Merchant Advantage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Engineered exclusively for fashion apparel commerce.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Legacy marketplaces treat fashion like consumer electronics. FitSeller is tailored from the ground up for apparel margins, garment sizing, and quick turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {/* Bento Card 1: 0% Listing + 8% Commission */}
            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <IndianRupee className="size-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">0% Listing Fees &bull; 8% Flat Commission</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Keep up to 92% of your garment value. No catalog onboarding fees, no compulsory advertising levies, and no hidden payment gateway cuts.
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-600 flex items-center gap-2">
                <Check className="size-4" /> Save over 24% compared to legacy marketplaces
              </div>
            </div>

            {/* Bento Card 2: Packaging & Courier Logistics with Photo Backdrop */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:border-indigo-500/40 transition-all relative flex flex-col justify-between group">
              <div className="h-52 w-full relative overflow-hidden">
                <img
                  src="/images/landing/packaging-dispatch.jpg"
                  alt="Aura and Co garment packaging and dispatch"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              </div>
              <div className="p-8 pt-3 space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Automated Doorstep Courier Pickup</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  BlueDart, Delhivery, and Xpressbees integrated directly. Print pre-paid labels in 1 click; couriers arrive directly at your studio or warehouse.
                </p>
              </div>
            </div>

            {/* Bento Card 3: Daily Bank IMPS */}
            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                  <CreditCard className="size-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Daily Direct IMPS Settlements</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Say goodbye to 30-day payout freezes. As soon as your garments reach buyers, funds are auto-transferred to your Indian current account daily.
                </p>
              </div>
              <div className="rounded-xl bg-indigo-500/10 p-3.5 text-xs font-bold text-indigo-600 flex items-center gap-2">
                <Check className="size-4" /> Automated 11:30 PM nightly bank clearing
              </div>
            </div>

            {/* Bento Card 4: Multi-Size Matrix */}
            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                  <Layers className="size-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Unified Apparel Size Matrix</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Easily configure XS through 3XL, custom fits, and color variants without cluttering your catalog or duplicating listings.
                </p>
              </div>
              <p className="text-xs font-mono font-bold text-muted-foreground">XS &bull; S &bull; M &bull; L &bull; XL &bull; XXL &bull; 3XL</p>
            </div>

            {/* Bento Card 5: Try-On Margin Shield */}
            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600">
                  <RotateCcw className="size-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Low Returns Via 3D Sizing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Buyers visualize drape and fit before buying on fitMirror, eliminating sizing guesswork and reducing unnecessary returns by up to 68%.
                </p>
              </div>
              <div className="rounded-xl bg-pink-500/10 p-3.5 text-xs font-bold text-pink-600 flex items-center gap-2">
                <ShieldCheck className="size-4" /> Automated seller dispute protection
              </div>
            </div>

            {/* Bento Card 6: Zero Data Faking Guarantee */}
            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <BarChart3 className="size-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">100% Authentic Database Data</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Strict SQL provenance across all metrics. Zero simulated views, zero artificial engagement spikes, and zero fake business numbers.
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-3.5 text-xs font-bold text-blue-600 flex items-center gap-2">
                <BadgeCheck className="size-4" /> Verified real-time order ledger
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FULL-WIDTH DYNAMIC EARNINGS & PROFIT SIMULATOR */}
      {/* ============================================================ */}
      <section id="calculator" className="w-full py-20 sm:py-28 border-b border-border/50 bg-muted/20">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="size-3.5" />
              <span>Interactive ROI Simulator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Calculate how much more you keep on FitSeller.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Slide to your monthly shipment volume and average garment price to see the dramatic difference in your net take-home bank earnings.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Sliders Column */}
              <div className="lg:col-span-7 space-y-8">
                {/* Orders Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-foreground">
                      Monthly Garment Orders
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

                {/* Garment Price Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-foreground">
                      Average Garment Price
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
                    <span>₹3,500 (Pret)</span>
                    <span>₹8,999 (Luxury/Festive)</span>
                  </div>
                </div>

                {/* Monthly GMV Summary */}
                <div className="rounded-2xl border border-border bg-muted/20 p-5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Projected Gross Monthly Turnover (GMV):</span>
                  <span className="font-extrabold text-foreground text-base">{formatCurrency(estMonthlyGmv)}</span>
                </div>
              </div>

              {/* Earnings Result Card */}
              <div className="lg:col-span-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 space-y-7 text-center lg:text-left shadow-lg">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Your Net Monthly Bank Earnings
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
                    <span>Extra Cash in Your Bank:</span>
                    <span>+{formatCurrency(merchantSavings)} / mo</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-600/25 rounded-xl text-sm"
                  asChild
                >
                  <Link to="/auth/sign-up">
                    <span>Claim Your 0% Setup Store</span>
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FULL-WIDTH COMPARISON TABLE */}
      {/* ============================================================ */}
      <section id="comparison" className="w-full py-20 sm:py-28 border-b border-border/50">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Built for merchants, not predatory commissions.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              See why independent fashion labels, boutiques, and apparel designers are migrating their inventory to FitSeller.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-8 py-5 font-bold">Platform Dimension</th>
                    <th className="px-8 py-5 font-extrabold text-indigo-600 bg-indigo-500/5">FitSeller Merchant</th>
                    <th className="px-8 py-5 font-semibold">Legacy Marketplaces</th>
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
      {/* 9. FULL-WIDTH ONBOARDING ROADMAP */}
      {/* ============================================================ */}
      <section className="w-full py-20 sm:py-28 border-b border-border/50 bg-muted/10">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Launch your online store in three simple steps.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              No technical expertise, coding, or lengthy approval queues required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600 font-extrabold text-white text-xl shadow-lg shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-2xl font-bold text-foreground">Register Merchant Profile</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Provide your business email and brand name in under 2 minutes. Get instant access to your seller portal.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-600 font-extrabold text-white text-xl shadow-lg shadow-purple-600/30">
                2
              </div>
              <h3 className="text-2xl font-bold text-foreground">Upload Garment Catalog</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add your styles, define size splits (XS–3XL), set your pricing, and publish active selling offers.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 space-y-5 shadow-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600 font-extrabold text-white text-xl shadow-lg shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-2xl font-bold text-foreground">Ship & Receive Daily Payouts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When buyers purchase, print courier labels with 1 click. Orders are collected from your door and paid daily into your bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. FULL-WIDTH TESTIMONIALS */}
      {/* ============================================================ */}
      <section id="testimonials" className="w-full py-20 sm:py-28 border-b border-border/50">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Users className="size-3.5" />
              <span>Merchant Voices</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Loved by independent designers and fashion houses.
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
                    <span className="rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-extrabold text-indigo-600">
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
      {/* 11. FULL-WIDTH FREQUENTLY ASKED QUESTIONS */}
      {/* ============================================================ */}
      <section id="faqs" className="w-full py-20 sm:py-28 border-b border-border/50 bg-muted/10">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="size-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
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
      {/* 12. FULL-WIDTH HIGH-IMPACT CLOSING CTA */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4.5 py-1.5 text-xs font-bold text-indigo-300 backdrop-blur-md">
            <Sparkles className="size-4" />
            <span>Ready to scale your fashion label nationwide?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Join 1,400+ fashion merchants growing on FitSeller today.
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 leading-relaxed font-medium">
            Register your store in under 2 minutes. Zero listing fees, automated courier dispatch, and daily bank payouts.
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
                <span>Open Store</span>
                <ArrowUpRight className="size-4 ml-1" />
              </Button>
            </form>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" /> RBI Compliant IMPS Settlement
            </span>
            <span className="flex items-center gap-2">
              <Lock className="size-4 text-emerald-400" /> TLS 256-Bit Encrypted
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" /> 0% Upfront Setup Cost
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. FULL-WIDTH EDITORIAL FOOTER */}
      {/* ============================================================ */}
      <footer className="w-full border-t border-border/80 bg-background py-14 text-xs text-muted-foreground">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-border/60 pb-10">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-base">
                F
              </div>
              <span className="text-lg font-black text-foreground tracking-tight">FitSeller Merchant Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-semibold">
              <Link to="/auth/sign-in" className="hover:text-foreground transition-colors">
                Merchant Sign In
              </Link>
              <Link to="/auth/sign-up" className="hover:text-foreground transition-colors">
                Register Store
              </Link>
              <a href="#calculator" className="hover:text-foreground transition-colors">
                Profit Simulator
              </a>
              <a href="#faqs" className="hover:text-foreground transition-colors">
                Support & FAQs
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
            <p>&copy; {new Date().getFullYear()} FitSeller Inc. Engineered exclusively for Indian fashion merchants.</p>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <Lock className="size-3.5" />
              <span>TLS 256-bit Encrypted Commerce Engine</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
