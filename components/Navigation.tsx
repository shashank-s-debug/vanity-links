"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Clapperboard, Home, Search, User } from "lucide-react";
import { useLumen } from "@/lib/store";
import { LumenMark } from "@/lib/art";
import { cx } from "./ui";

export const PROFILE_GRADIENTS = [
  "linear-gradient(135deg,#e9b44c,#c8902f)",
  "linear-gradient(135deg,#4ea8ff,#3b5bdb)",
  "linear-gradient(135deg,#2ee6c8,#159e8a)",
  "linear-gradient(135deg,#e8526a,#b3324a)",
  "linear-gradient(135deg,#a78bfa,#7c5cf0)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
];

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/browse", label: "Series", icon: Clapperboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/my-list", label: "My List", icon: Bookmark },
];

export function ProfileBubble({ avatar, name, size = 32 }: { avatar: number; name: string; size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-lg font-bold text-black/80"
      style={{ width: size, height: size, background: PROFILE_GRADIENTS[avatar % PROFILE_GRADIENTS.length], fontSize: size * 0.42 }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentProfile, signOut } = useLumen();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close the menu when the route changes (deferred so it isn't a
  // synchronous setState inside the effect body).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong border-b border-white/10" : "bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[var(--maxw)] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center gap-2 ring-focus rounded-lg" aria-label="Lumen home">
            <LumenMark size={24} />
            <span className="font-display text-xl font-extrabold tracking-tight text-white">Lumen</span>
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cx(
                      "rounded-full px-3.5 py-1.5 text-sm font-medium transition ring-focus",
                      active ? "text-white" : "text-white/60 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white md:hidden ring-focus"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full p-0.5 ring-focus"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {currentProfile ? (
                <ProfileBubble avatar={currentProfile.avatar} name={currentProfile.name} />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                  <User className="h-4 w-4" />
                </span>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 glass-strong p-1.5 shadow-pop animate-scale-in">
                {currentProfile && (
                  <div className="border-b border-white/10 px-3 py-2.5">
                    <p className="text-sm font-semibold text-white">{currentProfile.name}</p>
                    <p className="text-xs text-muted">Lumen member</p>
                  </div>
                )}
                <MenuLink href="/profiles" label="Switch profile" />
                <MenuLink href="/history" label="Watch history" />
                <MenuLink href="/my-list" label="My List" />
                <button
                  onClick={signOut}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition hover:bg-white/5"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white">
      {label}
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 glass-strong pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cx(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition ring-focus",
                  active ? "text-brand" : "text-white/55",
                )}
              >
                <Icon className={cx("h-5 w-5", active && "fill-brand/15")} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
