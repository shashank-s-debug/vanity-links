import type { ReactNode } from "react";

/* ============================ class helpers ============================ */

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full ring-focus transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] whitespace-nowrap";
  const sizes: Record<Size, string> = {
    sm: "text-sm px-4 py-2",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3.5",
  };
  const variants: Record<Variant, string> = {
    primary: "bg-white text-black hover:bg-white/90 shadow-lg shadow-black/30",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur",
    ghost: "text-white/80 hover:text-white hover:bg-white/10",
    danger: "bg-danger/90 text-white hover:bg-danger",
  };
  return cx(base, sizes[size], variants[variant], extra);
}

/* ============================ components ============================ */

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "live" | "outline";
  className?: string;
}) {
  const tones = {
    neutral: "bg-white/10 text-white/80 border border-white/10",
    brand: "bg-brand/15 text-brand-bright border border-brand/30",
    live: "bg-danger/15 text-danger border border-danger/30",
    outline: "border border-white/25 text-white/75",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const radius = size / 2 - 3;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? "var(--success)" : score >= 75 ? "var(--brand)" : "#9aa0aa";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title={`Critics' score ${score}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize: size * 0.3, color }}
      >
        {score}
      </span>
    </div>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={cx("h-1 w-full overflow-hidden rounded-full bg-white/15", className)}>
      <div
        className="h-full rounded-full brand-gradient transition-[width] duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Spinner({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={cx("inline-block rounded-full border-2 border-white/20 border-t-brand animate-spin-slow", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={cx("skeleton rounded-xl", className)} />;
}

export function PosterSkeleton() {
  return (
    <div className="w-[150px] shrink-0 sm:w-[180px]">
      <Skeleton className="aspect-[2/3] w-full" />
      <Skeleton className="mt-3 h-3 w-3/4" />
      <Skeleton className="mt-2 h-2.5 w-1/2" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-surface px-6 py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-brand">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  kicker,
  action,
}: {
  title: string;
  kicker?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/80">{kicker}</p>}
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
