// Content domain model for the MicroDrama catalog.
//
// A `Beat` is the atomic unit of an episode. The same beat array is rendered
// two ways:
//   1. As a formatted screenplay on the episode/series pages.
//   2. As timed, animated playback inside the cinematic player.
// This lets the platform ship "watchable" microdramas without a video file:
// the player performs the screenplay as a motion sequence.

export type Genre =
  | "Romance"
  | "Thriller"
  | "Sci-Fi"
  | "Crime"
  | "Drama"
  | "Mystery";

export type BeatKind =
  | "slate" // opening title card for the episode
  | "scene" // scene heading + description (INT./EXT.)
  | "action" // action / description line
  | "dialogue" // a character speaks
  | "vo" // voice-over / internal monologue
  | "sfx" // sound / music cue
  | "cliffhanger"; // the closing hook

export interface Beat {
  kind: BeatKind;
  /** Seconds this beat occupies during playback. */
  sec: number;
  /** Primary text: the line, description, or cue. */
  text: string;
  /** Speaker name for `dialogue` beats. */
  speaker?: string;
  /** A parenthetical performance note for dialogue, e.g. "(whispering)". */
  paren?: string;
  /** Scene location for `scene` beats, e.g. "INT. METRO PLATFORM — NIGHT". */
  slug?: string;
  /** Subtle camera direction shown in the player and screenplay. */
  camera?: string;
}

export interface Episode {
  number: number;
  title: string;
  /** One-line logline shown in lists. */
  logline: string;
  /** Total runtime in seconds (derived from beats, but stored for lists). */
  runtimeSec: number;
  beats: Beat[];
  /** The closing cliffhanger line (also present as the final beat). */
  cliffhanger: string;
}

export interface CastMember {
  name: string; // actor (fictional)
  character: string;
  /** Two-letter monogram for the generated avatar. */
  initials: string;
}

export interface SeriesArt {
  /** Cohesive palette — every asset for the series derives from these. */
  base: string; // deepest background
  accent: string; // primary accent
  accent2: string; // secondary accent
  glow: string; // highlight / light source
  /** Visual motif used by the generative art system. */
  motif: "signal" | "horizon" | "grid" | "tide";
}

export interface Series {
  id: string;
  slug: string;
  title: string;
  genre: Genre;
  /** Short, punchy marketing line. */
  tagline: string;
  /** One-paragraph premise. */
  premise: string;
  /** Longer season synopsis. */
  synopsis: string;
  /** Art-direction note for the poster (documents the visual identity). */
  posterConcept: string;
  year: number;
  /** Maturity rating, e.g. "16+". */
  maturity: string;
  /** Average episode length label, e.g. "90s". */
  avgLength: string;
  tags: string[];
  /** Editorial score 0–100 used for "Critics" badge. */
  score: number;
  cast: CastMember[];
  art: SeriesArt;
  episodes: Episode[];
}
