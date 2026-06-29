"use client";

import Link from "next/link";
import { Check, Play } from "lucide-react";
import type { Series } from "@/content/types";
import { useLumen } from "@/lib/store";
import { SeriesArt } from "@/lib/art";
import { formatDurationCompact, pct } from "@/lib/format";
import { ProgressBar } from "./ui";

export function EpisodeList({ series }: { series: Series }) {
  const { getProgress, hydrated } = useLumen();

  return (
    <ol className="space-y-3">
      {series.episodes.map((ep) => {
        const progress = hydrated ? getProgress(series.slug, ep.number) : undefined;
        const progressPct = progress ? pct(progress.positionSec, progress.durationSec) : 0;

        return (
          <li key={ep.number}>
            <Link
              href={`/watch/${series.slug}/${ep.number}`}
              className="group flex gap-4 rounded-2xl border border-white/10 bg-surface p-3 transition hover:bg-surface-strong"
            >
              <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg sm:w-44">
                <SeriesArt series={series} variant="still" episode={ep.number} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black">
                    <Play className="h-5 w-5 translate-x-0.5 fill-black" />
                  </span>
                </div>
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                  {formatDurationCompact(ep.runtimeSec)}
                </span>
                {progress?.completed && (
                  <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-black">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                {progress && !progress.completed && progressPct > 1 && (
                  <div className="absolute inset-x-1.5 bottom-1.5">
                    <ProgressBar value={progressPct} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 py-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-bold text-white/30">{ep.number}</span>
                  <h3 className="clamp-1 font-semibold text-white">{ep.title}</h3>
                </div>
                <p className="clamp-2 mt-1 text-sm text-muted">{ep.logline}</p>
                {progress && (
                  <span className="mt-1.5 inline-block text-xs font-medium text-brand">
                    {progress.completed ? "Watched" : `Resume · ${Math.round(progressPct)}%`}
                  </span>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
