"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FastForward,
  Gauge,
  Pause,
  Play,
  Rewind,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Beat, Episode, Series } from "@/content/types";
import { SeriesArt } from "@/lib/art";
import { useLumen } from "@/lib/store";
import { formatClock, clamp } from "@/lib/format";
import { cx } from "./ui";

interface TimedBeat {
  beat: Beat;
  start: number;
  end: number;
  index: number;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

interface PlayerProps {
  series: Series;
  episode: Episode;
  nextEpisode: Episode | null;
  startAt?: number;
}

/**
 * Dispatcher: streams a real clip when one exists, otherwise performs the
 * motion screenplay. The branch is before any hooks, so each engine owns its
 * own hooks cleanly.
 */
export function Player(props: PlayerProps) {
  return props.episode.videoUrl ? <VideoPlayer {...props} /> : <MotionPlayer {...props} />;
}

function MotionPlayer({ series, episode, nextEpisode, startAt = 0 }: PlayerProps) {
  const router = useRouter();
  const { saveProgress } = useLumen();

  const timeline = useMemo<TimedBeat[]>(() => {
    const out: TimedBeat[] = [];
    let acc = 0;
    for (let index = 0; index < episode.beats.length; index++) {
      const beat = episode.beats[index];
      const start = acc;
      acc += beat.sec;
      out.push({ beat, start, end: acc, index });
    }
    return out;
  }, [episode]);

  const total = episode.runtimeSec || timeline[timeline.length - 1]?.end || 1;

  const [position, setPosition] = useState(() => clamp(startAt, 0, total - 0.1));
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [ended, setEnded] = useState(false);
  const [countdown, setCountdown] = useState(6);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const positionRef = useRef(position);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirror position into a ref for use in event handlers / persistence,
  // written from an effect (never during render).
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  /* ----------------------- playback loop (rAF) ----------------------- */
  useEffect(() => {
    if (!playing || ended) {
      lastTsRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const delta = ((ts - lastTsRef.current) / 1000) * speed;
      lastTsRef.current = ts;
      setPosition((prev) => {
        const next = prev + delta;
        if (next >= total) {
          setEnded(true);
          setPlaying(false);
          return total;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, ended, speed, total]);

  /* ----------------------- progress persistence ----------------------- */
  const persist = useCallback(
    (completed: boolean) => {
      saveProgress({
        slug: series.slug,
        episode: episode.number,
        positionSec: completed ? total : positionRef.current,
        durationSec: total,
        completed,
      });
    },
    [saveProgress, series.slug, episode.number, total],
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (playing && !ended) persist(false);
    }, 4000);
    return () => clearInterval(id);
  }, [playing, ended, persist]);

  useEffect(() => {
    if (ended) persist(true);
  }, [ended, persist]);

  // Save on unmount / tab close.
  useEffect(() => {
    const onHide = () => persist(positionRef.current >= total - 0.5);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      persist(positionRef.current >= total - 0.5);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------- autoplay next ----------------------- */
  useEffect(() => {
    if (!ended || !nextEpisode) return;
    // countdown is reset to its start value in seek(); here we just run it down.
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          router.push(`/watch/${series.slug}/${nextEpisode.number}`);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [ended, nextEpisode, router, series.slug]);

  /* ----------------------- controls auto-hide ----------------------- */
  const wakeControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing && !ended) setControlsVisible(false);
      setSpeedOpen(false);
    }, 3000);
  }, [playing, ended]);

