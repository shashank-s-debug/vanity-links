"use client";

import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { Series } from "@/content/types";
import { SeriesArt } from "@/lib/art";
import { useLumen } from "@/lib/store";
import { pct } from "@/lib/format";
import { FavoriteButton } from "./FavoriteButton";
import { ProgressBar, cx } from "./ui";

export function PosterCard({
  series,
  index = 0,
  width = "default",
}: {
  series: Series;
  index?: number;
  width?: "default" | "wide";
}) {
  const { getSeriesProgress, hydrated } = useLumen();
  const progress = hydrated ? getSeriesProgress(series.slug) : undefined;
  const resumeEpisode = progress?.episode ?? 1;
  const progressPct = progress ? pct(progress.positionSec, progress.durationSec) : 0;

  return (
    <Link
      href={`/series/${series.slug}`}
      className={cx(
        "group relative block shrink-0 card-hover ring-focus rounded-2xl animate-fade-up",
        width === "wide" ? "w-[230px] sm:w-[280px]" : "w-[150px] sm:w-[180px]",
      )}
      style={{ scrollSnapAlign: "start", animationDelay: `${Math.min(index, 8) * 0.04}s` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-bg-elev shadow-card">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <SeriesArt series={series} variant="poster" withTitle />
        </div>

        {/* top row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          <span className="rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
            {series.genre}
          </span>
          <span className="opacity-0 transition group-hover:opacity-100">
            <FavoriteButton slug={series.slug} className="h-8 w-8" />
          </span>
        </div>

        {/* hover gradient + CTA */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-white/70">
            <Star className="h-3 w-3 fill-brand text-brand" />
            <span className="font-semibold text-white/90">{(series.score / 10).toFixed(1)}</span>
            <span>· {series.episodes.length} eps · {series.avgLength}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black">
            <Play className="h-3 w-3 fill-black" />
            {progress ? `Resume E${resumeEpisode}` : "Play"}
          </span>
        </div>

        {/* resume progress */}
        {progress && progressPct > 1 && (
          <div className="absolute inset-x-2.5 bottom-2.5">
            <ProgressBar value={progressPct} />
          </div>
        )}
      </div>

      <div className="px-0.5 pt-2.5">
        <h3 className="clamp-1 text-sm font-semibold text-white">{series.title}</h3>
        <p className="clamp-1 text-xs text-muted">{series.tags.slice(0, 2).join(" · ")}</p>
      </div>
    </Link>
  );
}

export function NumberedPosterCard({ series, rank }: { series: Series; rank: number }) {
  return (
    <div className="flex shrink-0 items-end" style={{ scrollSnapAlign: "start" }}>
      <span
        className="relative z-0 -mr-7 select-none font-display text-[110px] font-extrabold leading-none text-transparent sm:text-[140px]"
        style={{ WebkitTextStroke: "2px rgba(255,255,255,0.22)" }}
        aria-hidden
      >
        {rank}
      </span>
      <div className="relative z-10">
        <PosterCard series={series} />
      </div>
    </div>
  );
}
