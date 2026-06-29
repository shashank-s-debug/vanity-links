"use client";

import { Check, Plus } from "lucide-react";
import { useLumen } from "@/lib/store";
import { cx } from "./ui";

export function FavoriteButton({
  slug,
  variant = "icon",
  className = "",
}: {
  slug: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { isFavorite, toggleFavorite, hydrated } = useLumen();
  const active = hydrated && isFavorite(slug);

  if (variant === "full") {
    return (
      <button
        onClick={() => toggleFavorite(slug)}
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 ring-focus active:scale-[0.97]",
          className,
        )}
        aria-pressed={active}
      >
        {active ? <Check className="h-5 w-5 text-brand" /> : <Plus className="h-5 w-5" />}
        {active ? "On My List" : "My List"}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      title={active ? "Remove from My List" : "Add to My List"}
      aria-pressed={active}
      className={cx(
        "flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ring-focus active:scale-90",
        active ? "border-brand/50 bg-brand/20 text-brand-bright" : "border-white/25 bg-black/40 text-white hover:bg-black/60",
        className,
      )}
    >
      {active ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
