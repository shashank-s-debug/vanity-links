import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import DashboardNav from "./DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-full flex flex-col">
      <DashboardNav email={session.email!} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
