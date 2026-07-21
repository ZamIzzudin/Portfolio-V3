# Detto — A Small Space for Your Story, Together

> A private, mobile-first PWA for couples to plan dates, keep memories, leave love notes, and grow together — designed and built by **NotuTeam**.

---

## TL;DR

| | |
|---|---|
| **Role**           | Full-stack engineer & product designer |
| **Timeline**       | Jun 2026 – Present (ongoing) |
| **Type**           | Personal project, shipped as installable PWA |
| **Stack**          | Next.js 16 (App Router), React 19, TypeScript, Prisma 6, PostgreSQL (prod) / SQLite (dev), TailwindCSS 4, Framer Motion |
| **Auth**           | better-auth + argon2 password hashing |
| **Media**          | Cloudinary uploads |
| **PWA**            | next-pwa, service worker, web-push notifications, install prompt |
| **State**          | Zustand (user session) + TanStack React Query |
| **Live preview**   | Try the interactive widgets below |

---

## 1. The Problem

Couples share a lot — photos from dates, anniversaries, inside jokes, things they want to do "one day" — but they end up scattered across WhatsApp, Google Calendar, Instagram DMs, and a notes app. The digital footprint of a relationship is fragmented and impersonal.

Existing apps either:

- Focus on one thing (only a shared calendar, only a love letter app), or
- Feel like a productivity tool, not something warm.

## 2. The Concept

**Detto** (from the Italian *detto*, "said") is a quiet, intimate space built around two people. Not a productivity app. Not a social network. A small, beautiful room only you and your partner can enter.

The product thesis:

> *If the place where a couple keeps their memories feels warm, personal, and private — they'll use it every day. Daily use turns into a long-term archive of the relationship.*

## 3. Key Features (Production)

This is the actual feature set shipped in the codebase:

### 3.1 Relationship-as-a-Room
- Two-person `Relationship` model with a verified invitation flow (short code + token, expiry, revocation).
- Once both partners join, the room unlocks calendar, memories, wishlist, notes — all scoped to that relationship.

### 3.2 Calendar & Events
- Monthly grid with dot indicators per day.
- 13 event categories (Date, Restaurant, Cafe, Movie, Travel, Shopping, Anniversary, Birthday, Holiday, Family, Concert, Workout, Playtime).
- Auto-status system (`UPCOMING` / `TODAY` / `PAST`) computed from date — no manual sync.
- Events can be linked from a wishlist item ("schedule this wish as an event").
- Event detail sheet: rating, comments, photo gallery per event.

### 3.3 Love Notes (Ephemeral)
- Short notes with optional image, **expiring** after a configurable time.
- Swipeable card stack (Framer Motion drag) — swipe left = next, swipe right = prev.
- Owner can hide or delete; partner sees until expiry.
- This is the most "intimate" surface — designed to feel handwritten, not archived.

### 3.4 Wishlist (Bucket List)
- Couples create shared wishes with images, links, and categories.
- Toggle favourite ("pin"), toggle done.
- Any wish can be **scheduled as an event** — a small bridge between dreaming and planning.

### 3.5 Memories Gallery
- Cloudinary-backed photo grid grouped by event.
- Each photo links back to the event it belongs to — a memory is never orphaned.

### 3.6 Timeline
- Reverse-chronological feed of past events with relative dates ("3 days ago", "Yesterday", "Today").
- Auto-status badge and category iconography.

### 3.7 PWA & Notifications
- Installable on iOS/Android via manifest + service worker.
- Web Push notifications scheduled for events (cron-driven via `/api/cron`).
- Timezone-aware scheduling (defaults `Asia/Jakarta`).

### 3.8 Profile & Relationship Settings
- Avatar (Cloudinary), display name, birthday.
- Birthday auto-generates a recurring event on the relationship calendar.

## 4. Design System

A custom token system ("Nokta tokens") drives both light and dark themes from CSS variables — no Tailwind color classes needed in components.

```
Brand       coral       #fe6b5e (accent, CTAs, dots)
Surface     fog         #EDEAE2 (page), #FFFFFF (card)
Inverse     brand-dark  #1F2B27 (dark UI blocks)
Sage        brand-sage  #465955 (secondary accents)
Amber       warning     #E8B84B
Success     green       #4B8B6B

Radius      sm 8 · md 14 · lg 22 · full 999
Shadow      sm · md · phone (heavy elevation for modal sheets)
Motion      spring cubic-bezier(0.34, 1.56, 0.64, 1)
Font        Nunito (300–900)
```

Three principles applied throughout:

1. **Mobile-only canvas** — every screen is designed as if on a phone, even in the browser. Max content width is constrained.
2. **Soft pressables** — every interactive element has `active:scale-[0.97]` and a spring transition. Buttons feel squeezable.
3. **Calm motion** — Framer Motion with spring damping 25, stiffness 300. Never bouncy enough to feel cartoonish.

## 5. Technical Architecture

