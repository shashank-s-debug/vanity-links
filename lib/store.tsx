"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Client-side personalization store.
 *
 * Auth, profiles, My List, and watch progress are persisted to localStorage.
 * The shape is intentionally backend-agnostic: swapping this for real API
 * calls later means changing only the action bodies, not the components.
 */

export interface Progress {
  slug: string;
  episode: number;
  positionSec: number;
  durationSec: number;
  updatedAt: number;
  completed: boolean;
}

export interface Profile {
  id: string;
  name: string;
  /** Index into a fixed palette of generated avatar gradients. */
  avatar: number;
}

export interface User {
  email: string;
  name: string;
}

interface ProfileData {
  favorites: string[];
  progress: Record<string, Progress>;
}

interface PersistShape {
  user: User | null;
  profiles: Profile[];
  currentProfileId: string | null;
  byProfile: Record<string, ProfileData>;
}

const STORAGE_KEY = "lumen.v1";

const EMPTY: PersistShape = {
  user: null,
  profiles: [],
  currentProfileId: null,
  byProfile: {},
};

function emptyProfileData(): ProfileData {
  return { favorites: [], progress: {} };
}

function progressKey(slug: string, episode: number) {
  return `${slug}:${episode}`;
}

interface LumenContextValue {
  hydrated: boolean;
  user: User | null;
  profiles: Profile[];
  currentProfile: Profile | null;

  signIn: (email: string, name: string) => void;
  signOut: () => void;
  addProfile: (name: string) => Profile;
  selectProfile: (id: string) => void;
  removeProfile: (id: string) => void;

  favorites: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;

  progressList: Progress[];
  getProgress: (slug: string, episode: number) => Progress | undefined;
  getSeriesProgress: (slug: string) => Progress | undefined;
  saveProgress: (p: Omit<Progress, "updatedAt">) => void;
  clearProgress: (slug: string, episode?: number) => void;
  clearAllHistory: () => void;
}

const LumenContext = createContext<LumenContextValue | null>(null);

const AVATAR_COUNT = 6;

export function LumenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistShape>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount. This is a deliberate read from an
  // external store (the documented, supported use of an effect), so the
  // set-state-in-effect rule is intentionally suppressed here.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistShape;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ ...EMPTY, ...parsed });
      }
    } catch {
      /* ignore corrupt storage */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration so we never clobber on first paint).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable */
    }
  }, [state, hydrated]);

  const currentProfile = useMemo(
    () => state.profiles.find((p) => p.id === state.currentProfileId) ?? null,
    [state.profiles, state.currentProfileId],
  );

  const profileData: ProfileData = useMemo(() => {
    if (!state.currentProfileId) return emptyProfileData();
    return state.byProfile[state.currentProfileId] ?? emptyProfileData();
  }, [state.byProfile, state.currentProfileId]);

  const mutateProfileData = useCallback((updater: (d: ProfileData) => ProfileData) => {
    setState((prev) => {
      const id = prev.currentProfileId;
      if (!id) return prev;
      const current = prev.byProfile[id] ?? emptyProfileData();
      return { ...prev, byProfile: { ...prev.byProfile, [id]: updater(current) } };
    });
  }, []);

  const signIn = useCallback((email: string, name: string) => {
    setState((prev) => {
      const defaultProfile: Profile = { id: crypto.randomUUID(), name: name || "You", avatar: 0 };
      const hasProfiles = prev.profiles.length > 0;
      return {
        ...prev,
        user: { email, name },
        profiles: hasProfiles ? prev.profiles : [defaultProfile],
        currentProfileId: prev.currentProfileId ?? (hasProfiles ? prev.profiles[0].id : defaultProfile.id),
        byProfile: hasProfiles ? prev.byProfile : { [defaultProfile.id]: emptyProfileData() },
      };
    });
  }, []);

  const signOut = useCallback(() => {
    // Keep profiles + data (like Netflix), just drop the session + active profile.
    setState((prev) => ({ ...prev, user: null, currentProfileId: null }));
  }, []);

  const addProfile = useCallback((name: string) => {
    const profile: Profile = {
      id: crypto.randomUUID(),
      name: name.trim() || "New Profile",
      avatar: Math.floor(Math.random() * AVATAR_COUNT),
    };
    setState((prev) => ({
      ...prev,
      profiles: [...prev.profiles, profile],
      byProfile: { ...prev.byProfile, [profile.id]: emptyProfileData() },
    }));
    return profile;
  }, []);

  const selectProfile = useCallback((id: string) => {
    setState((prev) => ({ ...prev, currentProfileId: id }));
  }, []);

  const removeProfile = useCallback((id: string) => {
    setState((prev) => {
      const rest = { ...prev.byProfile };
      delete rest[id];
      const profiles = prev.profiles.filter((p) => p.id !== id);
      return {
        ...prev,
        profiles,
        byProfile: rest,
        currentProfileId: prev.currentProfileId === id ? (profiles[0]?.id ?? null) : prev.currentProfileId,
      };
    });
  }, []);

  const isFavorite = useCallback((slug: string) => profileData.favorites.includes(slug), [profileData]);

  const toggleFavorite = useCallback(
    (slug: string) => {
      mutateProfileData((d) => ({
        ...d,
        favorites: d.favorites.includes(slug)
          ? d.favorites.filter((s) => s !== slug)
          : [slug, ...d.favorites],
      }));
    },
    [mutateProfileData],
  );

  const getProgress = useCallback(
    (slug: string, episode: number) => profileData.progress[progressKey(slug, episode)],
    [profileData],
  );

  const getSeriesProgress = useCallback(
    (slug: string) => {
      const entries = Object.values(profileData.progress)
        .filter((p) => p.slug === slug)
        .sort((a, b) => b.updatedAt - a.updatedAt);
      return entries[0];
    },
    [profileData],
  );

  const saveProgress = useCallback(
    (p: Omit<Progress, "updatedAt">) => {
      mutateProfileData((d) => ({
        ...d,
        progress: { ...d.progress, [progressKey(p.slug, p.episode)]: { ...p, updatedAt: Date.now() } },
      }));
    },
    [mutateProfileData],
  );

  const clearProgress = useCallback(
    (slug: string, episode?: number) => {
      mutateProfileData((d) => {
        const next: Record<string, Progress> = {};
        for (const [key, value] of Object.entries(d.progress)) {
          if (value.slug !== slug) next[key] = value;
          else if (episode !== undefined && value.episode !== episode) next[key] = value;
        }
        return { ...d, progress: next };
      });
    },
    [mutateProfileData],
  );

  const clearAllHistory = useCallback(() => {
    mutateProfileData((d) => ({ ...d, progress: {} }));
  }, [mutateProfileData]);

  const progressList = useMemo(
    () => Object.values(profileData.progress).sort((a, b) => b.updatedAt - a.updatedAt),
    [profileData],
  );

  const value: LumenContextValue = {
    hydrated,
    user: state.user,
    profiles: state.profiles,
    currentProfile,
    signIn,
    signOut,
    addProfile,
    selectProfile,
    removeProfile,
    favorites: profileData.favorites,
    isFavorite,
    toggleFavorite,
    progressList,
    getProgress,
    getSeriesProgress,
    saveProgress,
    clearProgress,
    clearAllHistory,
  };

  return <LumenContext.Provider value={value}>{children}</LumenContext.Provider>;
}

export function useLumen(): LumenContextValue {
  const ctx = useContext(LumenContext);
  if (!ctx) throw new Error("useLumen must be used within <LumenProvider>");
  return ctx;
}
