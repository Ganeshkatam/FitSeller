import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

const ToastContext = createContext<(kind: ToastKind, message: string) => void>(
  () => {}
);

let nextId = 1;

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = nextId++;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-2.5 rounded-xl border p-3.5 shadow-lg backdrop-blur animate-in",
              t.kind === "success" &&
                "border-emerald-500/30 bg-emerald-950/90 text-emerald-100",
              t.kind === "error" &&
                "border-red-500/30 bg-red-950/90 text-red-100",
              t.kind === "info" && "border-zinc-700 bg-zinc-900/95 text-zinc-100"
            )}
          >
            {t.kind === "success" && (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
            )}
            {t.kind === "error" && (
              <XCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
            )}
            {t.kind === "info" && (
              <Info className="mt-0.5 size-4 shrink-0 text-zinc-400" />
            )}
            <p className="flex-1 text-sm leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="opacity-50 transition hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
