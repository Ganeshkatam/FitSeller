import type { ReactNode } from "react";
import { Toaster, toast as sonner } from "sonner";
import { getHumanErrorMessage } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";

export function useToast() {
  return (kind: ToastKind, message: string) => {
    if (kind === "success") sonner.success(message);
    else if (kind === "error") sonner.error(getHumanErrorMessage(message));
    else sonner.info(message);
  };
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" theme="light" />
    </>
  );
}