```
src/
├── app/
│   ├── (auth)/            ← login, register, onboarding, invite
│   ├── (workspace)/       ← home, calendar, memories, timeline,
│   │                        relation, wishlist, profile, notifications
│   ├── api/cron/          ← scheduled push notification sender
│   └── invite/            ← partner invitation landing page
├── components/            ← shared UI (Button, Card, BottomSheet…)
│   ├── ui/                ← primitives
│   ├── feedback/          ← EmptyState, toasts
│   ├── display/           ← layout helpers
│   └── layout/            ← AppShell (bottom tab navigation)
├── features/              ← vertical slices per domain
│   ├── auth/  events/  gallery/  home/  media/
│   ├── notes/  notifications/  profile/  relationship/
│   ├── timeline/  wishlist/
├── lib/                   ← prisma client, auth, cloudinary, push,
│   │                        auto-events, auto-status, timezone
├── stores/                ← Zustand user/session store
├── providers/             ← React Query + theme providers
└── middleware.ts          ← route protection (auth + relationship)
```

**Each feature slice** is self-contained: `actions/` (server actions), `components/`, `schemas/` (Zod). This keeps the blast radius of any change small and makes the code easy to navigate.

### 5.1 Data Model Highlights

- **`Relationship`** is the root for almost everything — events, notes, wishlist, gallery all FK back to it.
- **`Event`** is the central entity: it has ratings, comments, media, and can be linked to a `WishlistItem`.
- **`Note`** has `expiresAt` and `isHidden` — the only "soft" entity.
- **`Session`** stores relationship context so a user with multiple relationships can switch between rooms.
- **`PushSubscription`** and **`Invitation`** are the two external-world entities (Web Push endpoints, shareable tokens).

### 5.2 Server Actions + Zod Validation

Every mutation goes through a server action that:

1. Validates input with a Zod schema.
2. Authenticates the session.
3. Verifies relationship membership (you can't write to someone else's relationship).
4. Performs the Prisma write.
5. Optionally writes an `ActivityLog` entry for audit.

This pattern is repeated consistently across all 10 feature slices.

### 5.3 Auto-Event & Auto-Status Systems

Two of the more interesting pieces of business logic:

- **`auto-events.ts`** — generates recurring events (birthdays, anniversaries) on the fly based on the `User.birthDate` and `Relationship.startedAt`. No recurring rows in the DB; they are projected when fetched.
- **`auto-status.ts`** — computes `UPCOMING` / `TODAY` / `PAST` from the event date at read time, so the UI never has stale badges.

### 5.4 Invitation Flow

The most non-trivial UX in the app:

1. Partner A signs up → a `Relationship` is created in `WAITING_PARTNER` status.
2. A short code + secure token is generated (5-char human-readable code + UUID token).
3. Partner A shares the link (e.g. `/invite/ABC12`).
4. Partner B registers via the link → relationship transitions to `ACTIVE`, both users linked.
5. Token expires after a TTL; revocable by Partner A.

## 6. Engineering Decisions Worth Calling Out

| Decision | Why |
|---|---|
| **Prisma + Postgres (prod) / SQLite (dev)** | One schema, two datasources via `schema.postgres.prisma` and `schema.sqlite.prisma`. Local dev is instant, prod is scalable. |
| **better-auth over NextAuth** | Better-auth gave finer control over the session→relationship binding without fighting the framework. |
| **Server Actions over API routes** | Mutations are tightly scoped, type-safe end-to-end, and skip the boilerplate of an API route + fetch hook. |
| **CSS variables over Tailwind theme** | Theme switching (light/dark) flips a single `data-theme` attribute. No recompile. Tokens documented in `globals.css`. |
| **Web Push over FCM** | No vendor lock-in, works on iOS 16.4+ via PWA install, simpler server-side. |
| **Framer Motion `AnimatePresence`** | Used everywhere — bottom sheets, swipeable stacks, list reordering. The swipe interactions in love notes would be painful without it. |
| **next-pwa** | Caching, install prompt, and offline shell come essentially for free. |

## 7. What I Learned

- **Designing for two users is harder than designing for one.** Every screen has to consider "whose data is this?" and "can the other person edit it?". The ownership matrix in wishlist (creator-only edit/delete, anyone can favourite/check) came out of real friction during testing.
- **Ephemeral content (love notes) is a feature, not a bug.** Forcing expiry made the channel feel different from chat. It changed how my partner and I used it.
- **Push notifications need a cron, not just a write.** Scheduling a notification at write-time is easy; making it actually fire at 9 AM in the right timezone on the right day requires a cron job that re-evaluates state.

## 8. What's Next

- Shared photo albums (multi-upload batch with captions).
- "On this day" feed — surfaced from past events.
- Optional location sharing during an active date.
- Public read-only "story page" couples can share with family.

## 9. Try the Interactive Demos

The widgets below are **standalone reproductions** of three core flows from Detto. All state is held in-memory (and `localStorage` where noted) — no backend needed.

1. **Interactive Calendar** — pick a day, add an event, watch the dot indicator appear.
2. **Love Note Stack** — swipe through notes, add your own, delete one.
3. **Wishlist Board** — add wishes, toggle favourite, mark as done, schedule as event.

These are the same patterns shipped in production, minus the network calls.

---

*Built by NotuTeam · 2026*
