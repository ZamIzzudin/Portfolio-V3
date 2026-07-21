# Quick Start — Embed Detto Widgets in Your Portfolio

## Prerequisite: Install Dependencies

The widgets require only 3 external packages. If your portfolio doesn't have them yet:

```bash
npm install framer-motion lucide-react clsx
```

All of these are already installed in Detto's main project, so you can skip this step if you're embedding within the Detto codebase.

## Step 1: Add the Theme CSS

Copy the contents of `portfolio/styles.css` into your portfolio's global CSS file (e.g., `globals.css` or `app.css`).

The CSS variables define Detto's visual system (coral, sage, fog) and work with both light and dark themes.

## Step 2: Import and Use the Widgets

### Using All Three Together

```tsx
import InteractiveCalendar from "./components/InteractiveCalendar";
import LoveNoteStack from "./components/LoveNoteStack";
import WishlistBoard from "./components/WishlistBoard";
import NotificationTimeline from "./components/NotificationTimeline";

export default function DettoPage() {
  return (
    <main style={{ padding: "40px 20px" }}>
      <h1>Detto — Case Study</h1>
      <p>A private space for couples to share memories and grow together.</p>

      <div style={{ display: "grid", gap: 40 }}>
        <section>
          <h2>Calendar & Events</h2>
          <InteractiveCalendar />
        </section>

        <section>
          <h2>Love Notes</h2>
          <LoveNoteStack defaultTtlMinutes={10} />
        </section>

        <section>
          <h2>Wishlist (Bucket List)</h2>
          <WishlistBoard defaultAuthor="You" />
        </section>

        <section>
          <h2>Push Notifications</h2>
          <NotificationTimeline />
        </section>
      </div>
    </main>
  );
}
```

### Using Just One Widget

```tsx
import InteractiveCalendar from "./portfolio/components/InteractiveCalendar";

export default function Demo() {
  return (
    <div>
      <h1>My Calendar Demo</h1>
      <InteractiveCalendar />
    </div>
  );
}
```

## Widget Props

### InteractiveCalendar

No props required. All state is internal and persisted to `localStorage` automatically.

### LoveNoteStack

```tsx
<LoveNoteStack defaultTtlMinutes={10} />
```

- `defaultTtlMinutes?: number` (default: 10) — How long new notes last before expiring (in minutes).

### WishlistBoard

```tsx
<WishlistBoard defaultAuthor="You" />
```

- `defaultAuthor?: string` (default: "You") — The "created by" name for new wishes added in the demo.

## How State Works

All widgets use **React state + localStorage** for persistence:

- When you add an event/note/wish, it's saved to `localStorage` under a unique key
- When you refresh the page, your data loads back automatically
- No API calls required — fully client-side

The widgets are designed to work **standalone** in any portfolio website. They don't depend on Detto's server or database.

## Browser Compatibility

- Modern browsers with ES6 support
- Works on mobile (touch interactions) and desktop (mouse/trackpad)
- Framer Motion animations degrade gracefully on reduced-motion devices

## Troubleshooting

**Widget doesn't appear or looks broken**

- Make sure `portfolio/styles.css` is included
- Check browser console for missing imports
- Verify `framer-motion`, `lucide-react`, and `clsx` are installed

**Lost all data after refresh**

- Check if your browser blocks localStorage (e.g., private/incognito mode)
- Each widget has a separate `localStorage` key; clearing cookies/site data will wipe it

**Want to seed initial data**

- The widgets come with realistic seed data. If you want to reset it:
  - Open browser DevTools → Application → Local Storage
  - Delete keys starting with `detto-demo-`
  - Refresh the page to restore seed data

## Example: Full Portfolio Page

```tsx
import InteractiveCalendar from "./portfolio/components/InteractiveCalendar";
import LoveNoteStack from "./portfolio/components/LoveNoteStack";
import WishlistBoard from "./portfolio/components/WishlistBoard";

export default function DettoProjectPage() {
  return (
    <article style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Detto</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>
          A private PWA for couples to plan dates, keep memories, and grow together.
        </p>
      </header>

      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Try the Demo</h2>
        <p style={{ marginBottom: 24 }}>
          These three interactive widgets showcase core features of Detto.
          All state is local — try adding an event, swiping notes, or pinning a wishlist item.
        </p>

        <div style={{ display: "grid", gap: 48 }}>
          <InteractiveCalendar />
          <LoveNoteStack defaultTtlMinutes={10} />
          <WishlistBoard defaultAuthor="Portfolio Visitor" />
        </div>
      </section>
    </article>
  );
}
```

---

*Need help? Check `CASE_STUDY.md` for detailed project information.*
