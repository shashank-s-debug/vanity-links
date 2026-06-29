"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Rail({
  title,
  kicker,
  viewAllHref,
  children,
}: {
  title: string;
  kicker?: string;
  viewAllHref?: string;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section className="group/rail relative">
      <div className="mb-3 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          {kicker && (
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/80">{kicker}</p>
          )}
          <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">{title}</h2>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-semibold text-muted transition hover:text-white"
          >
            View all
          </Link>
        )}
      </div>

      <div className="relative">
        {/* arrows (desktop) */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="absolute left-1 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass-strong text-white opacity-0 transition group-hover/rail:opacity-100 hover:scale-110 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="absolute right-1 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass-strong text-white opacity-0 transition group-hover/rail:opacity-100 hover:scale-110 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scroller}
          className="no-scrollbar mask-fade-x flex gap-3.5 overflow-x-auto px-4 pb-2 pt-1 sm:gap-4 sm:px-6 lg:px-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
