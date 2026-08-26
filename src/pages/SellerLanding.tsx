import { useState, type FormEvent } from "react";
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
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Field";

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
    a: "You can register your merchant account in under 2 minutes. Once your email is verified, you can immediately add products, set size variants and custom pricing, and start receiving customer orders.",
  },
  {
    q: "When and how do I receive my earnings?",
    a: "All earnings are settled directly to your registered Indian bank account via automated IMPS/NEFT transfers. Settlements are processed daily upon order delivery with zero hidden payment gateway fees.",
  },
  {
    q: "What are the platform listing and maintenance fees?",
    a: "FitSeller charges 0% platform listing fees and 0% monthly store maintenance fees. We only charge a small performance-based commission when your apparel items are successfully delivered to customers.",
  },
  {
    q: "How does shipping and order pickup work?",
    a: "FitSeller integrates with national courier networks. When an order arrives, you generate a shipping label with one click, pack the garment, and our courier partners pick it up directly from your warehouse or boutique.",
  },
  {
    q: "Can I manage apparel with multiple sizes and colors?",
    a: "Yes. Our catalog management system supports complete size matrices (XS, S, M, L, XL, XXL, 3XL), multi-color variants, custom SKU mapping, and individual stock quantities per size.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rhea Deshmukh",
    role: "Founder & Creative Director",
    brand: "Aura Linen Wear, Mumbai",
    stat: "+340% YoY Growth",
    quote:
      "FitSeller transformed our boutique production into a nationwide D2C brand. The automated courier pickup and same-day payouts allow us to focus purely on designing high-quality garments.",
  },
  {
    name: "Arjun Singhal",
    role: "Co-Founder",
    brand: "Vanguard Streetwear, Delhi",
    stat: "12,000+ Monthly Units",
    quote:
      "The multi-size inventory management and authentic real-time dashboard give us total visibility over GMV and returns without any fabricated metrics. It's the most reliable seller hub we've used.",
  },
  {
    name: "Meera Krishnan",
    role: "Managing Partner",
    brand: "Kavya Silks & Cottons, Bangalore",
    stat: "99.4% Dispatch Rate",
    quote:
      "Transitioning our traditional handloom business onto FitSeller took less than an afternoon. The transparent commission structure and prompt customer support are unmatched in Indian e-commerce.",
  },
];

