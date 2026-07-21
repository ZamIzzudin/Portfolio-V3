# Example Project Showcase — How to Write a Portfolio Case Study

This document is a **template and example** for writing compelling project showcases in a portfolio. It uses Detto as a concrete example, but you can adapt this structure to any project.

---

## Why This Structure Works

A good portfolio case study balances three goals:

1. **Quick scannability** — recruiters skim, so surface the important stuff fast
2. **Depth on the hard parts** — show you can think through tradeoffs
3. **Personality** — let your voice come through, not just bullet points

The structure below is battle-tested: it's what I used for Detto, and it's what I've seen work consistently for engineers getting offers.

---

## Template: The TL;DR Section

Start with a summary table. This is the first thing recruiters read. It should take <10 seconds to scan.

| | |
|---|---|
| **Role**           | Full-stack engineer & product designer |
| **Timeline**       | Jun 2026 – Present (ongoing) |
| **Type**           | Personal project, shipped as installable PWA |
| **Stack**          | Next.js 16, React 19, TypeScript, Prisma 6, PostgreSQL/SQLite, TailwindCSS 4, Framer Motion |
| **Auth**           | better-auth + argon2 password hashing |
| **Media**          | Cloudinary uploads |
| **PWA**            | next-pwa, service worker, web-push notifications, install prompt |
| **State**          | Zustand + TanStack React Query |
| **Live preview**   | Try the interactive widgets below |

**Why this works:**
- One glance tells them: what, when, tech stack, and where to try it
- No fluff — just facts recruiters care about

---

## Template: The Problem Statement

1–2 paragraphs. Don't ramble. Be specific about the pain point you observed.

### Example (Detto)

Couples share a lot — photos from dates, anniversaries, inside jokes, things they want to do "one day" — but they end up scattered across WhatsApp, Google Calendar, Instagram DMs, and a notes app. The digital footprint of a relationship is fragmented and impersonal.

Existing apps either:
- Focus on one thing (only a shared calendar, only a love letter app), or
- Feel like a productivity tool, not something warm.

### Your Turn

**[Project Name]** solves [specific problem] because [why it matters].

**Before I started:** [what the landscape looked like]

**The gap I saw:** [what was missing]

---

## Template: The Concept (Your Product Thesis)

1 paragraph. This is where you show product thinking.

### Example (Detto)

Detto (from the Italian *detto*, "said") is a quiet, intimate space built around two people. Not a productivity app. Not a social network. A small, beautiful room only you and your partner can enter.

The product thesis: If the place where a couple keeps their memories feels warm, personal, and private — they'll use it every day. Daily use turns into a long-term archive of the relationship.

### Your Turn

**[Project Name]** is a [one-sentence pitch].

**The core idea:** [your hypothesis about why this will work]

