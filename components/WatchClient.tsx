"use client";

import type { Episode, Series } from "@/content/types";
import { useLumen } from "@/lib/store";
import { Player } from "./Player";
import { Spinner } from "./ui";

export function WatchClient({
  series,
  episode,
  nextEpisode,
}: {
  series: Series;
  episode: Episode;
  nextEpisode: Episode | null;
}) {
  const { hydrated, getProgress } = useLumen();

  // Wait for storage hydration so we can resume from the correct position.
  if (!hydrated) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
        <Spinner size={32} />
      </div>
    );
  }

  const progress = getProgress(series.slug, episode.number);
  const startAt =
    progress && !progress.completed && progress.positionSec > 2 && progress.positionSec < episode.runtimeSec - 2
      ? progress.positionSec
      : 0;

  return (
    <Player
      key={`${series.slug}:${episode.number}`}
      series={series}
      episode={episode}
      nextEpisode={nextEpisode}
      startAt={startAt}
    />
  );
}
