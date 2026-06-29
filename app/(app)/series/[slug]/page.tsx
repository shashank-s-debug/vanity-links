import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { SERIES, getSeries, seriesRuntimeSec } from "@/content";
import { SeriesArt, MonogramAvatar } from "@/lib/art";
import { seasonLengthLabel } from "@/lib/format";
import { Badge, ScoreRing } from "@/components/ui";
import { SeriesHeaderActions } from "@/components/SeriesHeaderActions";
import { EpisodeList } from "@/components/EpisodeList";

export function generateStaticParams() {
  return SERIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) return { title: "Not found" };
  return {
    title: series.title,
    description: series.tagline,
    openGraph: { title: series.title, description: series.premise },
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) notFound();

  return (
    <div className="-mt-16">
      {/* Backdrop */}
      <div className="relative h-[64vh] min-h-[440px] w-full overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <SeriesArt series={series} variant="hero" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/85 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[var(--maxw)] items-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <Badge tone="brand">Lumen Original</Badge>
              <Badge tone="outline">{series.genre}</Badge>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-xl sm:text-6xl">
              {series.title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">{series.tagline}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 mx-auto max-w-[var(--maxw)] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="-mt-2 flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Main */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-brand text-brand" />
                <span className="font-semibold text-white">{(series.score / 10).toFixed(1)}</span>
              </span>
              <span>{series.year}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span>{series.episodes.length} episodes</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span>{seasonLengthLabel(seriesRuntimeSec(series))}</span>
              <span className="rounded border border-white/25 px-1.5 text-xs">{series.maturity}</span>
            </div>

            <div className="mb-8">
              <SeriesHeaderActions series={series} />
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-white/85">{series.synopsis}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {series.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                  {t}
                </span>
              ))}
            </div>

            {/* Episodes */}
            <section className="mt-12">
              <div className="mb-5 flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold text-white">Episodes</h2>
                <span className="text-sm text-muted">Season 1 · {series.episodes.length} parts</span>
              </div>
              <EpisodeList series={series} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 lg:shrink-0">
            <div className="rounded-2xl border border-white/10 bg-surface p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Cast</h3>
              <ul className="space-y-3">
                {series.cast.map((c) => (
                  <li key={`${c.character}-${c.initials}`} className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <MonogramAvatar initials={c.initials} art={series.art} />
                    </div>
                    <div className="min-w-0">
                      <p className="clamp-1 text-sm font-medium text-white">{c.character}</p>
                      <p className="clamp-1 text-xs text-muted">{c.name}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="my-5 divider" />

              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Poster concept</h3>
              <p className="text-xs leading-relaxed text-white/55">{series.posterConcept}</p>

              <div className="mt-5 flex items-center gap-3">
                <ScoreRing score={series.score} size={44} />
                <p className="text-xs text-muted">Lumen critics&apos; score</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