**What makes it different:** [why it's not just [competitor] clone]

---

## Template: Key Features (What Actually Got Shipped)

Don't list every single feature. Group them by what they enable for the user.

### Example (Detto)

#### 3.1 Relationship-as-a-Room
- Two-person `Relationship` model with a verified invitation flow (short code + token, expiry, revocation).
- Once both partners join, the room unlocks calendar, memories, wishlist, notes — all scoped to that relationship.

#### 3.2 Calendar & Events
- Monthly grid with dot indicators per day.
- 13 event categories (Date, Restaurant, Cafe, Movie, Travel, Shopping, Anniversary, Birthday, Holiday, Family, Concert, Workout, Playtime).
- Auto-status system (`UPCOMING` / `TODAY` / `PAST`) computed from date — no manual sync.

#### 3.3 Love Notes (Ephemeral)
- Short notes with optional image, **expiring** after a configurable time.
- Swipeable card stack (Framer Motion drag) — swipe left = next, swipe right = prev.
- This is the most "intimate" surface — designed to feel handwritten, not archived.

### Your Turn

**[Feature Area 1]** (e.g., Authentication)
- [feature bullet 1]
- [feature bullet 2]
- [why this matters: e.g., frictionless sign-up without passwords]

**[Feature Area 2]** (e.g., Real-time collaboration)
- [feature bullet 1]
- [feature bullet 2]
- [how this changes the UX: e.g., users see updates instantly]

**[Feature Area 3]** (e.g., Data visualization)
- [feature bullet 1]
- [feature bullet 2]
- [what this enables: e.g., non-technical users can understand patterns]

---

## Template: Design System

This shows you have taste and can work with designers. Keep it concrete — actual color codes, not vague descriptions.

### Example (Detto)

A custom token system ("Nokta tokens") drives both light and dark themes from CSS variables — no Tailwind color classes needed in components.

```
Brand       coral       #fe6b5e (accent, CTAs, dots)
Surface     fog         #EDEAE2 (page), #FFFFFF (card)
Inverse     brand-dark  #1F2B27 (dark UI blocks)
Sage        brand-sage  #465955 (secondary accents)

Radius      sm 8 · md 14 · lg 22 · full 999
Shadow      sm · md · phone (heavy elevation for modal sheets)
Motion      spring cubic-bezier(0.34, 1.56, 0.64, 1)
Font        Nunito (300–900)
```

Three principles applied throughout:

1. **Mobile-only canvas** — every screen is designed as if on a phone, even in the browser. Max content width is constrained.
2. **Soft pressables** — every interactive element has `active:scale-[0.97]` and a spring transition. Buttons feel squeezable.
3. **Calm motion** — Framer Motion with spring damping 25, stiffness 300. Never bouncy enough to feel cartoonish.

### Your Turn

**[Design System Name or Philosophy]**

**Color palette:**
```
Primary     [hex] — used for [what]
Secondary   [hex] — used for [what]
Accent      [hex] — used for [what]
```

**Typography:**
- Display: [font] — used for [what]
- Body: [font] — used for [what]

**Principles:**
1. [principle 1] — [how it manifests in the UI]
2. [principle 2] — [how it manifests in the UI]
3. [principle 3] — [how it manifests in the UI]

---

## Template: Technical Architecture

This is where you show you can build systems, not just pages. Don't over-explain — assume a senior engineer is reading.

### Example (Detto)

```
src/
├── app/
│   ├── (auth)/            ← login, register, onboarding, invite
│   ├── (workspace)/       ← home, calendar, memories, timeline,
│   │                        relation, wishlist, profile, notifications
│   ├── api/cron/          ← scheduled push notification sender
│   └── invite/            ← partner invitation landing page
├── components/            ← shared UI (Button, Card, BottomSheet…)
├── features/              ← vertical slices per domain
│   ├── auth/  events/  gallery/  home/  media/
│   ├── notes/  notifications/  profile/  relationship/
│   ├── timeline/  wishlist/
├── lib/                   ← prisma client, auth, cloudinary, push
├── stores/                ← Zustand user/session store
├── providers/             ← React Query + theme providers
└── middleware.ts          ← route protection (auth + relationship)
```

Each feature slice is self-contained: `actions/` (server actions), `components/`, `schemas/` (Zod). This keeps the blast radius of any change small and makes the code easy to navigate.

### Your Turn

**High-level architecture:**
```
[diagram or tree structure]
```

**Key architectural decisions:**
- [decision 1] — [why it matters]
- [decision 2] — [why it matters]
- [decision 3] — [why it matters]

**Data model highlights:** (if relevant)
- [entity 1] — [what it represents]
- [entity 2] — [how it relates to entity 1]

---

## Template: Engineering Decisions Worth Calling Out

This is the most important section. It shows you can make tradeoffs.

### Example (Detto)

| Decision | Why |
|---|---|
| **Prisma + Postgres (prod) / SQLite (dev)** | One schema, two datasources via `schema.postgres.prisma` and `schema.sqlite.prisma`. Local dev is instant, prod is scalable. |
| **better-auth over NextAuth** | Better-auth gave finer control over the session→relationship binding without fighting the framework. |
| **Server Actions over API routes** | Mutations are tightly scoped, type-safe end-to-end, and skip the boilerplate of an API route + fetch hook. |
| **CSS variables over Tailwind theme** | Theme switching (light/dark) flips a single `data-theme` attribute. No recompile. Tokens documented in `globals.css`. |

### Your Turn

| Decision | Why I Made It |
|---|---|
| **[decision 1]** | [reason] |
| **[decision 2]** | [reason] |
| **[decision 3]** | [reason] |

**Bonus points if you can mention:**
- What you considered instead
- What you learned from making this choice
- How you'd do it differently next time

---

## Template: What I Learned

1–3 paragraphs. Show you're reflective.

### Example (Detto)

Designing for two users is harder than designing for one. Every screen has to consider "whose data is this?" and "can the other person edit it?". The ownership matrix in wishlist (creator-only edit/delete, anyone can favourite/check) came out of real friction during testing.

Ephemeral content (love notes) is a feature, not a bug. Forcing expiry made the channel feel different from chat. It changed how my partner and I used it.

Push notifications need a cron, not just a write. Scheduling a notification at write-time is easy; making it actually fire at 9 AM in the right timezone on the right day requires a cron job that re-evaluates state.

### Your Turn

**What surprised me:** [what you didn't expect]

**What I'd do differently:** [what you'd change]

**A moment that taught me something:** [a specific story]

---

## Template: What's Next

1 paragraph. Shows you think iteratively.

### Example (Detto)

Shared photo albums (multi-upload batch with captions). "On this day" feed surfaced from past events. Optional location sharing during an active date. Public read-only "story page" couples can share with family.

### Your Turn

**Next features I'm considering:** [what's on the roadmap]

