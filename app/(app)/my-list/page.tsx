"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { getSeries } from "@/content";
import { useLumen } from "@/lib/store";
import { PosterCard } from "@/components/PosterCard";
import { EmptyState, PosterSkeleton, buttonClass } from "@/components/ui";

export default function MyListPage() {
  const { favorites, hydrated } = useLumen();

  return (
    <div className="mx-auto max-w-[var(--maxw)] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/80">Saved</p>
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">My List</h1>
      </header>

      {!hydrated ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <PosterSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-7 w-7" />}
          title="Your list is empty"
          body="Tap the + on any series to save it here for later. Build your binge queue."
          action={
            <Link href="/browse" className={buttonClass("primary", "md")}>
              Browse series
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 stagger">
          {favorites.map((slug, i) => {
            const series = getSeries(slug);
            if (!series) return null;
            return (
              <div key={slug} className="flex justify-center sm:justify-start">
                <PosterCard series={series} index={i} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
