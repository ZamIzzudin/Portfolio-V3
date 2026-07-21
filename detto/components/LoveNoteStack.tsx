"use client";

/**
 * Detto — Love Note Stack (Portfolio Showcase)
 * ============================================
 * Standalone reproduction of Detto's ephemeral love notes.
 *
 * Dependencies (install in your portfolio):
 *   npm install framer-motion lucide-react clsx
 *
 * Theme: drop the contents of portfolio/styles.css into your
 *        global CSS (or import it once at portfolio root).
 *
 * State is kept in React + localStorage. Notes "expire" after
 * a short demo TTL (10 minutes by default) so visitors can see
 * the ephemeral behaviour without waiting a full day.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Plus, EyeOff, Trash2, X, Clock } from "lucide-react";

/* --------------------------------------------------------- *
 * Types
 * --------------------------------------------------------- */

interface DemoNote {
  id: string;
  message: string;
  author: string;
  color: string; // accent for the card
  createdAt: number;
  expiresAt: number; // epoch ms
}

interface Props {
  /** Demo TTL for newly-created notes, in minutes. Default: 10. */
  defaultTtlMinutes?: number;
}

const STORAGE_KEY = "detto-demo-notes";
const SWIPE_THRESHOLD = 50;

/* --------------------------------------------------------- *
 * Seed data
 * --------------------------------------------------------- */

const SEED_NOTES = (): DemoNote[] => {
  const now = Date.now();
  return [
    {
      id: "n1",
      message: "Picked up your favourite croissants for breakfast. Don't skip coffee again ❤",
      author: "Aldy",
      color: "#fe6b5e",
      createdAt: now - 1000 * 60 * 60 * 2,
      expiresAt: now + 1000 * 60 * 8,
    },
    {
      id: "n2",
      message: "Rescheduled the dentist for Saturday morning so we have Friday night free. Movie pick is yours 😎",
      author: "Vira",
      color: "#4B8B6B",
      createdAt: now - 1000 * 60 * 60 * 5,
      expiresAt: now + 1000 * 60 * 12,
    },
    {
      id: "n3",
      message: "Saw a puppy that looked exactly like the one we said we'd adopt one day. Took a photo, will show you later.",
      author: "Aldy",
      color: "#E8B84B",
      createdAt: now - 1000 * 60 * 30,
      expiresAt: now + 1000 * 60 * 9,
    },
  ];
};

/* --------------------------------------------------------- *
 * Widget
 * --------------------------------------------------------- */