**Open questions:** [what I'm still figuring out]

**Where I'd like help:** [if you're looking for collaboration]

---

## Template: Try the Interactive Demos

If you have widgets, this is where they go. It makes the showcase tangible.

### Example (Detto)

The widgets below are **standalone reproductions** of three core flows from Detto. All state is held in-memory (and `localStorage` where noted) — no backend needed.

1. **Interactive Calendar** — pick a day, add an event, watch the dot indicator appear.
2. **Love Note Stack** — swipe through notes, add your own, delete one.
3. **Wishlist Board** — add wishes, toggle favourite, mark as done, schedule as event.
4. **Notification Timeline** — time-travel with a slider, see popups when dates are reached.

These are the same patterns shipped in production, minus the network calls.

### Your Turn

**Try it yourself:** [link to live demo or instructions]

**Key interactions to try:**
1. [interaction 1] — [what it shows]
2. [interaction 2] — [what it shows]
3. [interaction 3] — [what it shows]

---

## How to Adapt This Template

### For a different project:

1. **Keep the structure** — TL;DR table, Problem, Concept, Features, Architecture, Decisions, Learned, Next, Demos
2. **Adapt the sections** — not every project needs a design system section; not every project has interactive demos
3. **Be specific** — don't say "I built a REST API," say "I built a REST API with rate limiting, JWT auth, and a GraphQL gateway for legacy clients"
4. **Use numbers** — "reduced load time by 40%" is better than "made it faster"
5. **Show, don't just tell** — widgets, diagrams, screenshots, code snippets

### For a shorter showcase (LinkedIn, quick-read):

- Keep the TL;DR table
- Combine Problem + Concept into 2 paragraphs
- Collapse Features into 3 bullet points
- Skip the architecture diagram
- List 3 decisions in a table
- End with 1 paragraph on What I Learned

### For a longer showcase (case study):

- Add a "Background" section (what you did before this project)
- Add a "Challenges" section (what went wrong and how you fixed it)
- Add a "Metrics" section (if you have numbers)
- Add a "Lessons Applied to Future Projects" section

---

## Final Tips

1. **Write it for a senior engineer** — they're the ones making hiring decisions
2. **Show your process, not just the outcome** — decisions and learning > feature lists
3. **Be honest about tradeoffs** — every project has them; acknowledging them shows maturity
4. **Use your voice** — a case study that sounds like ChatGPT wrote it doesn't stand out
5. **Keep it scannable** — lots of headings, short paragraphs, tables where they help

---

## Example: Full Detto Case Study

The actual case study I wrote for Detto is in `CASE_STUDY.md`. Use it as a reference for how to fill in this template with real content.

---

*Template created for Detto portfolio showcase. Adapt freely for your own projects.*