  useEffect(() => {
    // Kick off the initial auto-hide timer without a synchronous setState.
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /* ----------------------- seeking ----------------------- */
  const seek = useCallback(
    (to: number) => {
      const t = clamp(to, 0, total - 0.05);
      setPosition(t);
      setEnded(false);
      setCountdown(6);
      lastTsRef.current = null;
      wakeControls();
    },
    [total, wakeControls],
  );

  const togglePlay = useCallback(() => {
    if (ended) {
      seek(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
    wakeControls();
  }, [ended, seek, wakeControls]);

  /* ----------------------- keyboard ----------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          seek(positionRef.current + 5);
          break;
        case "ArrowLeft":
          seek(positionRef.current - 5);
          break;
        case "m":
          setMuted((m) => !m);
          break;
        case "n":
          if (nextEpisode) router.push(`/watch/${series.slug}/${nextEpisode.number}`);
          break;
        case "Escape":
          router.push(`/series/${series.slug}`);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, seek, nextEpisode, router, series.slug]);

  const current = timeline.find((t) => position >= t.start && position < t.end) ?? timeline[timeline.length - 1];

  return (
    <div
      className="fixed inset-0 z-[60] select-none overflow-hidden bg-black"
      onMouseMove={wakeControls}
      onClick={(e) => {
        // click on the stage (not controls) toggles play
        if ((e.target as HTMLElement).dataset.stage === "true") togglePlay();
      }}
      style={{ cursor: controlsVisible ? "default" : "none" }}
    >
      {/* Background art (ken burns) */}
      <div className="absolute inset-0">
        <div className={cx("absolute inset-0", playing && !ended && "animate-ken-burns")}>
          <SeriesArt series={series} variant="still" episode={episode.number} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/70" />
        {/* letterbox */}
        <div className="absolute inset-x-0 top-0 h-[7vh] bg-black" />
        <div className="absolute inset-x-0 bottom-0 h-[7vh] bg-black" />
      </div>

      {/* Stage — the performed beat */}
      <div
        data-stage="true"
        className="absolute inset-0 flex items-center justify-center px-6 sm:px-10"
      >
        {!ended && current && <BeatStage key={current.index} beat={current.beat} art={series.art} />}
        {ended && (
          <EndCard
            series={series}
            nextEpisode={nextEpisode}
            countdown={countdown}
            onReplay={() => {
              seek(0);
              setPlaying(true);
            }}
          />
        )}
      </div>

      {/* Camera direction watermark */}
      {!ended && current?.beat.camera && (
        <div
          className={cx(
            "pointer-events-none absolute bottom-[12vh] left-6 max-w-xs text-[11px] uppercase tracking-widest text-white/35 transition-opacity sm:left-10",
            controlsVisible ? "opacity-100" : "opacity-0",
          )}
        >
          ▣ {current.beat.camera}
        </div>
      )}

      {/* Top bar */}
      <div
        className={cx(
          "absolute inset-x-0 top-0 z-20 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 sm:p-6",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <Link
          href={`/series/${series.slug}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 ring-focus"
          aria-label="Back to series"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="min-w-0">
          <p className="clamp-1 text-sm font-semibold text-white sm:text-base">{series.title}</p>
          <p className="clamp-1 text-xs text-white/60">
            Episode {episode.number} · {episode.title}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={cx(
          "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 to-transparent px-4 pb-6 pt-16 transition-opacity duration-300 sm:px-8",
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {/* Timeline with beat markers */}
        <Timeline timeline={timeline} position={position} total={total} onSeek={seek} />

        <div className="mt-3 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => seek(position - 5)} className="rounded-full p-2 transition hover:bg-white/10 ring-focus" aria-label="Back 5 seconds">
              <Rewind className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 ring-focus"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing && !ended ? <Pause className="h-6 w-6 fill-black" /> : <Play className="h-6 w-6 translate-x-0.5 fill-black" />}
            </button>
            <button onClick={() => seek(position + 5)} className="rounded-full p-2 transition hover:bg-white/10 ring-focus" aria-label="Forward 5 seconds">
              <FastForward className="h-5 w-5" />
            </button>
            <button onClick={() => setMuted((m) => !m)} className="hidden rounded-full p-2 transition hover:bg-white/10 ring-focus sm:block" aria-label="Mute">
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <span className="ml-1 text-xs tabular-nums text-white/70">
              {formatClock(position)} / {formatClock(total)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                onClick={() => setSpeedOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-white/10 ring-focus"
                aria-label="Playback speed"
              >
                <Gauge className="h-4 w-4" /> {speed}×
              </button>
              {speedOpen && (
                <div className="absolute bottom-12 right-0 w-24 overflow-hidden rounded-xl border border-white/10 glass-strong p-1 shadow-pop animate-scale-in">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeed(s);
                        setSpeedOpen(false);
                      }}
                      className={cx(
                        "block w-full rounded-lg px-3 py-1.5 text-left text-xs transition hover:bg-white/10",
                        s === speed ? "text-brand" : "text-white/80",
                      )}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              )}
            </div>

            {nextEpisode && (
              <Link
                href={`/watch/${series.slug}/${nextEpisode.number}`}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition hover:bg-white/10 ring-focus"
              >
                <SkipForward className="h-4 w-4" /> <span className="hidden sm:inline">Next</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== real-video engine (production seam) ===================== */

function VideoPlayer({ series, episode, nextEpisode, startAt = 0 }: PlayerProps) {
  const router = useRouter();
  const { saveProgress } = useLumen();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaveRef = useRef(0);

  const persist = useCallback(
    (completed: boolean) => {
      const v = videoRef.current;
      const dur = v?.duration && Number.isFinite(v.duration) ? v.duration : episode.runtimeSec;
      saveProgress({
        slug: series.slug,
        episode: episode.number,
        positionSec: completed ? dur : v?.currentTime ?? 0,
        durationSec: dur,
        completed,
      });
    },
    [saveProgress, series.slug, episode.number, episode.runtimeSec],
  );

  useEffect(() => () => persist(false), [persist]);

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      <video
        ref={videoRef}
        src={episode.videoUrl}
        poster={episode.poster}
        autoPlay
        controls
        playsInline
        className="h-full w-full object-contain"
        onLoadedMetadata={() => {
          const v = videoRef.current;
          if (v && startAt > 0 && startAt < (v.duration || Infinity)) v.currentTime = startAt;
        }}
        onTimeUpdate={() => {
          const now = Date.now();
          if (now - lastSaveRef.current > 4000) {
            lastSaveRef.current = now;
            persist(false);
          }
        }}
        onEnded={() => {
          persist(true);
          if (nextEpisode) router.push(`/watch/${series.slug}/${nextEpisode.number}`);
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
        <Link
          href={`/series/${series.slug}`}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 ring-focus"
          aria-label="Back to series"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <p className="text-sm font-semibold text-white sm:text-base">{series.title}</p>
          <p className="text-xs text-white/60">
            Episode {episode.number} · {episode.title}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================ subcomponents ============================ */

function Timeline({
  timeline,
  position,
  total,
  onSeek,
}: {
  timeline: TimedBeat[];
  position: number;
  total: number;
  onSeek: (to: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onClick = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onSeek(((e.clientX - rect.left) / rect.width) * total);
  };
  return (
    <div ref={ref} onClick={onClick} className="group relative h-4 cursor-pointer">
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
        <div className="h-full brand-gradient" style={{ width: `${(position / total) * 100}%` }} />
      </div>
      {/* beat dividers */}
      {timeline.slice(1).map((t) => (
        <span
          key={t.index}
          className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-black/50"
          style={{ left: `${(t.start / total) * 100}%` }}
        />
      ))}
      {/* playhead */}
      <span
        className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow opacity-0 transition group-hover:opacity-100"
        style={{ left: `${(position / total) * 100}%` }}
      />
    </div>
  );
}

function BeatStage({ beat, art }: { beat: Beat; art: Series["art"] }) {
  const base =
    "animate-fade-up text-center mx-auto max-w-3xl";
  switch (beat.kind) {
    case "slate":
      return (
        <div className={base}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-brand">Lumen Original</p>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl">{beat.text}</h2>
        </div>
      );
    case "scene":
      return (
        <div className={base}>
          {beat.slug && (
            <p className="mb-5 inline-block rounded-md border border-white/15 bg-black/40 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-white/80 sm:text-sm">
              {beat.slug}
            </p>
          )}
          <p className="text-2xl leading-relaxed text-white/90 sm:text-3xl">{beat.text}</p>
        </div>
      );
    case "action":
      return (
        <div className={base}>
          <p className="text-2xl leading-relaxed text-white/85 sm:text-4xl">{beat.text}</p>
        </div>
      );
    case "dialogue":
      return (
        <div className={base}>
          <p className="mb-2 font-mono text-sm uppercase tracking-[0.3em]" style={{ color: art.glow }}>
            {beat.speaker}
          </p>
          {beat.paren && <p className="mb-2 text-base italic text-white/55">{beat.paren}</p>}
          <p className="font-display text-3xl font-semibold leading-snug text-white sm:text-5xl">“{beat.text}”</p>
        </div>
      );
    case "vo":
      return (
        <div className={base}>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">Voice-over · {beat.speaker}</p>
          <p className="text-2xl italic leading-relaxed text-white/85 sm:text-4xl">{beat.text}</p>
        </div>
      );
    case "sfx":
      return (
        <div className={base}>
          <div className="mx-auto mb-5 flex items-end justify-center gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full animate-pulse-glow"
                style={{
                  height: `${14 + ((i * 37) % 40)}px`,
                  background: art.accent,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
          <p className="text-lg uppercase tracking-[0.25em] text-white/70 sm:text-xl">{beat.text}</p>
        </div>
      );
    case "cliffhanger":
      return (
        <div className="mx-auto max-w-3xl animate-scale-in text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-danger">To be continued</p>
          <p className="font-display text-3xl font-bold leading-snug text-white sm:text-5xl">{beat.text}</p>
        </div>
      );
    default:
      return <p className={base}>{beat.text}</p>;
  }
}

function EndCard({
  series,
  nextEpisode,
  countdown,
  onReplay,
}: {
  series: Series;
  nextEpisode: Episode | null;
  countdown: number;
  onReplay: () => void;
}) {
  return (
    <div className="mx-auto max-w-md animate-scale-in text-center">
      {nextEpisode ? (
        <>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">Up next in {countdown}s</p>
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
            E{nextEpisode.number} · {nextEpisode.title}
          </h3>
          <p className="clamp-2 mt-2 text-sm text-white/70">{nextEpisode.logline}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href={`/watch/${series.slug}/${nextEpisode.number}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-105"
            >
              <Play className="h-4 w-4 fill-black" /> Play Now
            </Link>
            <button onClick={onReplay} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Replay
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-brand">Season finale</p>
          <h3 className="font-display text-3xl font-bold text-white">That&apos;s a wrap.</h3>
          <p className="mt-2 text-sm text-white/70">You&apos;ve finished {series.title}.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={onReplay} className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-105">
              Watch again
            </button>
            <Link href="/home" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Browse more
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
