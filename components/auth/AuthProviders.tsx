"use client";

import { ToastProvider } from "@/components/ToastProvider";

export default function AuthProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
