import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

/** Amounts stored in paise (bigint) */
export function formatPaise(paise: number | string | null | undefined) {
  return formatCurrency(Number(paise ?? 0) / 100);
}

export function paiseToRupees(paise: number | string | null | undefined): string {
  const n = Number(paise ?? 0) / 100;
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

export function formatNumber(value: number | string | null | undefined) {
  return new Intl.NumberFormat("en-IN").format(Number(value ?? 0));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(value: string | null | undefined) {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}