export default function SellerLanding() {
  const navigate = useNavigate();
  const [fastEmail, setFastEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Profit Calculator State
  const [monthlyOrders, setMonthlyOrders] = useState(250);
  const [avgItemPrice, setAvgItemPrice] = useState(1499);

  const estMonthlyGmv = monthlyOrders * avgItemPrice;
  const estPlatformCommission = Math.round(estMonthlyGmv * 0.08); // 8% commission
  const estNetEarnings = estMonthlyGmv - estPlatformCommission;

  function handleFastSignUp(e: FormEvent) {
    e.preventDefault();
    if (fastEmail.trim()) {
      navigate(`/auth/sign-up?email=${encodeURIComponent(fastEmail.trim())}`);
    } else {
      navigate("/auth/sign-up");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/20">
      {/* 1. Global Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9.5 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 text-white">
              <Shirt className="size-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground">FitSeller</span>
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                MERCHANT
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Platform Features
            </a>
            <a href="#calculator" className="hover:text-foreground transition-colors">
              Earnings Calculator
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">
              Success Stories
            </a>
            <a href="#faqs" className="hover:text-foreground transition-colors">
              FAQs
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-xs font-medium">
              <Link to="/auth/sign-in">Merchant Sign In</Link>
            </Button>

            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-sm text-xs" asChild>
              <Link to="/auth/sign-up">Start Selling Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 border-b border-border/40">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 size-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="size-3.5" />
                <span>Next-Generation Fashion Merchant Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Scale your fashion brand across{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  millions of apparel shoppers.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed text-muted-foreground">
                Enjoy 0% platform listing fees, automated courier dispatch, real-time multi-size inventory sync, and guaranteed same-day INR bank settlements.
              </p>

              {/* Fast Onboarding Input */}
              <div className="pt-2 max-w-md mx-auto lg:mx-0">
                <form onSubmit={handleFastSignUp} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your business email"
                    value={fastEmail}
                    onChange={(e) => setFastEmail(e.target.value)}
                    className="h-11 bg-card/80 border-border"
                  />
                  <Button type="submit" size="lg" className="h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold shrink-0">
                    <span>Create Store</span>
                    <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </form>

                <div className="mt-3 flex items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
                  <Link
                    to="/auth/sign-up"
                    className="flex items-center gap-1.5 font-medium text-foreground hover:text-indigo-600 transition-colors"
                  >
                    <GoogleIcon className="size-3.5" />
                    <span>One-click Google Sign Up</span>
                  </Link>
                  <span>•</span>
                  <span>Free 2-minute setup</span>
                </div>
              </div>

              {/* Key trust bullets */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>0% Listing Fee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Automated Courier Pickup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Same-Day Bank Payouts</span>
                </div>
              </div>
            </div>

            {/* Right Visual Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl border border-border/80 bg-card/40 p-2.5 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-zinc-900">
                  <img
                    src="/images/landing/hero.jpg"
                    alt="FitSeller Fashion Merchant Studio"
                    className="h-full w-full object-cover object-center filter brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Live Metric Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-black/60 backdrop-blur-md p-4 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold flex items-center gap-1.5">
                        <TrendingUp className="size-4 text-emerald-400" />
                        <span>Live Apparel Operations</span>
                      </span>
                      <span className="text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5">
                        ACTIVE STORE
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-white/10">
                      <div>
                        <p className="text-[10px] uppercase text-zinc-400">Net Settled</p>
                        <p className="text-sm font-bold text-white">₹1.84L+</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-zinc-400">Dispatch</p>
                        <p className="text-sm font-bold text-emerald-400">99.8%</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-zinc-400">Fulfillment</p>
                        <p className="text-sm font-bold text-indigo-300">Same-Day</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Platform Trust Bar */}
      <section className="border-b border-border/40 bg-muted/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">1,200+</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Verified Apparel Brands
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                ₹18.4 Cr+
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Settled GMV
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                99.8%
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                On-Time Courier Dispatch
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">₹0</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Listing & Setup Fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features & Platform Pillars */}
      <section id="features" className="py-20 sm:py-28 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Award className="size-3.5" />
              <span>Built for High-Growth Apparel Brands</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Everything you need to run a modern fashion store.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enterprise-grade apparel commerce tools designed for fashion designers, D2C streetwear labels, and boutique retailers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Layers className="size-5.5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Multi-Size Catalog Matrix</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Manage complete size matrices (XS to 3XL), fabric specs, and multi-color variants with automated SKU mapping.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Truck className="size-5.5" />
              </div>
              <h3 className="text-base font-bold text-foreground">1-Click Courier Dispatch</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Automated shipping label generation, door-step courier pickup scheduling, and live tracking across India.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <CreditCard className="size-5.5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Same-Day Bank Settlements</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Automated wallet ledger with direct INR bank account transfers upon order delivery. Zero hidden deductions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BarChart3 className="size-5.5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Real Sales & Return Stats</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Authentic business metrics derived from live order items: Net Revenue, GMV, AOV, and return rate diagnostics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Earnings & Profit Calculator */}
      <section id="calculator" className="py-20 sm:py-28 bg-muted/30 border-b border-border/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <IndianRupee className="size-3.5" />
              <span>Transparent Profit Estimator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Calculate your estimated monthly earnings
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust your expected order volume and average garment price to see your projected bank payout.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Slider 1: Monthly Orders */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Monthly Order Volume
                  </span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    {monthlyOrders.toLocaleString("en-IN")} orders
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="3000"
                  step="10"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>20 orders</span>
                  <span>1,500 orders</span>
                  <span>3,000+ orders</span>
                </div>
              </div>

              {/* Slider 2: Average Garment Price */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Avg. Garment Price (INR)
                  </span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    ₹{avgItemPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="499"
                  max="6999"
                  step="50"
                  value={avgItemPrice}
                  onChange={(e) => setAvgItemPrice(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>₹499 (T-Shirts/Tops)</span>
                  <span>₹2,499 (Dresses/Shirts)</span>
                  <span>₹6,999+ (Designer)</span>
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-1">
                <p className="text-xs uppercase font-medium text-muted-foreground">Gross Monthly Sales (GMV)</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  ₹{estMonthlyGmv.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase font-medium text-muted-foreground">FitSeller Platform Fee (8%)</p>
                <p className="text-xl sm:text-2xl font-bold text-muted-foreground">
                  -₹{estPlatformCommission.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  Estimated Net Bank Payout
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{estNetEarnings.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 font-semibold" asChild>
                <Link to="/auth/sign-up">Start Selling at 0% Setup Fee &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 3-Step Store Launch Path */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Launch your store in 3 simple steps
            </h2>
            <p className="text-sm text-muted-foreground">
              No lengthy approvals or complex software. Go from onboarding to first sale in under 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Register Merchant Account</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Sign up with Google or your business email. Your seller profile and INR payout wallet are provisioned automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">Publish Apparel Catalog</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Upload garment photos, select size variants (XS–3XL), configure inventory stock, and set custom seller pricing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Dispatch & Receive Payouts</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Generate 1-click courier shipping labels for new orders. Receive automated same-day bank settlements upon delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Merchant Success Stories */}
      <section id="testimonials" className="py-20 sm:py-28 bg-muted/20 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Users className="size-3.5" />
              <span>Merchant Voices</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Loved by fashion founders across India
            </h2>
            <p className="text-sm text-muted-foreground">
              See how apparel brands are accelerating their monthly sales on FitSeller.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-6 shadow-sm">
                <div className="space-y-3">
                  <span className="inline-block text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {t.stat}
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{t.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section id="faqs" className="py-20 sm:py-28 border-b border-border/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="size-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about selling garments on FitSeller.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. High-Conversion Bottom Banner */}
      <section className="py-20 bg-gradient-to-b from-background via-indigo-950/20 to-background border-b border-border/40 text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600 text-white mx-auto shadow-lg shadow-indigo-600/30">
            <Zap className="size-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Ready to expand your fashion brand nationwide?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create your merchant store today with zero upfront setup fees and start listing your apparel in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-semibold h-12 px-8" asChild>
              <Link to="/auth/sign-up">Register Store Now &rarr;</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12" asChild>
              <Link to="/auth/sign-in">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="py-12 text-xs text-muted-foreground border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Shirt className="size-4.5" />
              </div>
              <span className="font-bold text-foreground text-base">FitSeller Merchant Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <Link to="/auth/sign-in" className="hover:text-foreground transition-colors">
                Merchant Sign In
              </Link>
              <Link to="/auth/sign-up" className="hover:text-foreground transition-colors">
                Register Store
              </Link>
              <a href="mailto:sellers@fitmirror.shop" className="hover:text-foreground transition-colors">
                Seller Operations Desk
              </a>
              <Link to="/error?category=permission" className="hover:text-foreground transition-colors">
                Security Policy
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-6 text-[11px]">
            <p>&copy; {new Date().getFullYear()} FitSeller Inc. Built for fashion commerce merchants.</p>
            <div className="flex items-center gap-2">
              <Lock className="size-3 text-emerald-600" />
              <span>TLS 256-bit Encrypted Commerce Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
