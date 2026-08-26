import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const tones = {
  gray: "bg-zinc-800/80 text-zinc-300 ring-zinc-700",
  green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/25",
  red: "bg-red-500/10 text-red-400 ring-red-500/25",
  blue: "bg-sky-500/10 text-sky-400 ring-sky-500/25",
  violet: "bg-violet-500/10 text-violet-400 ring-violet-500/25",
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

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: string;
  children?: string;
}

export function Badge({ status, className, children, ...props }: BadgeProps) {
  const key = (status ?? "").toLowerCase();
  const tone = statusTone[key] ?? "gray";
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-2.5 text-xs font-medium capitalize ring-1 ring-inset transition-colors",
        tones[tone],
        className
      )}
      {...props}
    >
      {children ?? (key.replace(/_/g, " ") || "unknown")}
    </span>
  );
}
