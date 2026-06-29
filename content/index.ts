import type { Episode, Genre, Series } from "./types";
import { theLastMessage } from "./series/the-last-message";
import { afterglow } from "./series/afterglow";
import { echoProtocol } from "./series/echo-protocol";
import { saltwater } from "./series/saltwater";

export type { Series, Episode, Genre, Beat, CastMember } from "./types";

/** Sum a series' beats into accurate per-episode runtimes. */
function finalize(series: Series): Series {
  return {
    ...series,
    episodes: series.episodes.map((ep) => ({
      ...ep,
      runtimeSec: ep.beats.reduce((total, b) => total + b.sec, 0),
    })),
  };
}

export const SERIES: Series[] = [theLastMessage, afterglow, echoProtocol, saltwater].map(finalize);

export const GENRES: Genre[] = Array.from(new Set(SERIES.map((s) => s.genre)));

export function getSeries(slug: string): Series | undefined {
  return SERIES.find((s) => s.slug === slug);
}

export function getEpisode(slug: string, episodeNumber: number): Episode | undefined {
  return getSeries(slug)?.episodes.find((e) => e.number === episodeNumber);
}

export function seriesRuntimeSec(series: Series): number {
  return series.episodes.reduce((t, e) => t + e.runtimeSec, 0);
}

/** Editorial rails for the home screen. Deterministic, no randomness on server. */
export const RAILS: { id: string; title: string; slugs: string[] }[] = [
  { id: "trending", title: "Trending This Week", slugs: ["echo-protocol", "the-last-message", "saltwater", "afterglow"] },
  { id: "new", title: "New Releases", slugs: ["afterglow", "saltwater", "echo-protocol", "the-last-message"] },
  { id: "binge", title: "Finish in One Sitting", slugs: ["the-last-message", "afterglow", "echo-protocol", "saltwater"] },
  { id: "twist", title: "Endings You Won't See Coming", slugs: ["echo-protocol", "the-last-message", "saltwater", "afterglow"] },
];

export function railSeries(slugs: string[]): Series[] {
  return slugs.map(getSeries).filter((s): s is Series => Boolean(s));
}

/** Full-text-ish search across titles, taglines, tags, cast, genre. */
export function searchSeries(query: string): Series[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SERIES.filter((s) => {
    const haystack = [
      s.title,
      s.genre,
      s.tagline,
      s.premise,
      ...s.tags,
      ...s.cast.map((c) => `${c.name} ${c.character}`),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function seriesByGenre(genre: Genre): Series[] {
  return SERIES.filter((s) => s.genre === genre);
}
