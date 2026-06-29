import type { Metadata } from "next";
import Link from "next/link";
import { RAILS, SERIES, railSeries, GENRES, seriesByGenre } from "@/content";
import { Hero } from "@/components/Hero";
import { Rail } from "@/components/Rail";
import { PosterCard, NumberedPosterCard } from "@/components/PosterCard";
import { ContinueWatching } from "@/components/ContinueWatching";
import { SeriesArt } from "@/lib/art";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  const heroSlides = [SERIES[2], SERIES[0], SERIES[3], SERIES[1]]; // sci-fi, thriller, crime, romance

  return (
    <div className="-mt-16">
      <Hero slides={heroSlides} />

      <div className="relative z-10 space-y-10 pt-6 pb-10">
        <ContinueWatching />

        {/* Trending — numbered */}
        <Rail title="Trending This Week" kicker="What everyone's bingeing">
          {railSeries(RAILS[0].slugs).map((s, i) => (
            <NumberedPosterCard key={s.id} series={s} rank={i + 1} />
          ))}
        </Rail>

        {/* Genre browse tiles */}
        <section className="px-4 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-lg font-bold text-white sm:text-xl">Browse by genre</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {GENRES.map((g) => {
              const sample = seriesByGenre(g)[0];
              return (
                <Link
                  key={g}
                  href={`/browse?genre=${encodeURIComponent(g)}`}
                  className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 card-hover"
                >
                  {sample && <SeriesArt series={sample} variant="tile" />}
                  <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/20" />
                  <span className="absolute inset-0 flex items-center justify-center font-display text-base font-bold text-white">
                    {g}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {RAILS.slice(1).map((rail) => (
          <Rail key={rail.id} title={rail.title}>
            {railSeries(rail.slugs).map((s, i) => (
              <PosterCard key={s.id} series={s} index={i} />
            ))}
          </Rail>
        ))}

        {/* Spotlight band */}
        <SpotlightBand />
      </div>
    </div>
  );
}

function SpotlightBand() {
  const s = SERIES[2]; // Echo Protocol
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <Link
        href={`/series/${s.slug}`}
        className="group relative block aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 sm:aspect-[21/9]"
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <SeriesArt series={s} variant="hero" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-6 sm:p-12">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Editor&apos;s Spotlight</p>
          <h3 className="font-display text-3xl font-extrabold text-white sm:text-5xl">{s.title}</h3>
          <p className="clamp-2 mt-3 text-sm text-white/75 sm:text-base">{s.premise}</p>
        </div>
      </Link>
    </section>
  );
}
