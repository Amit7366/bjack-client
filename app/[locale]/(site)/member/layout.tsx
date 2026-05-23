import MemberAuthGuard from "@/components/member/MemberAuthGuard";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <MemberAuthGuard>{children}</MemberAuthGuard>;
}
