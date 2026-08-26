import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Shirt, ScanFace, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
    headline: "Sell where shoppers try before they buy",
    sub: "Reach thousands of fitMirror users experiencing your garments virtually.",
  },
  {
    src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80",
    headline: "Your catalog, powered by virtual try-on",
    sub: "List once — shoppers drape, fit and style your pieces in 3D.",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80",
    headline: "Grow with real try-on insights",
    sub: "See what shoppers try on, what converts, and what to stock next.",
  },
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1920&q=80",
    headline: "Fast payouts. Transparent fees.",
    sub: "Track earnings in real time and withdraw when you're ready.",
  },
];

const FEATURES = [
  { icon: ScanFace, label: "Virtual try-on analytics" },
  { icon: ShieldCheck, label: "Secure seller dashboard" },
  { icon: TrendingUp, label: "Real-time orders & payouts" },
];

export default function AuthLayout() {
  const location = useLocation();
  const [index, setIndex] = useState(() => Math.floor(Math.random() * IMAGES.length));
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  const rotate = useCallback(() => setIndex((i) => (i + 1) % IMAGES.length), []);

  useEffect(() => {
    const id = setInterval(rotate, 7000);
    return () => clearInterval(id);
  }, [rotate]);

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

  const active = IMAGES[index];

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative flex min-h-full overflow-hidden bg-background"
    >
      {/* ---- Interactive image backdrop ---- */}
      <div className="absolute inset-0">
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1500ms] ease-out will-change-transform",
              i === index ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={img.src}
              alt=""
              draggable={false}
              className={cn(
                "size-full object-cover motion-safe:animate-kenburns",
                i % 2 === 1 && "motion-safe:[animation-direction:alternate-reverse]"
              )}
              style={{
                transform: `translate3d(${mouse.x * -18}px, ${mouse.y * -14}px, 0)`,
                transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
        ))}
        {/* readability gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent lg:via-background/10" />
      </div>

      {/* floating orbs (extra parallax depth) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full bg-indigo-500/25 blur-3xl motion-safe:animate-float"
        style={{ transform: `translate3d(${mouse.x * 60}px, ${mouse.y * 50}px, 0)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 size-80 rounded-full bg-violet-500/20 blur-3xl motion-safe:animate-float"
        style={{
          transform: `translate3d(${mouse.x * -45}px, ${mouse.y * -35}px, 0)`,
          animationDelay: "-3s",
        }}
      />

      {/* ---- Content ---- */}
      <div className="relative z-10 flex w-full flex-col lg:grid lg:grid-cols-[1.1fr_1fr]">
        {/* Left showcase */}
        <div className="hidden flex-col justify-between p-10 lg:flex xl:p-16">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <Shirt className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FitSeller</span>
          </div>

          <div
            key={index}
            className="max-w-md motion-safe:animate-rise"
            style={{
              transform: `translate3d(${mouse.x * 12}px, ${mouse.y * 10}px, 0)`,
            }}
          >
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm xl:text-5xl">
              {active.headline}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-100/90 drop-shadow-sm">
              {active.sub}
            </p>

            <ul className="mt-8 space-y-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>

        {/* Right form column */}
        <div className="flex items-center justify-center p-4 sm:p-8">
          <div
            className="w-full max-w-md motion-safe:animate-rise"
            style={{
              transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 5}px, 0)`,
            }}
          >
            {/* mobile brand */}
            <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
                <Shirt className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">FitSeller</span>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/85 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
              <Outlet key={location.pathname} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
