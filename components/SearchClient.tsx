"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { SERIES, searchSeries, GENRES } from "@/content";
import { PosterCard } from "./PosterCard";
import { EmptyState, cx } from "./ui";

const SUGGESTIONS = ["Thriller", "Romance", "Sci-Fi", "Crime", "twist", "one night", "Mumbai", "AI"];

export function SearchClient() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchSeries(trimmed) : []), [trimmed]);

  return (
    <div className="mx-auto max-w-[var(--maxw)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, genres, actors, themes…"
          className="w-full rounded-2xl border border-white/12 bg-surface py-4 pl-12 pr-4 text-base text-white placeholder:text-dim ring-focus focus:border-brand/40"
          aria-label="Search"
        />
      </div>

      {!trimmed && (
        <>
          <div className="mb-8 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Browse all</h2>
          <ResultsGrid list={SERIES} />
        </>
      )}

      {trimmed && results.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted">
            {results.length} result{results.length > 1 ? "s" : ""} for{" "}
            <span className="text-white">“{trimmed}”</span>
          </p>
          <ResultsGrid list={results} />
        </>
      )}

      {trimmed && results.length === 0 && (
        <EmptyState
          icon={<SearchX className="h-7 w-7" />}
          title="No matches"
          body={`We couldn't find anything for “${trimmed}”. Try a genre like ${GENRES.slice(0, 2).join(" or ")}.`}
        />
      )}
    </div>
  );
}

function ResultsGrid({ list }: { list: typeof SERIES }) {
  return (
    <div className={cx("grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 stagger")}>
      {list.map((s, i) => (
        <div key={s.id} className="flex justify-center sm:justify-start">
          <PosterCard series={s} index={i} />
        </div>
      ))}
    </div>
  );
}
