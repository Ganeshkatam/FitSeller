import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700",
        variant === "secondary" &&
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700",
        variant === "outline" &&
          "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800",
        variant === "ghost" && "text-zinc-300 hover:bg-zinc-800 hover:text-white",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-9 px-4 text-sm",
        size === "lg" && "h-11 px-6 text-sm",
        size === "icon" && "size-9",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
