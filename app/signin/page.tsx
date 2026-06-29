"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SERIES } from "@/content";
import { SeriesArt, LumenMark } from "@/lib/art";
import { useLumen } from "@/lib/store";
import { buttonClass } from "@/components/ui";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, addProfile, selectProfile } = useLumen();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Local-first auth: no backend round-trip in this build.
    signIn(email || "guest@lumen.tv", name || email.split("@")[0] || "You");
    setTimeout(() => router.push("/home"), 250);
  };

  const guest = () => {
    const p = addProfile("Guest");
    selectProfile(p.id);
    router.push("/home");
  };

  return (
    <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 grid grid-cols-2 gap-3 p-6 opacity-60">
          {SERIES.concat(SERIES).slice(0, 6).map((s, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/10">
              <SeriesArt series={s} variant="poster" withTitle />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white">
            A whole season,
            <br />
            one sitting.
          </h2>
          <p className="mt-3 max-w-sm text-white/70">
            Join Lumen and start bingeing original microdramas — cinematic stories told 90 seconds at a time.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2">
            <LumenMark size={26} />
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">Lumen</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white">
            {mode === "signup" ? "Create your profile" : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {mode === "signup" ? "It takes ten seconds. No card required." : "Sign in to keep bingeing."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <Field label="Your name" value={name} onChange={setName} placeholder="Alex" autoComplete="name" />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />

            <button type="submit" disabled={submitting} className={buttonClass("primary", "lg", "w-full")}>
              {submitting ? "Setting up…" : mode === "signup" ? "Create profile" : "Sign in"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <button onClick={guest} className="mt-3 w-full text-center text-sm text-muted transition hover:text-white">
            or continue as guest
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            {mode === "signup" ? "Already have a profile?" : "New to Lumen?"}{" "}
            <button
              onClick={() => setMode((m) => (m === "signup" ? "signin" : "signup"))}
              className="font-semibold text-brand hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>

          <p className="mt-6 text-center text-[11px] text-dim">
            Demo auth — your profile lives only in this browser.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/12 bg-surface px-4 py-3 text-sm text-white placeholder:text-dim ring-focus focus:border-brand/40"
      />
    </label>
  );
}
