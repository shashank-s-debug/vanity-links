import Link from "next/link";
import { LumenMark } from "@/lib/art";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <LumenMark size={40} />
      <p className="mt-6 font-display text-6xl font-extrabold text-white">404</p>
      <h1 className="mt-2 text-xl font-semibold text-white">This scene doesn&apos;t exist</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for was cut in the edit. Let&apos;s get you back to the good stuff.
      </p>
      <div className="mt-7 flex items-center gap-3">
        <Link href="/home" className={buttonClass("primary", "md")}>
          Back to home
        </Link>
        <Link href="/browse" className={buttonClass("secondary", "md")}>
          Browse series
        </Link>
      </div>
    </div>
  );
}
