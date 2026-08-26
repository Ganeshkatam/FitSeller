import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/** Translates raw database/auth/network error messages into clean, polished user notices */
export function getHumanErrorMessage(
  err: unknown,
  fallback = "An unexpected error occurred. Please try again or contact support."
): string {
  if (!err) return fallback;

  const raw = typeof err === "string" ? err : err instanceof Error ? err.message : String(err);
  const msg = raw.toLowerCase();

  // Invalid credentials
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid email or password") ||
    msg.includes("invalid credentials")
  ) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }

  // Access denied / Unregistered seller
  if (
    msg.includes("no seller account") ||
    msg.includes("not a registered seller") ||
    msg.includes("access denied") ||
    msg.includes("restricted") ||
    msg.includes("pre-registered") ||
    msg.includes("not authorized") ||
    msg.includes("unauthorized")
  ) {
    return "Access restricted to authorized sellers. If you believe this is an error, please contact your administrator.";
  }

  // Email unconfirmed
  if (msg.includes("email not confirmed") || msg.includes("email unverified")) {
    return "Your business email has not been verified yet. Please check your inbox for the verification link.";
  }

  // User already registered
  if (
    msg.includes("already registered") ||
    msg.includes("already exists") ||
    msg.includes("user already exist")
  ) {
    return "An account with this email address already exists. Please sign in instead.";
  }

  // Rate limit / Too many requests
  if (
    msg.includes("too many requests") ||
    msg.includes("rate limit") ||
    msg.includes("over_email_send_rate_limit")
  ) {
    return "Too many attempts. Please wait a few moments before trying again.";
  }

  // Password requirements
  if (msg.includes("password should be at least") || msg.includes("password requirements")) {
    return "Please ensure your password meets all security requirements.";
  }

  // Passwords don't match
  if (msg.includes("passwords do not match") || msg.includes("passwords match")) {
    return "The entered passwords do not match. Please re-enter them carefully.";
  }

  // Link expired / Invalid token
  if (
    msg.includes("token has expired") ||
    msg.includes("invalid token") ||
    msg.includes("expired or invalid") ||
    msg.includes("link expired")
  ) {
    return "This security link has expired or is invalid. Please request a new one.";
  }

  // Network / Connection
  if (
    msg.includes("failed to fetch") ||
    msg.includes("network") ||
    msg.includes("connection") ||
    msg.includes("timeout")
  ) {
    return "Unable to connect to the server. Please check your network connection and try again.";
  }

  return fallback;
}

