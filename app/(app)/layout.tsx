import { TopNav, BottomNav } from "@/components/Navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1 pb-24 pt-16 md:pb-12">{children}</main>
      <BottomNav />
    </div>
  );
}
