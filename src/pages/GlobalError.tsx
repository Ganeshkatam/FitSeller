import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  KeyRound,
  ShieldAlert,
  UserX,
  WifiOff,
  ServerCrash,
  FileQuestion,
  PackageX,
  CreditCard,
  Tag,
  ArrowLeft,
  Home,
  LifeBuoy,
  CheckCircle2,
  User,
  Copy,
  Check,
  Shirt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export type ErrorCategory =
  | "auth"
  | "account"
  | "permission"
  | "order"
  | "payment"
  | "product"
  | "inventory"
  | "network"
  | "server"
  | "not_found"
  | "general";

export interface GlobalErrorState {
  category?: ErrorCategory;
  code?: string;
  account?: string;
  entityId?: string;
  entityType?: string;
  title?: string;
  message?: string;
  details?: string;
  statusCode?: number | string;
  remedySteps?: string[];
  backTo?: string;
  primaryActionLabel?: string;
  primaryActionUrl?: string;
  secondaryActionLabel?: string;
  secondaryActionUrl?: string;
}

interface CategoryDisplay {
  icon: typeof AlertCircle;
  badge: string;
  badgeClass: string;
  iconBg: string;
  iconColor: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultSteps: string[];
  defaultPrimaryAction: { label: string; url: string };
  defaultSecondaryAction: { label: string; url: string };
}

