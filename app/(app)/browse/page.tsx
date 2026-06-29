import type { Metadata } from "next";
import Link from "next/link";
import { SERIES, GENRES } from "@/content";
import type { Genre } from "@/content/types";
import { PosterCard } from "@/components/PosterCard";
import { cx } from "@/components/ui";

export const metadata: Metadata = { title: "Series" };

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  const activeGenre = (GENRES.includes(genre as Genre) ? genre : undefined) as Genre | undefined;
  const list = activeGenre ? SERIES.filter((s) => s.genre === activeGenre) : SERIES;

  return (
    <div className="mx-auto max-w-[var(--maxw)] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/80">All series</p>
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Browse Lumen Originals</h1>
      </header>

      {/* Genre filter */}
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        <FilterChip href="/browse" label="All" active={!activeGenre} />
        {GENRES.map((g) => (
          <FilterChip key={g} href={`/browse?genre=${encodeURIComponent(g)}`} label={g} active={activeGenre === g} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 stagger">
        {list.map((s, i) => (
          <div key={s.id} className="flex justify-center sm:justify-start">
            <PosterCard series={s} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cx(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ring-focus",
        active
          ? "border-brand bg-brand text-black"
          : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
      )}
    >
      {label}
    </Link>
  );
}
