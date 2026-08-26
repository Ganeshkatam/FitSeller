import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const tones = {
  gray: "bg-zinc-800 text-zinc-300 ring-zinc-700",
  green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  red: "bg-red-500/10 text-red-400 ring-red-500/20",
  blue: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  violet: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
} as const;

type Tone = keyof typeof tones;

const statusTone: Record<string, Tone> = {
  pending: "amber",
  pending_payment: "amber",
  placed: "blue",
  confirmed: "blue",
  processing: "amber",
  shipped: "violet",
  out_for_delivery: "violet",
  delivered: "green",
  completed: "green",
  paid: "green",
  cancelled: "red",
  rejected: "red",
  failed: "red",
  returned: "red",
  requested: "amber",
  approved: "blue",
  picked_up: "violet",
  refunded: "green",
  unfulfilled: "gray",
  fulfilled: "green",
  active: "green",
  inactive: "gray",
  draft: "gray",
  paused: "amber",
  suspended: "red",
  ended: "gray",
};

export function Badge({
  status,
  className,
  children,
}: HTMLAttributes<HTMLSpanElement> & { status?: string; children?: string }) {
  const key = (status ?? "").toLowerCase();
  const tone = statusTone[key] ?? "gray";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children ?? (key.replace(/_/g, " ") || "unknown")}
    </span>
  );
}
