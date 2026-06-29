"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X } from "lucide-react";
import { useLumen } from "@/lib/store";
import { PROFILE_GRADIENTS } from "@/components/Navigation";
import { buttonClass, cx } from "@/components/ui";

export default function ProfilesPage() {
  const router = useRouter();
  const { profiles, currentProfile, selectProfile, addProfile, removeProfile, hydrated } = useLumen();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [manage, setManage] = useState(false);

  if (!hydrated) return null;

  const pick = (id: string) => {
    selectProfile(id);
    router.push("/home");
  };

  const create = () => {
    const p = addProfile(name);
    setName("");
    setAdding(false);
    selectProfile(p.id);
    router.push("/home");
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-2 font-display text-3xl font-extrabold text-white sm:text-5xl">Who&apos;s watching?</h1>
      <p className="mb-12 text-sm text-muted">Choose a profile to personalize your Lumen.</p>

      <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-8">
        {profiles.map((p) => (
          <div key={p.id} className="group relative flex flex-col items-center gap-3">
            <button
              onClick={() => (manage ? removeProfile(p.id) : pick(p.id))}
              className={cx(
                "relative flex h-24 w-24 items-center justify-center rounded-2xl font-display text-4xl font-bold text-black/80 transition sm:h-28 sm:w-28",
                "ring-focus hover:scale-105",
                currentProfile?.id === p.id && !manage ? "ring-4 ring-brand ring-offset-2 ring-offset-bg" : "",
              )}
              style={{ background: PROFILE_GRADIENTS[p.avatar % PROFILE_GRADIENTS.length] }}
            >
              {p.name.charAt(0).toUpperCase()}
              {manage && (
                <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/55">
                  <X className="h-8 w-8 text-white" />
                </span>
              )}
              {currentProfile?.id === p.id && !manage && (
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-black">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
            <span className="text-sm font-medium text-white/80">{p.name}</span>
          </div>
        ))}

        {/* Add profile */}
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="flex flex-col items-center gap-3"
          >
            <span className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-white/20 text-white/50 transition hover:border-white/40 hover:text-white sm:h-28 sm:w-28">
              <Plus className="h-9 w-9" />
            </span>
            <span className="text-sm font-medium text-white/60">Add profile</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 sm:h-28 sm:w-28">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && create()}
                placeholder="Name"
                maxLength={20}
                className="w-20 bg-transparent text-center text-base text-white placeholder:text-dim focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={create} className={buttonClass("primary", "sm")}>
                Create
              </button>
              <button onClick={() => setAdding(false)} className={buttonClass("ghost", "sm")}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {profiles.length > 0 && (
        <button
          onClick={() => setManage((m) => !m)}
          className="mt-14 rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          {manage ? "Done" : "Manage profiles"}
        </button>
      )}
    </div>
  );
}
