"use client";

/**
 * Detto — Notification Timeline (Portfolio Showcase)
 * ================================================
 * Standalone reproduction of Detto's push notification system with a time slider.
 *
 * Dependencies (install in your portfolio):
 *   npm install framer-motion lucide-react
 *
 * Theme: drop the contents of portfolio/styles.css into your
 *        global CSS (or import it once at portfolio root).
 *
 * The widget lets you "time travel" with a slider. When the slider hits a
 * date with a scheduled notification, a popup appears simulating a real
 * push notification. This demonstrates the cron-based notification system
 * in Detto.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, ChevronRight, Calendar as CalendarIcon, Heart, Cake, Gift,
  Trash2, X, Play, Pause, RotateCcw, Sparkles, UtensilsCrossed,
  Coffee, Clapperboard, Plane, ShoppingBag, type LucideIcon,
} from "lucide-react";

/* --------------------------------------------------------- *
 * Types & config
 * --------------------------------------------------------- */

interface DemoNotification {
  id: string;
  title: string;
  message: string;
  category: Category;
  scheduledFor: string; // ISO yyyy-mm-dd
  scheduledTime: string; // HH:MM
  type: "EVENT" | "BIRTHDAY" | "ANNIVERSARY" | "REMINDER";
  icon?: LucideIcon;
}

type Category =
  | "DATE" | "RESTAURANT" | "CAFE" | "MOVIE" | "TRAVEL" | "SHOPPING"
  | "ANNIVERSARY" | "BIRTHDAY" | "HOLIDAY" | "OTHER";

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  DATE: CalendarIcon,
  RESTAURANT: UtensilsCrossed,
  CAFE: Coffee,
  MOVIE: Clapperboard,
  TRAVEL: Plane,
  SHOPPING: ShoppingBag,
  ANNIVERSARY: Heart,
  BIRTHDAY: Cake,
  HOLIDAY: Gift,
  OTHER: Bell,
};

/* --------------------------------------------------------- *
 * Seed data — realistic notification schedule
 * --------------------------------------------------------- */

const SEED_NOTIFICATIONS = (): DemoNotification[] => {
  const now = new Date();
  const addDays = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  };

  return [
    {
      id: "n1",
      title: "Dinner tonight!",
      message: "Remember, we're trying the new ramen spot at 7 PM. Don't forget! 🍜",
      category: "RESTAURANT",
      scheduledFor: now.toISOString().slice(0, 10),
      scheduledTime: "19:00",
      type: "EVENT",
    },
    {
      id: "n2",
      title: "Happy Birthday! 🎉",
      message: "6 months together and counting. Here's to many more! Love you ❤",
      category: "ANNIVERSARY",
      scheduledFor: addDays(3).toISOString().slice(0, 10),
      scheduledTime: "09:00",
      type: "ANNIVERSARY",
    },
    {
      id: "n3",
      title: "Don't miss your flight ✈",
      message: "Your Bali trip starts tomorrow. Check in now if you haven't!",
      category: "TRAVEL",
      scheduledFor: addDays(1).toISOString().slice(0, 10),
      scheduledTime: "20:00",
      type: "REMINDER",
    },
    {
      id: "n4",
      title: "Movie night reminder 🎬",
      message: "Studio Ghibli marathon starts at 8 PM. Popcorn is ready!",
      category: "MOVIE",
      scheduledFor: addDays(5).toISOString().slice(0, 10),
      scheduledTime: "19:30",
      type: "EVENT",
    },
    {
      id: "n5",
      title: "Coffee date ☕",
      message: "Sunday morning coffee before brunch? 10 AM at our usual spot.",
      category: "CAFE",
      scheduledFor: addDays(7).toISOString().slice(0, 10),
      scheduledTime: "10:00",
      type: "EVENT",
    },
  ];
};

const STORAGE_KEY = "detto-demo-notifications";

/* --------------------------------------------------------- *
 * Widget
 * --------------------------------------------------------- */

