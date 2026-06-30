# Lumen — Cinema, by the minute.

A premium streaming platform built exclusively for **microdramas** — cinematic, vertical, finish-in-one-sitting stories. The product, design language, and content are all original, aiming for the polish of Apple TV+ / Netflix / A24 rather than a generic OTT clone.

> **Status:** launch-ready demo. Production build passes (55 routes), fully self-contained (no database or external services required to run).

---

## ✨ What's inside

- **Cinematic landing page** with a clear product story.
- **Home** experience: auto-rotating featured **Hero**, **Continue Watching**, and editorial rails (Trending, New Releases, Finish in One Sitting, Twist Endings).
- **Browse / Categories** with live genre filtering.
- **Search** across titles, genres, tags, premise, and cast.
- **Series detail** pages with synopsis, cast, and a full episode guide.
- **The player** — a custom **motion-screenplay engine** that performs each episode (timed scene cards, dialogue, sound cues, camera notes, cliffhangers) over Ken-Burns artwork, with a real-video fallback path (see below).
- **My List** (favorites), **Watch History**, and Netflix-style **Profiles** ("who's watching").
- **Authentication** flow, plus loading skeletons, empty states, an error boundary, and a 404.
- Fully **responsive**: mobile (bottom tab bar), tablet, and desktop (top nav) layouts.

## 🎬 Original content

Four complete, original microdrama series — **40 episodes total**, each a full screenplay (scene headings, action, dialogue, camera direction, and a cliffhanger):

| Series | Genre | Logline |
|---|---|---|
| **The Last Message** | Thriller | A woman is texted by her sister's phone — three days after the funeral. |
| **Afterglow** | Romance | A city-wide blackout traps two strangers — and one leaves the country at dawn. |
| **Echo Protocol** | Sci-Fi | A grief-tech engineer finds an AI "echo" of herself that shouldn't exist yet. |
| **Saltwater** | Crime | A daughter returns to bury her father and inherits a town's smuggling secret. |

Content lives in [`content/`](content/) as typed data. Each episode is built from **beats**, which render two ways: as a formatted **screenplay** on the page, and as **timed playback** in the player.

## 🎨 Design system

Defined in [`app/globals.css`](app/globals.css): a neutral premium-dark chrome (so each series' own palette can sing), an ember-gold brand accent, a typographic scale, glass surfaces, an animation library (fade/scale/Ken-Burns/shimmer/pulse), focus rings, and reduced-motion support. All **artwork is generative SVG** ([`lib/art.tsx`](lib/art.tsx)) — posters, hero banners, per-episode thumbnails, category tiles, and cast avatars are drawn from one cohesive system, so there are **no binary image dependencies**.

---

## 🛠 Tech stack

- **Next.js 16** (App Router, Turbopack, async request APIs) · **React 19**
- **TypeScript** (strict) · **Tailwind CSS v4** (CSS-based theme)
- **lucide-react** icons
- **Client-side state** ([`lib/store.tsx`](lib/store.tsx)) — auth, profiles, favorites, and watch progress persisted to `localStorage`, namespaced per profile. The shape is backend-agnostic: swapping in a real API means changing the action bodies only, not the components.

> The repo previously shipped a Prisma/Postgres service; the Lumen app is intentionally **decoupled** from it so it builds and runs hermetically with zero configuration.

## 🚀 Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build / serve:

```bash
npm run build
npm run start
```

## ☁️ Deploy (Vercel)

Push the branch to GitHub → **Import** the repo on [Vercel](https://vercel.com/new) → deploy. No environment variables or database are required.

---

## 📁 Project structure

```
app/
  page.tsx                 # landing page
  (app)/                   # app shell (top nav + bottom tab bar)
    home/ browse/ search/
    my-list/ history/ profiles/
    series/[slug]/         # series detail
  watch/[slug]/[ep]/       # full-screen player route
  layout.tsx               # fonts, metadata, <LumenProvider>
  globals.css              # design system
components/                # Hero, Rail, PosterCard, Player, Navigation, …
content/                   # types + the 4 series + catalog helpers
lib/                       # store (state), art (generative SVG), format
```

## 🎥 The real-video seam

The player streams a real clip the moment one exists. Each `Episode` accepts an optional `videoUrl` (and `poster`) in [`content/types.ts`](content/types.ts):

- **No `videoUrl`** → the **motion-screenplay** engine performs the script (the default today).
- **`videoUrl` set** → the player streams native video with **resume** and **autoplay-next** preserved.

This makes the platform production-ready for dropping in rendered clips (from an AI video pipeline or a real shoot) without touching the rest of the app.

## 🗺 Roadmap

- Real rendered episodes via an AI video + voice + score pipeline.
- Server-backed accounts and cross-device sync.
- Watch-time analytics and personalized recommendations.
- Offline downloads (PWA) and share-to-social clips.

---

*Lumen is an original concept and demo. All series, characters, and artwork are fictional.*