export default function GlobalError() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { session, seller, user } = useAuth();

  const [copied, setCopied] = useState(false);

  const state = (location.state as GlobalErrorState | null) ?? {};

  // Extract query or state attributes
  const category = (
    state.category ||
    params.get("category") ||
    "general"
  ).toLowerCase() as ErrorCategory;

  const code = (state.code || params.get("code") || "ERR_GENERAL").toUpperCase();
  const account =
    state.account ||
    params.get("account") ||
    seller?.business_email ||
    user?.email ||
    "";
  const entityId = state.entityId || params.get("entityId");
  const entityType = state.entityType || params.get("entityType") || "Reference";
  const title = state.title || params.get("title");
  const message = state.message || params.get("message");
  const details = state.details || params.get("details");
  const statusCode = state.statusCode || params.get("status") || params.get("statusCode");
  const backTo = state.backTo || params.get("backTo") || (session && seller ? "/" : "/auth/sign-in");

  const categoryMap: Record<string, CategoryDisplay> = useMemo(
    () => ({
      auth: {
        icon: KeyRound,
        badge: "Authentication Error",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
        iconColor: "text-amber-600 dark:text-amber-400",
        defaultTitle: "Authentication Verification Failed",
        defaultSubtitle:
          "We could not verify your credentials or establish an active seller session.",
        defaultSteps: [
          "Check for typographical errors in your registered business email",
          "Ensure your Caps Lock is turned off when entering passwords",
          "Use the password reset process if you cannot recall your password",
        ],
        defaultPrimaryAction: { label: "Sign In Again", url: "/auth/sign-in" },
        defaultSecondaryAction: { label: "Reset Password", url: "/auth/forgot-password" },
      },
      account: {
        icon: UserX,
        badge: "Account Verification",
        badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        iconBg: "bg-red-500/10 dark:bg-red-500/20",
        iconColor: "text-red-600 dark:text-red-400",
        defaultTitle: "Account Status Restriction",
        defaultSubtitle:
          "This merchant profile is currently unverified, deactivated, or requires compliance review.",
        defaultSteps: [
          "Check whether your business registration documents are verified",
          "Confirm your registered business email via the activation email",
          "Contact our seller operations team for review assistance",
        ],
        defaultPrimaryAction: { label: "Go to Sign In", url: "/auth/sign-in" },
        defaultSecondaryAction: { label: "Verify Email", url: "/auth/verify-email" },
      },
      permission: {
        icon: ShieldAlert,
        badge: "Access Denied (403)",
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
        iconColor: "text-rose-600 dark:text-rose-400",
        defaultTitle: "Access Restricted",
        defaultSubtitle:
          "You do not possess the required seller permissions to view or edit this resource.",
        defaultSteps: [
          "Verify that you are logged into the correct seller account",
          "Ensure your store role allows administrative or inventory actions",
          "Request elevated permissions from your store administrator",
        ],
        defaultPrimaryAction: { label: "Return to Dashboard", url: "/" },
        defaultSecondaryAction: { label: "Switch Account", url: "/auth/sign-in" },
      },
      order: {
        icon: PackageX,
        badge: "Order Processing Issue",
        badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
        iconColor: "text-purple-600 dark:text-purple-400",
        defaultTitle: "Order Processing Failed",
        defaultSubtitle:
          "We encountered an issue updating or retrieving fulfillment records for this order.",
        defaultSteps: [
          "Confirm the customer order has not been cancelled or refunded",
          "Ensure inventory stock is sufficient for dispatch",
          "Refresh your live orders table to sync current statuses",
        ],
        defaultPrimaryAction: { label: "View Orders", url: "/orders" },
        defaultSecondaryAction: { label: "Go to Dashboard", url: "/" },
      },
      payment: {
        icon: CreditCard,
        badge: "Payout & Financial",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        defaultTitle: "Payout Settlement Error",
        defaultSubtitle:
          "An issue occurred while processing your seller wallet balance or bank transfer.",
        defaultSteps: [
          "Verify your bank account details and IFSC code under store settings",
          "Check that your available wallet balance meets minimum withdrawal limits",
          "Review recent transactions for pending settlement holds",
        ],
        defaultPrimaryAction: { label: "View Payouts & Wallet", url: "/payouts" },
        defaultSecondaryAction: { label: "Store Settings", url: "/settings" },
      },
      product: {
        icon: Tag,
        badge: "Catalog & Product",
        badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        defaultTitle: "Product Offer Update Issue",
        defaultSubtitle:
          "The requested apparel item or seller pricing offer could not be saved.",
        defaultSteps: [
          "Ensure product pricing and discount values are valid positive amounts",
          "Check that at least one size variant has available stock",
          "Verify your SKU format contains only supported alphanumeric characters",
        ],
        defaultPrimaryAction: { label: "Manage Products", url: "/products" },
        defaultSecondaryAction: { label: "Return to Dashboard", url: "/" },
      },
      network: {
        icon: WifiOff,
        badge: "Network Connectivity",
        badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
        iconColor: "text-orange-600 dark:text-orange-400",
        defaultTitle: "Network Connection Lost",
        defaultSubtitle:
          "Unable to connect to the FitSeller commerce platform API.",
        defaultSteps: [
          "Check your Wi-Fi, Ethernet, or cellular data connection",
          "Ensure ad-blockers or firewalls are not intercepting API requests",
          "Try reloading the application once connectivity is restored",
        ],
        defaultPrimaryAction: { label: "Retry", url: backTo },
        defaultSecondaryAction: { label: "Return to Dashboard", url: "/" },
      },
      server: {
        icon: ServerCrash,
        badge: "Server Diagnostic (500)",
        badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        iconBg: "bg-zinc-500/10 dark:bg-zinc-500/20",
        iconColor: "text-zinc-600 dark:text-zinc-400",
        defaultTitle: "Service Temporarily Unavailable",
        defaultSubtitle:
          "Our system encountered an unexpected internal condition. Our engineering team has been notified.",
        defaultSteps: [
          "Wait a few moments and refresh the screen",
          "Ensure you are running the latest version of your browser",
          "Contact support if this error condition persists",
        ],
        defaultPrimaryAction: { label: "Refresh Page", url: backTo },
        defaultSecondaryAction: { label: "Return to Dashboard", url: "/" },
      },
      not_found: {
        icon: FileQuestion,
        badge: "Not Found (404)",
        badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        iconBg: "bg-zinc-500/10 dark:bg-zinc-500/20",
        iconColor: "text-zinc-600 dark:text-zinc-400",
        defaultTitle: "Page or Resource Not Found",
        defaultSubtitle:
          "The resource, page, or record you requested does not exist or has been moved.",
        defaultSteps: [
          "Double check the URL address in your browser bar",
          "Verify the record has not been deleted or archived",
          "Use the navigation sidebar to find your destination",
        ],
        defaultPrimaryAction: { label: "Go to Dashboard", url: "/" },
        defaultSecondaryAction: { label: "View Products", url: "/products" },
      },
      general: {
        icon: AlertCircle,
        badge: "System Notice",
        badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        defaultTitle: "Action Could Not Be Completed",
        defaultSubtitle:
          "An error occurred while processing your request. Please review the details below.",
        defaultSteps: [
          "Review the diagnostic details below",
          "Retry the action after a brief moment",
          "Contact support if you need assistance resolving this issue",
        ],
        defaultPrimaryAction: { label: "Go to Dashboard", url: "/" },
        defaultSecondaryAction: { label: "Back", url: backTo },
      },
    }),
    [backTo]
  );

  const display = categoryMap[category] ?? categoryMap.general;
  const Icon = display.icon;

  const displayTitle = title || display.defaultTitle;
  const displaySubtitle = message || display.defaultSubtitle;
  const steps = state.remedySteps && state.remedySteps.length > 0 ? state.remedySteps : display.defaultSteps;

  const primaryLabel = state.primaryActionLabel || display.defaultPrimaryAction.label;
  const primaryUrl = state.primaryActionUrl || display.defaultPrimaryAction.url;

  const secondaryLabel = state.secondaryActionLabel || display.defaultSecondaryAction.label;
  const secondaryUrl = state.secondaryActionUrl || display.defaultSecondaryAction.url;

  function copyDebugInfo() {
    const info = `Error Code: ${code}\nCategory: ${category}\nAccount: ${account || "N/A"}\nEntity: ${entityId ? `${entityType}: ${entityId}` : "N/A"}\nMessage: ${displaySubtitle}\nStatus: ${statusCode || "N/A"}\nTimestamp: ${new Date().toISOString()}`;
    navigator.clipboard.writeText(info).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500/20">
      {/* Top Universal Navbar */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30">
              <Shirt className="size-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-foreground text-lg">FitSeller</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                MERCHANT HUB
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="mailto:sellers@fitmirror.shop?subject=Merchant%20Portal%20Assistance"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LifeBuoy className="size-3.5 text-indigo-500" />
              <span>Merchant Desk</span>
            </a>
            {session && (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Home className="size-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Error Presentation Card */}
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16 my-auto">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-zinc-950/5 dark:shadow-black/20 sm:p-9 space-y-6">
          {/* Badge & Icon Header */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`mb-4 flex size-16 items-center justify-center rounded-2xl ${display.iconBg}`}
            >
              <Icon className={`size-8 ${display.iconColor}`} />
            </div>

            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border ${display.badgeClass} mb-2.5`}
            >
              <span>{display.badge}</span>
              {statusCode && <span className="opacity-60">• HTTP {statusCode}</span>}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {displayTitle}
            </h1>
            <p className="mt-2.5 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
              {displaySubtitle}
            </p>
          </div>

          {/* Account / Entity Indicator Chip */}
          {(account || entityId) && (
            <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-border/80 bg-muted/30 p-3.5 sm:grid-cols-2">
              {account && (
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <User className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Target Account
                    </p>
                    <p className="truncate text-xs font-medium text-foreground">{account}</p>
                  </div>
                </div>
              )}

              {entityId && (
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Tag className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {entityType}
                    </p>
                    <p className="truncate text-xs font-mono font-medium text-foreground">{entityId}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Suggested Remedy Checklist */}
          {steps && steps.length > 0 && (
            <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Recommended Actions
              </h2>
              <ul className="mt-3 space-y-2.5">
                {steps.map((step) => (
                  <li
                    key={step}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical diagnostic details (optional expand) */}
          {details && (
            <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs font-mono text-muted-foreground break-all">
              <span className="font-semibold text-foreground">Diagnosis: </span>
              {details}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
            {secondaryUrl && (
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-1/2"
                onClick={() => {
                  if (secondaryUrl === "back" || secondaryUrl === backTo) {
                    navigate(backTo);
                  } else {
                    navigate(secondaryUrl);
                  }
                }}
              >
                <ArrowLeft className="mr-2 size-4" />
                <span>{secondaryLabel}</span>
              </Button>
            )}

            <Button
              size="lg"
              className="w-full sm:flex-1"
              onClick={() => {
                if (primaryUrl === "back" || primaryUrl === backTo) {
                  navigate(backTo);
                } else {
                  navigate(primaryUrl);
                }
              }}
            >
              <span>{primaryLabel}</span>
            </Button>
          </div>

          {/* Diagnostic Code & Copy Tool */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span className="font-mono text-[11px]">Ref: {code}</span>
            <button
              type="button"
              onClick={copyDebugInfo}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied details</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy diagnostic report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <p>&copy; {new Date().getFullYear()} FitSeller Merchant Platform</p>
          <div className="flex items-center gap-4">
            <Link to="/auth/sign-in" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link to="/auth/sign-up" className="hover:text-foreground transition-colors">
              Create account
            </Link>
            <a
              href="mailto:sellers@fitmirror.shop"
              className="hover:text-foreground transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
