"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/15 text-danger">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="font-display text-3xl font-bold text-white">Something broke mid-scene.</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        An unexpected error interrupted playback. You can retry, or head back to the home screen.
      </p>
      <div className="mt-7 flex items-center gap-3">
        <button onClick={reset} className={buttonClass("primary", "md")}>
          Try again
        </button>
        <Link href="/home" className={buttonClass("secondary", "md")}>
          Go home
        </Link>
      </div>
    </div>
  );
}
