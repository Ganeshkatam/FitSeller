import type { ReactNode } from "react";
import { PackageOpen, Inbox, SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: "package" | "inbox" | "search";
  action?: ReactNode;
}

export function EmptyState({ title, description, icon = "inbox", action }: EmptyStateProps) {
  const Icon = icon === "package" ? PackageOpen : icon === "search" ? SearchX : Inbox;
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-zinc-800/60">
        <Icon className="size-7 text-zinc-500" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-800 ${className ?? ""}`} />;
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-8" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="size-8 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
      {label && <p className="mt-3 text-sm text-zinc-500">{label}</p>}
    </div>
  );
}
