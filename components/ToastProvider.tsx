"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastVariant = "default" | "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastOptions = {
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void;
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#23c97f]/20 text-[#4ade80]"
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (variant === "error") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7a2a2a]/40 text-[#f87171]"
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return null;
}

function toastSurfaceClass(variant: ToastVariant): string {
  if (variant === "success") {
    return "border-[#23c97f]/50 bg-[#142820] shadow-[0_8px_32px_rgba(23,201,127,0.15)]";
  }
  if (variant === "error") {
    return "border-[#7a2a2a]/60 bg-[#2a1515] shadow-[0_8px_32px_rgba(0,0,0,0.45)]";
  }
  return "border-[#178358]/40 bg-[#1a2e24] shadow-[0_8px_32px_rgba(0,0,0,0.45)]";
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 2500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = Date.now() + Math.random();
      const variant = options?.variant ?? "default";
      setToasts((current) => [...current, { id, message, variant }]);

      const timer = setTimeout(() => dismiss(id), TOAST_DURATION_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 lg:bottom-8"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex w-full items-center gap-2.5 rounded-lg border px-4 py-3 text-[13px] font-medium text-white animate-[toast-in_0.28s_ease-out] ${toastSurfaceClass(toast.variant)}`}
          >
            <ToastIcon variant={toast.variant} />
            <span className="min-w-0 flex-1 text-left leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
