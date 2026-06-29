"use client";

import Link from "next/link";
import { History, Play, Trash2, Check } from "lucide-react";
import { getSeries, getEpisode } from "@/content";
import { useLumen } from "@/lib/store";
import { SeriesArt } from "@/lib/art";
import { formatClock, pct } from "@/lib/format";
import { EmptyState, ProgressBar, buttonClass } from "@/components/ui";

export default function HistoryPage() {
  const { progressList, hydrated, clearAllHistory, clearProgress } = useLumen();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/80">Activity</p>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Watch History</h1>
        </div>
        {hydrated && progressList.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-danger/40 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" /> Clear all
          </button>
        )}
      </header>

      {!hydrated ? null : progressList.length === 0 ? (
        <EmptyState
          icon={<History className="h-7 w-7" />}
          title="Nothing watched yet"
          body="Episodes you start will show up here so you can jump back in anytime."
          action={
            <Link href="/home" className={buttonClass("primary", "md")}>
              Start watching
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {progressList.map((p) => {
            const series = getSeries(p.slug);
            const episode = getEpisode(p.slug, p.episode);
            if (!series || !episode) return null;
            const progressPct = pct(p.positionSec, p.durationSec);
            return (
              <li
                key={`${p.slug}:${p.episode}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-surface p-3 transition hover:bg-surface-strong"
              >
                <Link
                  href={`/watch/${p.slug}/${p.episode}`}
                  className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg sm:w-40"
                >
                  <SeriesArt series={series} variant="still" episode={p.episode} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </div>
                  {p.completed && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-black">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/series/${p.slug}`} className="block">
                    <p className="clamp-1 font-semibold text-white">{series.title}</p>
                    <p className="clamp-1 text-sm text-muted">
                      E{episode.number} · {episode.title}
                    </p>
                  </Link>
                  <div className="mt-2 flex items-center gap-3">
                    <ProgressBar value={progressPct} className="max-w-[200px]" />
                    <span className="shrink-0 text-xs text-dim">
                      {p.completed ? "Finished" : `${formatClock(p.positionSec)} / ${formatClock(p.durationSec)}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => clearProgress(p.slug, p.episode)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-danger"
                  aria-label="Remove from history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
