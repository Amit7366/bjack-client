import AuthProviders from "@/components/auth/AuthProviders";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviders>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#0a0a0a]">{children}</div>
    </AuthProviders>
  );
}
