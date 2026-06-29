"use client";

import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";
import type { Series } from "@/content/types";
import { useLumen } from "@/lib/store";
import { FavoriteButton } from "./FavoriteButton";
import { buttonClass } from "./ui";

export function SeriesHeaderActions({ series }: { series: Series }) {
  const { getSeriesProgress, getProgress, hydrated } = useLumen();
  const progress = hydrated ? getSeriesProgress(series.slug) : undefined;

  const lastEpisode = series.episodes.length;
  const finishedAll = hydrated ? Boolean(getProgress(series.slug, lastEpisode)?.completed) : false;

  const resumeEpisode = !progress
    ? 1
    : progress.completed
      ? Math.min(progress.episode + 1, lastEpisode)
      : progress.episode;

  const label = !progress
    ? "Play Episode 1"
    : finishedAll
      ? "Watch again"
      : progress.completed
        ? `Play Episode ${resumeEpisode}`
        : `Resume Episode ${resumeEpisode}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href={`/watch/${series.slug}/${finishedAll ? 1 : resumeEpisode}`} className={buttonClass("primary", "lg")}>
        {finishedAll ? <RotateCcw className="h-5 w-5" /> : <Play className="h-5 w-5 fill-black" />}
        {label}
      </Link>
      <FavoriteButton slug={series.slug} variant="full" className="!py-3.5" />
    </div>
  );
}