export default function LoveNoteStack({ defaultTtlMinutes = 10 }: Props) {
  const [notes, setNotes] = useState<DemoNote[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  /* Load from localStorage (or seed) on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DemoNote[] = JSON.parse(stored);
        // Drop expired seeds automatically
        const live = parsed.filter((n) => n.expiresAt > Date.now());
        setNotes(live.length ? live : SEED_NOTES());
        return;
      }
    } catch { /* ignore */ }
    const seed = SEED_NOTES();
    setNotes(seed);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch { /* ignore */ }
  }, []);

  /* Persist whenever notes change */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* ignore */ }
  }, [notes]);

  /* Tick every 30s to update countdown */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  /* Prune expired notes silently */
  useEffect(() => {
    const expired = notes.some((n) => n.expiresAt <= now);
    if (expired) {
      setNotes((prev) => prev.filter((n) => n.expiresAt > now));
      setActiveIndex((i) => Math.max(0, Math.min(i, notes.length - 2)));
    }
  }, [now, notes]);

  /* Actions */
  const addNote = useCallback((message: string, author: string, ttlMinutes: number) => {
    const t = Date.now();
    const note: DemoNote = {
      id: `n_${t}_${Math.random().toString(36).slice(2, 6)}`,
      message,
      author: author.trim() || "You",
      color: pickColor(author),
      createdAt: t,
      expiresAt: t + ttlMinutes * 60_000,
    };
    setNotes((prev) => [note, ...prev]);
    setActiveIndex(0);
  }, []);

  const hideNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setActiveIndex(0);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % Math.max(notes.length, 1));
  }, [notes.length]);
  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + notes.length) % Math.max(notes.length, 1));
  }, [notes.length]);

  /* Card sizing — peek the card behind */
  const visibleCount = Math.min(notes.length, 3);
  const stackPeek = 18;

  const activeNote = notes[activeIndex];

  return (
    <div className="detto-widget" aria-label="Detto — Love Notes">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          Detto · Love Notes
        </p>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4, fontFamily: "var(--font-display)" }}>
          Say something short
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
          Each note disappears after a while. Swipe to read the next one.
        </p>
      </div>

      {notes.length === 0 ? (
        <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>No notes right now</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2 }}>Leave a quick note for your partner.</p>
          </div>
          <button
            onClick={() => setComposerOpen(true)}
            className="detto-pressable"
            aria-label="Add note"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "var(--accent)", color: "var(--text-on-accent)",
              border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      ) : (
        <>
          <div style={{ position: "relative", minHeight: 200 }}>
            {/* Background peek cards */}
            {Array.from({ length: visibleCount - 1 }).map((_, offset) => {
              const stackIdx = (activeIndex + visibleCount - 1 - offset) % notes.length;
              const depth = offset + 1;
              const scale = 1 - depth * 0.04;
              const translateY = depth * 10;
              const translateX = depth * 6;
              const opacityVal = 1 - depth * 0.3;
              const note = notes[stackIdx];

              return (
                <div
                  key={`bg-${note.id}`}
                  style={{
                    position: "absolute", left: 0, right: 0, top: 0,
                    background: "var(--surface)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale})`,
                    opacity: opacityVal,
                    padding: 16,
                    zIndex: visibleCount - depth,
                    pointerEvents: "none",
                  }}
                >
                  <NoteInner note={note} compact />
                </div>
              );
            })}

            {/* Active swipeable card */}
            <div style={{ position: "relative", zIndex: visibleCount + 1 }}>
              <AnimatePresence mode="wait">
                <SwipeableCard key={activeNote?.id} onSwipeLeft={goNext} onSwipeRight={goPrev}>
                  {activeNote && (
                    <ActiveNote
                      note={activeNote}
                      onHide={() => hideNote(activeNote.id)}
                      onDelete={() => hideNote(activeNote.id)}
                    />
                  )}
                </SwipeableCard>
              </AnimatePresence>
            </div>
          </div>

          {/* Pagination dots + add button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, padding: "0 4px" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {notes.map((n, i) => (
                <span
                  key={n.id}
                  style={{
                    width: i === activeIndex ? 20 : 8,
                    height: 8,
                    borderRadius: "var(--radius-full)",
                    background: i === activeIndex ? "var(--accent)" : "var(--border-subtle)",
                    transition: "all 300ms",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setComposerOpen(true)}
              aria-label="Add note"
              className="detto-pressable"
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "var(--accent)", color: "var(--text-on-accent)",
                border: "1.5px solid var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Help hint */}
          <p style={{ textAlign: "center", marginTop: 12, fontSize: "0.72rem", color: "var(--text-secondary)" }}>
            ← swipe to read others →
          </p>
        </>
      )}

      {/* Composer */}
      <NoteComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={(msg, author, ttl) => {
          addNote(msg, author, ttl);
          setComposerOpen(false);
        }}
        defaultTtlMinutes={defaultTtlMinutes}
      />
    </div>
  );
}

/* --------------------------------------------------------- *
 * Swipeable wrapper
 * --------------------------------------------------------- */

function SwipeableCard({
  children, onSwipeLeft, onSwipeRight,
}: {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);
  const leftOpacity = useTransform(x, [-200, -50, 0], [1, 0, 0]);
  const rightOpacity = useTransform(x, [0, 50, 200], [0, 0, 1]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x, rotate }}
      onDragEnd={(_e, info) => {
        if (info.offset.x < -SWIPE_THRESHOLD) onSwipeLeft();
        else if (info.offset.x > SWIPE_THRESHOLD) onSwipeRight();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: 18,
          boxShadow: "var(--shadow-md)",
          cursor: "grab",
        }}
      >
        {children}
      </motion.div>

      <motion.div style={{ opacity: leftOpacity, position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)" }}>
        <span style={{
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: "var(--radius-full)",
          background: "var(--accent-soft)", color: "var(--accent)",
        }}>
          Next
        </span>
      </motion.div>
      <motion.div style={{ opacity: rightOpacity, position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)" }}>
        <span style={{
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: "var(--radius-full)",
          background: "var(--accent-soft)", color: "var(--accent)",
        }}>
          Prev
        </span>
      </motion.div>
    </motion.div>
  );
}