export default function NotificationTimeline() {
  const [notifications, setNotifications] = useState<DemoNotification[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  /* Load from localStorage (or seed) */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DemoNotification[] = JSON.parse(stored);
        setNotifications(parsed.length ? parsed : SEED_NOTIFICATIONS());
        return;
      }
    } catch { /* ignore */ }
    const seed = SEED_NOTIFICATIONS();
    setNotifications(seed);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch { /* ignore */ }
  }, []);

  /* Persist when notifications change */
  useEffect(() => {
    if (notifications.length === 0) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications)); } catch { /* ignore */ }
  }, [notifications]);

  /* Auto-play simulation */
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() + 1);
        return next;
      });
    }, 800); // Advance 1 day every 800ms
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* Find notifications for current day */
  const todaysNotifications = useMemo(() => {
    const dateStr = currentDate.toISOString().slice(0, 10);
    return notifications.filter((n) => n.scheduledFor === dateStr && !dismissedIds.has(n.id));
  }, [notifications, currentDate, dismissedIds]);

  /* Has unseen notification for current day? */
  const hasUnseen = todaysNotifications.length > 0;

  /* Actions */
  const resetTime = useCallback(() => {
    setCurrentDate(new Date());
    setIsPlaying(false);
  }, []);

  const dismiss = useCallback((id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  }, []);

  return (
    <div className="detto-widget" aria-label="Detto — Notification Timeline">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          Detto · Notifications
        </p>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4, fontFamily: "var(--font-display)" }}>
          Time travel to see notifications
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
          Use the slider to travel through days. When you hit a scheduled date, a popup appears just like a real push notification.
        </p>
      </div>

      {/* Current date display */}
      <div style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--accent-soft)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CalendarIcon size={20} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
              Current Day
            </p>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {currentDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Playback controls */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={resetTime}
            className="detto-pressable"
            aria-label="Reset to today"
            style={{ ...controlBtnStyle, color: "var(--text-secondary)" }}
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="detto-pressable"
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              ...controlBtnStyle,
              background: isPlaying ? "var(--accent)" : "var(--surface-alt)",
              color: isPlaying ? "var(--text-on-accent)" : "var(--text-primary)",
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {/* Time slider */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 10,
        }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Timeline Slider
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
            Slide to travel through dates
          </span>
        </div>

        {/* Custom range slider */}
        <div style={{ position: "relative", padding: "10px 0" }}>
          {/* Track */}
          <div style={{
            height: 6, borderRadius: "var(--radius-full)",
            background: "var(--border-subtle)",
            position: "relative",
          }}>
            {/* Fill */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: "50%", background: "var(--accent)",
              borderRadius: "var(--radius-full)",
            }} />
          </div>

          {/* Notification dots on timeline */}
          {notifications.map((n, i) => {
            const date = new Date(n.scheduledFor + "T00:00:00");
            const diffDays = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const position = 50 + (diffDays * 2); // 2% per day, centered at 50%
            return (
              <div
                key={n.id}
                style={{
                  position: "absolute", left: `${position}%`,
                  top: "50%", transform: "translate(-50%, -50%)",
                  width: dismissedIds.has(n.id) ? 6 : 10, height: dismissedIds.has(n.id) ? 6 : 10,
                  borderRadius: "50%",
                  background: dismissedIds.has(n.id) ? "var(--border-subtle)" : "var(--accent)",
                  boxShadow: dismissedIds.has(n.id) ? "none" : "0 0 0 4px var(--accent-soft)",
                  transition: "all 200ms",
                }}
              />
            );
          })}

          {/* Thumb (visual only) */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 24, height: 24, borderRadius: "50%",
            background: "var(--surface-inverse)",
            border: "3px solid var(--accent)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            cursor: "pointer",
            zIndex: 1,
          }} />

          {/* Hidden range input for actual interaction */}
          <input
            type="range"
            min={-10}
            max={20}
            value={Math.round((currentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            onChange={(e) => {
              const days = Number(e.target.value);
              const newDate = new Date();
              newDate.setDate(newDate.getDate() + days);
              setCurrentDate(newDate);
            }}
            style={{
              position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
              opacity: 0, cursor: "pointer", zIndex: 2, margin: 0,
            }}
            aria-label="Select date"
          />
        </div>

        {/* Day labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>10 days ago</span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700 }}>Today</span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>+20 days</span>
        </div>
      </div>

      {/* Notification indicator */}
      {hasUnseen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "var(--accent-soft)",
            borderRadius: "var(--radius-md)",
            padding: 12,
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 20,
          }}
        >
          <Bell size={18} style={{ color: "var(--accent)" }} />
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {todaysNotifications.length} notification{todaysNotifications.length > 1 ? "s" : ""} for today!
          </p>
        </motion.div>
      )}

      {/* Upcoming notifications list */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
          Upcoming
        </h4>
        {notifications
          .filter((n) => new Date(n.scheduledFor + "T00:00:00") >= currentDate && !dismissedIds.has(n.id))
          .slice(0, 4)
          .map((n) => {
            const Icon = CATEGORY_ICON[n.category as Category] || Bell;
            return (
              <div
                key={n.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: 10, borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  marginBottom: 6,
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "var(--surface-alt)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} style={{ color: "var(--text-secondary)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {n.title}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                    {new Date(n.scheduledFor + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short" })} at {n.scheduledTime}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Notification popup (stack) */}
      <AnimatePresence>
        {hasUnseen && todaysNotifications.slice(0, 1).map((n) => (
          <NotificationPopup
            key={n.id}
            notification={n}
            onDismiss={() => dismiss(n.id)}
            onOpenDetail={() => dismiss(n.id)} /* Demo: dismiss = close */
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------------------------------- *
 * Notification popup component
 * --------------------------------------------------------- */

function NotificationPopup({
  notification, onDismiss, onOpenDetail,
}: {
  notification: DemoNotification;
  onDismiss: () => void;
  onOpenDetail: () => void;
}) {
  const Icon = CATEGORY_ICON[notification.category as Category] || Bell;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        width: 320,
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
        boxShadow: "var(--shadow-phone)",
        border: "1px solid var(--border-subtle)",
        zIndex: 1000,
      }}
    >
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}>
          <Bell size={12} style={{ color: "var(--accent)" }} />
          Detto Notification
        </div>
        <div style={{
          fontSize: "0.65rem", color: "var(--text-secondary)",
          padding: "2px 6px", borderRadius: "var(--radius-sm)",
          background: "var(--surface-alt)",
        }}>
          now
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "var(--accent-soft)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon size={20} style={{ color: "var(--accent)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)",
            marginBottom: 4, lineHeight: 1.3,
          }}>
            {notification.title}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
            {notification.message}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 12, paddingTop: 10,
        borderTop: "1px solid var(--border-subtle)",
      }}>
        <button
          onClick={onDismiss}
          className="detto-pressable"
          style={{
            background: "transparent", border: "none",
            color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600,
            cursor: "pointer", padding: "4px 8px",
          }}
        >
          Dismiss
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onOpenDetail}
            className="detto-pressable"
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "var(--accent)", color: "var(--text-on-accent)",
              border: "none", borderRadius: "var(--radius-full)",
              padding: "6px 12px", fontSize: "0.75rem", fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const controlBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  border: "1.5px solid var(--border-subtle)",
  background: "var(--surface-alt)",
  cursor: "pointer",
};
