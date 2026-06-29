import type { Series, SeriesArt as Art } from "@/content/types";
import { hashString } from "./format";

/**
 * Generative SVG artwork.
 *
 * Every visual asset (poster, hero banner, episode thumbnail, category tile,
 * cast avatar) is drawn from the same primitives and each series' palette +
 * motif, producing one cohesive visual identity without any binary images.
 * These are pure, hook-free components, safe to render on the server.
 */

type Variant = "poster" | "hero" | "thumb" | "tile" | "still";

function motifLayer(art: Art, seed: number) {
  const { accent, accent2, glow } = art;
  const r = (n: number) => ((seed >> n) & 0xff) / 255;

  switch (art.motif) {
    case "signal": {
      // Concentric "broadcast" arcs + a stray waveform — for the thriller.
      const cx = 30 + r(2) * 40;
      const cy = 24 + r(5) * 30;
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={8 + i * 11}
              fill="none"
              stroke={i % 2 ? accent2 : accent}
              strokeOpacity={0.22 - i * 0.03}
              strokeWidth={0.6}
            />
          ))}
          <path
            d={`M0 ${70 + r(7) * 10} q 12 -10 24 0 t 24 0 t 24 0 t 24 0 t 24 0`}
            fill="none"
            stroke={glow}
            strokeOpacity={0.5}
            strokeWidth={0.8}
          />
        </g>
      );
    }
    case "horizon": {
      // Soft sun + horizon bands — for the romance.
      const sunY = 40 + r(3) * 16;
      return (
        <g>
          <circle cx={50} cy={sunY} r={20} fill={glow} opacity={0.16} />
          <circle cx={50} cy={sunY} r={13} fill={accent} opacity={0.22} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={-10}
              y={sunY + 18 + i * 6}
              width={120}
              height={2.5}
              fill={accent2}
              opacity={0.16 - i * 0.025}
            />
          ))}
        </g>
      );
    }
    case "grid": {
      // Perspective dot-grid + scan node — for the sci-fi.
      const dots = [];
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 13; x++) {
          dots.push(
            <circle
              key={`${x}-${y}`}
              cx={4 + x * 8}
              cy={20 + y * 8}
              r={0.7 + (y / 9) * 0.9}
              fill={accent}
              opacity={0.1 + (y / 9) * 0.28}
            />,
          );
        }
      }
      return (
        <g>
          {dots}
          <circle cx={28 + r(4) * 44} cy={30 + r(6) * 30} r={2.4} fill={glow} opacity={0.9} />
        </g>
      );
    }
    case "tide":
    default: {
      // Layered waves — for the crime/coastal show.
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M-10 ${52 + i * 11} q 18 -${7 + i * 2} 36 0 t 36 0 t 36 0 t 36 0 V100 H-10 Z`}
              fill={i % 2 ? accent2 : accent}
              opacity={0.1 + i * 0.05}
            />
          ))}
          <circle cx={70 + r(2) * 18} cy={26 + r(5) * 10} r={9} fill={glow} opacity={0.14} />
        </g>
      );
    }
  }
}

export function SeriesArt({
  series,
  variant = "poster",
  episode,
  withTitle = false,
  className = "",
}: {
  series: Series;
  variant?: Variant;
  episode?: number;
  withTitle?: boolean;
  className?: string;
}) {
  const art = series.art;
  const seed = hashString(`${series.id}:${variant}:${episode ?? 0}`);
  const gid = `g-${series.id}-${variant}-${episode ?? 0}`;
  const angle = 120 + ((seed % 80) - 40);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id={`${gid}-bg`} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={art.accent} stopOpacity={0.9} />
          <stop offset="48%" stopColor={art.base} />
          <stop offset="100%" stopColor={art.accent2} stopOpacity={0.85} />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="32%" cy="22%" r="80%">
          <stop offset="0%" stopColor={art.glow} stopOpacity={0.34} />
          <stop offset="55%" stopColor={art.glow} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${gid}-vig`} cx="50%" cy="42%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.72} />
        </radialGradient>
        <filter id={`${gid}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>

      <rect width="100" height="100" fill={art.base} />
      <rect width="100" height="100" fill={`url(#${gid}-bg)`} opacity={0.55} />
      {motifLayer(art, seed)}
      <rect width="100" height="100" fill={`url(#${gid}-glow)`} />
      <rect width="100" height="100" fill={`url(#${gid}-vig)`} />
      <rect width="100" height="100" filter={`url(#${gid}-grain)`} opacity={0.5} />

      {withTitle && (
        <g>
          <text
            x="8"
            y="84"
            fill="#fff"
            fillOpacity="0.96"
            style={{ font: "700 9px var(--font-display, Georgia, serif)" }}
          >
            {series.title.length > 16 ? series.title.split(" ")[0] : series.title}
          </text>
          <text
            x="8"
            y="92"
            fill={art.glow}
            fillOpacity="0.85"
            style={{ font: "600 3.4px var(--font-sans, system-ui)", letterSpacing: "0.18em" }}
          >
            {series.genre.toUpperCase()}
          </text>
        </g>
      )}
    </svg>
  );
}

/** Monogram cast/profile avatar derived from the series palette. */
export function MonogramAvatar({
  initials,
  art,
  className = "",
}: {
  initials: string;
  art: Art;
  className?: string;
}) {
  const gid = `av-${initials}-${art.accent.replace("#", "")}`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={gid} gradientTransform="rotate(135 0.5 0.5)">
          <stop offset="0%" stopColor={art.accent} />
          <stop offset="100%" stopColor={art.accent2} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={art.base} />
      <rect width="100" height="100" fill={`url(#${gid})`} opacity={0.85} />
      <circle cx="50" cy="38" r="20" fill="#000" opacity={0.18} />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fill="#fff"
        fillOpacity="0.95"
        style={{ font: "700 34px var(--font-display, Georgia, serif)" }}
      >
        {initials}
      </text>
    </svg>
  );
}

/** The Lumen brand mark — an aperture. */
export function LumenMark({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lumen-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-bright)" />
          <stop offset="100%" stopColor="var(--brand-deep)" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="none" stroke="url(#lumen-mark)" strokeWidth="1.6" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1="12"
          x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
          y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
          stroke="url(#lumen-mark)"
          strokeWidth="1.1"
          strokeOpacity="0.85"
        />
      ))}
      <circle cx="12" cy="12" r="3.1" fill="var(--brand-bright)" />
    </svg>
  );
}