/* --------------------------------------------------------- *
 * Note card internals
 * --------------------------------------------------------- */

function ActiveNote({
  note, onHide, onDelete,
}: {
  note: DemoNote;
  onHide: () => void;
  onDelete: () => void;
}) {
  const timeLeft = getTimeRemaining(note.expiresAt);

  return (
    <div>
      {/* Top stripe */}
      <div style={{
        height: 3, borderRadius: 3,
        background: note.color, marginBottom: 14, width: "30%",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Avatar name={note.author} color={note.color} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{note.author}</p>
          <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Clock size={10} /> {timeLeft}
          </p>
        </div>
        <button onClick={onHide} aria-label="Hide" className="detto-pressable" style={actionBtnStyle} title="Hide (anyone)">
          <EyeOff size={14} />
        </button>
        <button onClick={onDelete} aria-label="Delete" className="detto-pressable" style={{ ...actionBtnStyle, color: "#dc2626" }} title="Delete">
          <Trash2 size={14} />
        </button>
      </div>

      <p style={{ fontSize: "0.95rem", lineHeight: 1.55, color: "var(--text-primary)" }}>
        {note.message}
      </p>
    </div>
  );
}

function NoteInner({ note, compact = false }: { note: DemoNote; compact?: boolean }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Avatar name={note.author} color={note.color} />
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{note.author}</span>
      </div>
      {!compact && (
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>{note.message}</p>
      )}
      {compact && (
        <p style={{
          fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {note.message}
        </p>
      )}
    </div>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: color, color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: "0.75rem", flexShrink: 0,
    }}>
      {initial}
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: "50%",
  background: "transparent", border: "none",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "var(--text-secondary)", cursor: "pointer",
};

/* --------------------------------------------------------- *
 * Composer
 * --------------------------------------------------------- */

function NoteComposer({
  isOpen, onClose, onSubmit, defaultTtlMinutes,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (msg: string, author: string, ttlMinutes: number) => void;
  defaultTtlMinutes: number;
}) {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [ttl, setTtl] = useState(defaultTtlMinutes);

  useEffect(() => {
    if (isOpen) {
      setMessage(""); setAuthor(""); setTtl(defaultTtlMinutes);
    }
  }, [isOpen, defaultTtlMinutes]);

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
                Leave a note
              </h3>
              <button onClick={onClose} aria-label="Close" style={{ ...actionBtnStyle, width: 32, height: 32 }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!message.trim()) return;
                onSubmit(message.trim(), author.trim() || "You", ttl);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <label style={{ display: "block" }}>
                <span style={labelStyle}>Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A short message, just for them…"
                  rows={4}
                  autoFocus
                  style={{ ...inputStyle, resize: "vertical", minHeight: 96 }}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "block" }}>
                  <span style={labelStyle}>From</span>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="You"
                    style={inputStyle}
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span style={labelStyle}>Expires in (min)</span>
                  <input
                    type="number"
                    min={1} max={1440}
                    value={ttl}
                    onChange={(e) => setTtl(Number(e.target.value) || 1)}
                    style={inputStyle}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={!message.trim()}
                className="detto-pressable"
                style={{
                  marginTop: 8,
                  padding: "14px 20px", borderRadius: "var(--radius-full)",
                  background: "var(--accent)", color: "var(--text-on-accent)",
                  border: "none", fontWeight: 800, fontSize: "0.9rem",
                  cursor: message.trim() ? "pointer" : "not-allowed",
                  opacity: message.trim() ? 1 : 0.4,
                }}
              >
                Send note
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------------------- *
 * Helpers
 * --------------------------------------------------------- */

function getTimeRemaining(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "expired";
  const minutes = Math.floor(diff / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  if (minutes > 0) return `${minutes}m ${seconds}s left`;
  return `${seconds}s left`;
}

const PALETTE = ["#fe6b5e", "#4B8B6B", "#E8B84B", "#465955", "#9F7AEA"];
function pickColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 700,
  letterSpacing: "0.06em", textTransform: "uppercase",
  color: "var(--text-secondary)", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  borderRadius: "var(--radius-md)",
  border: "1.5px solid var(--border-subtle)",
  background: "var(--input-bg)",
  color: "var(--text-primary)",
  fontSize: "0.9rem", fontFamily: "inherit", outline: "none",
};
