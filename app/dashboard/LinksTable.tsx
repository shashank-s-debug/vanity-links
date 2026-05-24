"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Trash2, ExternalLink } from "lucide-react";

interface Link {
  id: number;
  slug: string;
  destination: string;
  clicks: number;
  createdAt: Date;
}

export default function LinksTable({ links }: { links: Link[] }) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function copyLink(link: Link) {
    const url = `${origin}/go/${link.slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function deleteLink(id: number) {
    if (!confirm("Delete this link? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Slug</th>
            <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Destination</th>
            <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Clicks</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 font-medium">/go/{link.slug}</span>
                </div>
              </td>
              <td className="px-5 py-4 hidden md:table-cell">
                <a
                  href={link.destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 flex items-center gap-1 max-w-xs truncate transition-colors"
                >
                  <span className="truncate">{link.destination}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </td>
              <td className="px-5 py-4 text-right">
                <span className="inline-flex items-center bg-gray-100 text-gray-700 font-medium px-2.5 py-0.5 rounded-full text-xs">
                  {link.clicks.toLocaleString()}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => copyLink(link)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedId === link.id ? (
                      <><Check className="w-3.5 h-3.5" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </button>
                  <button
                    onClick={() => deleteLink(link.id)}
                    disabled={deletingId === link.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
