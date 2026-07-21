/**
 * Detto — Interactive Demo Page
 * =================================
 * Standalone demo page that renders all 3 widgets.
 *
 * To run:
 *   1. Make sure dependencies are installed:
 *      npm install framer-motion lucide-react clsx tailwind-merge
 *   2. Copy the contents of styles.css to your global CSS, OR import it.
 *   3. Include this component in your portfolio page.
 */

import InteractiveCalendar from "./components/InteractiveCalendar";
import LoveNoteStack from "./components/LoveNoteStack";
import WishlistBoard from "./components/WishlistBoard";
import NotificationTimeline from "./components/NotificationTimeline";

export default function DettoDemo() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg-page)",
      padding: "40px 20px",
      fontFamily: "var(--font-body)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            marginBottom: 12,
          }}>
            Detto — Interactive Demos
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Four standalone widgets from Detto, reproduced for portfolio showcase. All state is held locally (localStorage) — no backend required.
          </p>
        </header>

        {/* Widgets grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: 32,
          alignItems: "start",
        }}>
          {/* 1. Interactive Calendar */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                1. Calendar & Events
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Pick a date, add an event, watch the dot indicator appear.
              </p>
            </div>
            <InteractiveCalendar />
          </div>

          {/* 2. Love Note Stack */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                2. Love Notes
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Swipe to read, add your own, notes expire automatically.
              </p>
            </div>
            <LoveNoteStack defaultTtlMinutes={10} />
          </div>

          {/* 3. Wishlist Board */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                3. Wishlist (Bucket List)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Pin favourites, mark done, schedule as event.
              </p>
            </div>
            <WishlistBoard defaultAuthor="You" />
          </div>

          {/* 4. Notification Timeline */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                4. Push Notifications
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Time-travel with a slider, see popups when dates are reached.
              </p>
            </div>
            <NotificationTimeline />
          </div>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: 64, textAlign: "center" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            These widgets are standalone reproductions. The actual Detto app is a full-stack PWA with Postgres, better-auth, Cloudinary, and Web Push notifications.
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 8 }}>
            Built by NotuTeam · 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
