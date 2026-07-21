"use client";

/**
 * Detto — Interactive Calendar (Portfolio Showcase)
 * ================================================
 * Standalone reproduction of Detto's Calendar + Events flow.
 *
 * Dependencies (install in your portfolio):
 *   npm install framer-motion lucide-react clsx
 *
 * Theme: drop the contents of portfolio/styles.css into your
 *        global CSS (or import it once at portfolio root).
 *
 * The widget keeps all state in React (no backend). Events
 * persist to localStorage so the demo "remembers" across refreshes.
 */

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MapPin,
  Calendar as CalendarIcon,
  UtensilsCrossed,
  Coffee,
  Clapperboard,
  Plane,
  ShoppingBag,
  Heart,
  Cake,
  Gift,
  Users,
  Pin,
  Music,
  Dumbbell,
  Gamepad2,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

/* --------------------------------------------------------- *
 * Types & static config
 * --------------------------------------------------------- */

interface DemoEvent {
  id: string;
  title: string;
  category: Category;
  date: string; // ISO yyyy-mm-dd
  location?: string;
}

type Category =
  | "DATE" | "RESTAURANT" | "CAFE" | "MOVIE" | "TRAVEL" | "SHOPPING"
  | "ANNIVERSARY" | "BIRTHDAY" | "HOLIDAY" | "FAMILY" | "CONCERT"
  | "WORKOUT" | "PLAYTIME" | "OTHER";

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
  FAMILY: Users,
  CONCERT: Music,
  WORKOUT: Dumbbell,
  PLAYTIME: Gamepad2,
  OTHER: Pin,
};

const CATEGORY_LABEL: Record<Category, string> = {
  DATE: "Date", RESTAURANT: "Restaurant", CAFE: "Cafe", MOVIE: "Movie",
  TRAVEL: "Travel", SHOPPING: "Shopping", ANNIVERSARY: "Anniversary",
  BIRTHDAY: "Birthday", HOLIDAY: "Holiday", FAMILY: "Family",
  CONCERT: "Concert", WORKOUT: "Workout", PLAYTIME: "Playtime", OTHER: "Other",
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABEL) as Category[];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const STORAGE_KEY = "detto-demo-calendar-events";

/* --------------------------------------------------------- *
 * Seed data — realistic couples scenario
 * --------------------------------------------------------- */

function seedEvents(): DemoEvent[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const addDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  };
  return [
    { id: "s1", title: "Movie night — Studio Ghibli", category: "MOVIE", date: iso(addDays(2)), location: "Home" },
    { id: "s2", title: "Dinner at Padang Merdeka", category: "RESTAURANT", date: iso(addDays(5)), location: "Senopati" },
    { id: "s3", title: "6 months together 🎉", category: "ANNIVERSARY", date: iso(addDays(14)) },
  ];
}

/* --------------------------------------------------------- *
 * Widget
 * --------------------------------------------------------- */

