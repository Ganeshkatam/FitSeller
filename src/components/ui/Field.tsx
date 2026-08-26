import type { SelectHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

// Re-export official shadcn UI primitives
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
export { Input } from "./input";
export { Label } from "./label";
export { Textarea } from "./textarea";

const fieldClasses =
  "w-full rounded-lg border border-input bg-input/20 px-3 text-sm text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        fieldClasses,
        "h-9 appearance-none bg-[position:right_0.6rem_center] bg-no-repeat pr-8 [&>option]:bg-card",
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Field({
  className,
  error,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { error?: string }) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function FieldGroup({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-4", className)} {...props} />;
}
