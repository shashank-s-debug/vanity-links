"use client";

import Link from "next/link";
import { Play, X } from "lucide-react";
import { getSeries, getEpisode } from "@/content";
import { useLumen, type Progress } from "@/lib/store";
import { SeriesArt } from "@/lib/art";
import { formatClock, pct } from "@/lib/format";
import { Rail } from "./Rail";
import { ProgressBar } from "./ui";

/** Most-recent in-progress (not completed) item per series. */
function dedupeBySeries(list: Progress[]): Progress[] {
  const seen = new Set<string>();
  const out: Progress[] = [];
  for (const p of list) {
    if (p.completed) continue;
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}

export function ContinueWatching() {
  const { progressList, hydrated, clearProgress } = useLumen();
  if (!hydrated) return null;

  const items = dedupeBySeries(progressList);
  if (items.length === 0) return null;

  return (
    <Rail title="Continue Watching" kicker="Pick up where you left off">
      {items.map((p) => {
        const series = getSeries(p.slug);
        const episode = getEpisode(p.slug, p.episode);
        if (!series || !episode) return null;
        const progressPct = pct(p.positionSec, p.durationSec);
        const remaining = Math.max(0, p.durationSec - p.positionSec);

        return (
          <Link
            key={`${p.slug}:${p.episode}`}
            href={`/watch/${p.slug}/${p.episode}`}
            className="group relative w-[260px] shrink-0 card-hover ring-focus rounded-xl sm:w-[300px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-bg-elev shadow-card">
              <SeriesArt series={series} variant="still" episode={p.episode} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  clearProgress(p.slug, p.episode);
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 backdrop-blur transition hover:bg-black/70 group-hover:opacity-100"
                aria-label="Remove from Continue Watching"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition group-hover:opacity-100">
                <Play className="h-5 w-5 translate-x-0.5 fill-black" />
              </div>

              <div className="absolute inset-x-3 bottom-2.5">
                <div className="mb-1.5 flex items-end justify-between">
                  <div className="min-w-0">
                    <p className="clamp-1 text-sm font-semibold text-white">{series.title}</p>
                    <p className="clamp-1 text-xs text-white/65">
                      E{episode.number} · {episode.title}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-white/60">{formatClock(remaining)} left</span>
                </div>
                <ProgressBar value={progressPct} />
              </div>
            </div>
          </Link>
        );
      })}
    </Rail>
  );
}