export default function InteractiveCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<DemoEvent | null>(null);

  /* Load from localStorage (or seed) on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEvents(JSON.parse(stored));
        return;
      }
    } catch { /* ignore */ }
    const seed = seedEvents();
    setEvents(seed);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch { /* ignore */ }
  }, []);

  /* Persist whenever events change */
  useEffect(() => {
    if (events.length === 0) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch { /* ignore */ }
  }, [events]);

  /* Derived: which days of this month have events */
  const eventDays = useMemo(() => {
    const map = new Map<number, DemoEvent[]>();
    for (const ev of events) {
      const d = new Date(ev.date + "T00:00:00");
      if (d.getMonth() === month && d.getFullYear() === year) {
        const arr = map.get(d.getDate()) ?? [];
        arr.push(ev);
        map.set(d.getDate(), arr);
      }
    }
    return map;
  }, [events, month, year]);

  /* Events on the selected day (or all events this month if none) */
  const visibleEvents = useMemo(() => {
    if (selectedDay) return eventDays.get(selectedDay) ?? [];
    return Array.from(eventDays.values()).flat().sort((a, b) => a.date.localeCompare(b.date));
  }, [eventDays, selectedDay]);

  /* Navigation */
  function prevMonth() {
    setSelectedDay(null);
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    setSelectedDay(null);
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  /* CRUD */
  function addEvent(ev: Omit<DemoEvent, "id">) {
    const newEv: DemoEvent = { ...ev, id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` };
    setEvents((prev) => [...prev, newEv]);
  }
  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDetailEvent(null);
  }

  /* Build calendar cell grid */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="detto-widget" aria-label="Detto — Interactive Calendar">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          Detto · Calendar
        </p>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4, fontFamily: "var(--font-display)" }}>
          Plan something together
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
          Pick a day, then tap <strong style={{ color: "var(--accent)" }}>+</strong> to add an event.
        </p>
      </div>

      {/* Calendar card */}
      <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: 16 }}>
        {/* Month header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={prevMonth} aria-label="Previous month" style={iconBtnStyle}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{monthName}</span>
          <button onClick={nextMonth} aria-label="Next month" style={iconBtnStyle}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8 }}>
          {DAY_LABELS.map((l) => (
            <div key={l} style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
              {l}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 4 }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const isSelected = day === selectedDay;
            const count = eventDays.get(day)?.length ?? 0;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className="detto-pressable"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 0",
                  borderRadius: "var(--radius-md)",
                  background: isSelected ? "var(--accent)" : "transparent",
                  color: isSelected
                    ? "var(--text-on-accent)"
                    : isToday
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  fontWeight: isSelected || isToday ? 800 : 500,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "0.85rem" }}>{day}</span>
                {count > 0 && (
                  <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                    {Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                      <span
                        key={j}
                        style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: isSelected ? "var(--text-on-accent)" : "var(--accent)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events list */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 12 }}>
        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          {selectedDay
            ? new Date(year, month, selectedDay).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" })
            : "All events this month"}
        </h4>
        <button
          onClick={() => setFormOpen(true)}
          aria-label="Add event"
          className="detto-pressable"
          style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "1.5px solid var(--accent)",
            background: "var(--accent)", color: "var(--text-on-accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      {visibleEvents.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", background: "var(--surface)", borderRadius: "var(--radius-lg)" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>Nothing planned</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Tap the + button to add your first date.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimatePresence initial={false}>
            {visibleEvents.map((ev, i) => {
              const Icon = CATEGORY_ICON[ev.category];
              return (
                <motion.button
                  key={ev.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setDetailEvent(ev)}
                  className="detto-pressable"
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "var(--surface-alt)",
                    borderRadius: "var(--radius-lg)", padding: 16, cursor: "pointer",
                    border: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, color: "var(--text-secondary)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    <Icon size={12} /> {CATEGORY_LABEL[ev.category]}
                  </div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                    {ev.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    <span>
                      {new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                    {ev.location && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} /> {ev.location}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Event form */}
      <EventFormSheet
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        defaultDate={
          selectedDay
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
            : new Date().toISOString().slice(0, 10)
        }
        onSubmit={(ev) => {
          addEvent(ev);
          setFormOpen(false);
          const [y, m, d] = ev.date.split("-").map(Number);
          setYear(y); setMonth(m - 1); setSelectedDay(d);
        }}
      />

      {/* Detail sheet */}
      <AnimatePresence>
        {detailEvent && (
          <DetailOverlay
            event={detailEvent}
            onClose={() => setDetailEvent(null)}
            onDelete={() => deleteEvent(detailEvent.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------------------------------- *
 * Sub-components
 * --------------------------------------------------------- */

const iconBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-alt)",
  color: "var(--text-primary)",
  cursor: "pointer",
};

function EventFormSheet({
  isOpen, onClose, onSubmit, defaultDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ev: Omit<DemoEvent, "id">) => void;
  defaultDate: string;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("DATE");
  const [date, setDate] = useState(defaultDate);
  const [location, setLocation] = useState("");

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setTitle(""); setCategory("DATE");
      setDate(defaultDate); setLocation("");
    }
  }, [isOpen, defaultDate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50 }}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 51,
              background: "var(--surface)",
              borderTopLeftRadius: "var(--radius-lg)",
              borderTopRightRadius: "var(--radius-lg)",
              padding: 20, paddingBottom: 32,
              maxHeight: "85vh", overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                New Event
              </h3>
              <button onClick={onClose} aria-label="Close" style={{ ...iconBtnStyle, background: "transparent", border: "none" }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!title.trim()) return;
                onSubmit({ title: title.trim(), category, date, location: location.trim() || undefined });
              }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <Field label="Title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Dinner at the rooftop…"
                  autoFocus
                  style={inputStyle}
                />
              </Field>

              <Field label="Category">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CATEGORY_OPTIONS.map((c) => {
                    const Icon = CATEGORY_ICON[c];
                    const selected = category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className="detto-pressable"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "6px 12px",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.75rem", fontWeight: 700,
                          border: selected ? "1.5px solid var(--accent)" : "1.5px solid var(--border-subtle)",
                          background: selected ? "var(--accent-soft)" : "transparent",
                          color: selected ? "var(--accent)" : "var(--text-secondary)",
                          cursor: "pointer",
                        }}
                      >
                        <Icon size={12} /> {CATEGORY_LABEL[c]}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Date">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Optional"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={!title.trim()}
                className="detto-pressable"
                style={{
                  marginTop: 8,
                  padding: "14px 20px", borderRadius: "var(--radius-full)",
                  background: "var(--accent)", color: "var(--text-on-accent)",
                  border: "none", fontWeight: 800, fontSize: "0.9rem",
                  cursor: title.trim() ? "pointer" : "not-allowed",
                  opacity: title.trim() ? 1 : 0.4,
                }}
              >
                Add to Calendar
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailOverlay({
  event, onClose, onDelete,
}: {
  event: DemoEvent;
  onClose: () => void;
  onDelete: () => void;
}) {
  const Icon = CATEGORY_ICON[event.category];
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50 }}
      />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 51,
          background: "var(--surface)",
          borderTopLeftRadius: "var(--radius-lg)",
          borderTopRightRadius: "var(--radius-lg)",
          padding: 20, paddingBottom: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: "var(--radius-full)", background: "var(--accent-soft)", color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <Icon size={12} /> {CATEGORY_LABEL[event.category]}
          </span>
          <button onClick={onClose} aria-label="Close" style={{ ...iconBtnStyle, background: "transparent", border: "none" }}>
            <X size={20} />
          </button>
        </div>

        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", marginBottom: 12 }}>
          {event.title}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarIcon size={14} />
            {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          {event.location && (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={14} /> {event.location}
            </span>
          )}
        </div>

        <button
          onClick={onDelete}
          className="detto-pressable"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "12px 20px",
            borderRadius: "var(--radius-full)",
            background: "transparent",
            border: "1.5px solid var(--border-strong)",
            color: "var(--text-primary)",
            fontWeight: 700, fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          <Trash2 size={14} /> Delete event
        </button>
      </motion.div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "var(--radius-md)",
  border: "1.5px solid var(--border-subtle)",
  background: "var(--input-bg)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  outline: "none",
};
