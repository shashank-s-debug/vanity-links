import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import LinksTable from "./LinksTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  const links = await prisma.link.findMany({
    where: { userId: session.userId! },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your links</h1>
          <p className="text-sm text-gray-500 mt-1">{links.length} link{links.length !== 1 ? "s" : ""} created</p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">No links yet</p>
          <p className="text-sm text-gray-500 mb-6">Create your first vanity link to get started.</p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create a link
          </Link>
        </div>
      ) : (
        <LinksTable links={links} />
      )}
    </div>
  );
}
