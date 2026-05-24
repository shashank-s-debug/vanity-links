"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function NewLinkPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://yoursite.com";
  const previewUrl = slug ? `${origin}/go/${slug}` : "";

  function handleSlugChange(val: string) {
    // Auto-format to valid slug chars
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, destination }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create link");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create a new link</h1>
      <p className="text-sm text-gray-500 mb-8">Choose a slug and paste your destination URL.</p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="slug">
            Custom slug
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
            <span className="bg-gray-50 text-gray-400 text-sm px-3 py-2.5 border-r border-gray-300 select-none whitespace-nowrap">
              /go/
            </span>
            <input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              placeholder="my-link"
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Lowercase letters, numbers, and hyphens only</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="destination">
            Destination URL
          </label>
          <input
            id="destination"
            type="url"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="https://example.com/very/long/url"
          />
        </div>

        {/* Live preview */}
        {(slug || destination) && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Preview</p>
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded mt-0.5">Your link</span>
              <code className="text-sm font-mono font-semibold text-indigo-600 break-all">
                {previewUrl || <span className="text-gray-400 font-normal">Enter a slug above…</span>}
              </code>
            </div>
            {destination && (
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-0.5">Goes to</span>
                <a
                  href={destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 break-all hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  {destination}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !slug || !destination}
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? "Creating…" : "Create link"}
        </button>
      </form>
    </div>
  );
}
