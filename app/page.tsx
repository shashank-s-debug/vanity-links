import Link from "next/link";
import { ArrowRight, Clapperboard, Clock, Play, Sparkles, Star } from "lucide-react";
import { SERIES, seriesRuntimeSec } from "@/content";
import { SeriesArt, LumenMark } from "@/lib/art";
import { buttonClass, Badge } from "@/components/ui";
import { seasonLengthLabel } from "@/lib/format";

export default function LandingPage() {
  const featured = SERIES;

  return (
    <div className="relative z-10 overflow-hidden">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex h-16 max-w-[var(--maxw)] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <LumenMark size={24} />
            <span className="font-display text-xl font-extrabold tracking-tight text-white">Lumen</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/signin" className={buttonClass("ghost", "sm")}>
              Sign in
            </Link>
            <Link href="/home" className={buttonClass("primary", "sm")}>
              Enter Lumen
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        {/* Floating poster montage */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(80%_70%_at_70%_40%,#000,transparent)]">
          <div className="absolute right-[-4%] top-[8%] grid w-[60%] grid-cols-3 gap-4 rotate-6">
            {featured.concat(featured).slice(0, 6).map((s, i) => (
              <div
                key={i}
                className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <SeriesArt series={s} variant="poster" withTitle />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[var(--maxw)] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <Badge tone="brand" className="mb-6">
              <Sparkles className="h-3 w-3" /> Now streaming · 4 original seasons
            </Badge>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl">
              Cinema, by the <span className="text-brand-gradient">minute.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Lumen is a premium home for <strong className="text-white">microdramas</strong> — original,
              cinematic stories told in 60–120 second episodes. Finish a whole season in the time it takes
              to feel something.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/home" className={buttonClass("primary", "lg")}>
                <Play className="h-5 w-5 fill-black" /> Start watching free
              </Link>
              <Link href="/signin" className={buttonClass("secondary", "lg")}>
                Create your profile <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/45">No credit card. No app. Just press play.</p>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-white/10 bg-bg-elev/60">
        <div className="mx-auto grid max-w-[var(--maxw)] grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Clapperboard, stat: "4", label: "Original seasons" },
            { icon: Play, stat: "40", label: "Microdrama episodes" },
            { icon: Clock, stat: "~90s", label: "Average episode" },
            { icon: Star, stat: "93", label: "Avg. critics' score" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 py-8">
              <s.icon className="h-7 w-7 text-brand" />
              <div>
                <p className="font-display text-2xl font-bold text-white">{s.stat}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured originals */}
      <section className="mx-auto max-w-[var(--maxw)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand/80">Lumen Originals</p>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Four worlds. One sitting each.</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s, i) => (
            <Link
              key={s.id}
              href={`/series/${s.slug}`}
              className="group card-hover overflow-hidden rounded-2xl border border-white/10 bg-bg-elev animate-fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <SeriesArt series={s} variant="poster" withTitle />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black opacity-0 transition group-hover:opacity-100">
                  <Play className="h-3 w-3 fill-black" /> Play
                </span>
              </div>
              <div className="p-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <Badge tone="outline">{s.genre}</Badge>
                  <span className="text-xs text-muted">{seasonLengthLabel(seriesRuntimeSec(s))}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{s.title}</h3>
                <p className="clamp-2 mt-1 text-sm text-muted">{s.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 bg-bg-elev/40">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">Why people binge Lumen</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { t: "Made for momentum", b: "Every episode ends on a cliffhanger engineered to make 'one more' irresistible. Autoplay does the rest." },
              { t: "Premium, not cheap", b: "Cinematic direction, original writing, and a design language closer to Apple TV+ than an OTT clone." },
              { t: "Respects your time", b: "A full season is the length of a coffee break. Start and finish a story in one sitting — guilt-free." },
            ].map((f, i) => (
              <div key={f.t}>
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 font-display text-lg font-bold text-brand">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-white">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/home" className={buttonClass("primary", "lg")}>
              <Play className="h-5 w-5 fill-black" /> Enter Lumen
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center">
        <div className="mx-auto flex max-w-[var(--maxw)] flex-col items-center gap-3 px-4">
          <div className="flex items-center gap-2">
            <LumenMark size={20} />
            <span className="font-display text-lg font-bold text-white">Lumen</span>
          </div>
          <p className="text-xs text-muted">Cinema, by the minute. · A concept microdrama platform.</p>
          <p className="text-[11px] text-dim">© {new Date().getFullYear()} Lumen. All stories original and fictional.</p>
        </div>
      </footer>
    </div>
  );
}
