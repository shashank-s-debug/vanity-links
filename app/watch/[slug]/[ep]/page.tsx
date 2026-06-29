import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERIES, getSeries, getEpisode } from "@/content";
import { WatchClient } from "@/components/WatchClient";

export function generateStaticParams() {
  return SERIES.flatMap((s) => s.episodes.map((e) => ({ slug: s.slug, ep: String(e.number) })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}): Promise<Metadata> {
  const { slug, ep } = await params;
  const series = getSeries(slug);
  const episode = getEpisode(slug, Number(ep));
  if (!series || !episode) return { title: "Not found" };
  return { title: `${series.title} — E${episode.number}: ${episode.title}` };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}) {
  const { slug, ep } = await params;
  const episodeNumber = Number(ep);
  const series = getSeries(slug);
  const episode = getEpisode(slug, episodeNumber);
  if (!series || !episode || Number.isNaN(episodeNumber)) notFound();

  const nextEpisode = series.episodes.find((e) => e.number === episodeNumber + 1) ?? null;

  return <WatchClient series={series} episode={episode} nextEpisode={nextEpisode} />;
}
