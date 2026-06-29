"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, Play, Star } from "lucide-react";
import type { Series } from "@/content/types";
import { SeriesArt } from "@/lib/art";
import { useLumen } from "@/lib/store";
import { FavoriteButton } from "./FavoriteButton";
import { buttonClass, Badge, cx } from "./ui";

export function Hero({ slides }: { slides: Series[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { getSeriesProgress, hydrated } = useLumen();

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const series = slides[active];
  const progress = hydrated ? getSeriesProgress(series.slug) : undefined;
  const resumeEp = progress?.episode ?? 1;

  return (
    <section
      className="relative h-[78vh] min-h-[540px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background art crossfade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cx(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== active}
        >
          <div className="absolute inset-0 animate-ken-burns">
            <SeriesArt series={s} variant="hero" />
          </div>
        </div>
      ))}

      {/* Scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[var(--maxw)] flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div key={series.id} className="max-w-xl animate-fade-up">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <Badge tone="brand">Lumen Original</Badge>
            <Badge tone="outline">{series.genre}</Badge>
            <span className="flex items-center gap-1 text-sm text-white/85">
              <Star className="h-3.5 w-3.5 fill-brand text-brand" />
              <span className="font-semibold">{(series.score / 10).toFixed(1)}</span>
            </span>
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-xl sm:text-6xl lg:text-7xl">
            {series.title}
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            {series.tagline}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
            <span>{series.year}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{series.episodes.length} episodes</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>~{series.avgLength} each</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="rounded border border-white/25 px-1">{series.maturity}</span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={`/watch/${series.slug}/${resumeEp}`} className={buttonClass("primary", "lg")}>
              <Play className="h-5 w-5 fill-black" />
              {progress ? `Resume Episode ${resumeEp}` : "Play Episode 1"}
            </Link>
            <Link href={`/series/${series.slug}`} className={buttonClass("secondary", "lg")}>
              <Info className="h-5 w-5" />
              More Info
            </Link>
            <FavoriteButton slug={series.slug} variant="full" className="!py-3.5" />
          </div>
        </div>

        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="mt-10 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                aria-label={`Show ${s.title}`}
                className={cx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-8 bg-brand" : "w-4 bg-white/30 hover:bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
