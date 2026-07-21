"use client";

/**
 * Detto — Wishlist Board (Portfolio Showcase)
 * ===========================================
 * Standalone reproduction of Detto's couples wishlist (bucket list).
 *
 * Dependencies (install in your portfolio):
 *   npm install framer-motion lucide-react clsx
 *
 * Theme: drop the contents of portfolio/styles.css into your
 *        global CSS (or import it once at portfolio root).
 *
 * State kept in React + localStorage. The "schedule as event"
 * action fires an onSchedule callback so the parent portfolio
 * can show how a wish becomes a calendar event in Detto.
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Trash2, ExternalLink, Plus, X, CheckCircle2, Circle,
  Calendar, Cake, Gift, Users, Pin, Music, Dumbbell, Gamepad2,
  Heart, ShoppingBag, Clapperboard, Plane, UtensilsCrossed, Coffee,
  Sparkles, Pencil, type LucideIcon,
} from "lucide-react";

/* --------------------------------------------------------- *
 * Types & static config
 * --------------------------------------------------------- */

type Category =
  | "DATE" | "RESTAURANT" | "CAFE" | "MOVIE" | "TRAVEL" | "SHOPPING"
  | "ANNIVERSARY" | "BIRTHDAY" | "HOLIDAY" | "FAMILY" | "CONCERT"
  | "WORKOUT" | "PLAYTIME" | "OTHER";

interface DemoWish {
  id: string;
  title: string;
  content?: string;
  category: Category;
  linkUrl?: string;
  isFavourite: boolean;
  isChecked: boolean;
  checkedAt?: number;
  scheduledFor?: string; // ISO date if scheduled as event
  createdBy: string;
  createdAt: number;
}

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  DATE: Calendar, RESTAURANT: UtensilsCrossed, CAFE: Coffee,
  MOVIE: Clapperboard, TRAVEL: Plane, SHOPPING: ShoppingBag,
  ANNIVERSARY: Heart, BIRTHDAY: Cake, HOLIDAY: Gift, FAMILY: Users,
  CONCERT: Music, WORKOUT: Dumbbell, PLAYTIME: Gamepad2, OTHER: Pin,
};

const CATEGORY_LABEL: Record<Category, string> = {
  DATE: "Date", RESTAURANT: "Restaurant", CAFE: "Cafe", MOVIE: "Movie",
  TRAVEL: "Travel", SHOPPING: "Shopping", ANNIVERSARY: "Anniversary",
  BIRTHDAY: "Birthday", HOLIDAY: "Holiday", FAMILY: "Family",
  CONCERT: "Concert", WORKOUT: "Workout", PLAYTIME: "Playtime", OTHER: "Other",
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABEL) as Category[];
const STORAGE_KEY = "detto-demo-wishlist";

/* --------------------------------------------------------- *
 * Seed data
 * --------------------------------------------------------- */

const SEED_WISHES = (): DemoWish[] => {
  const now = Date.now();
  return [
    {
      id: "w1", title: "Watch sunrise at Bromo",
      content: "Plan a weekend trip — leave Jakarta midnight, arrive for first light.",
      category: "TRAVEL", isFavourite: true, isChecked: false,
      createdBy: "Aldy", createdAt: now - 86400_000 * 7,
    },
    {
      id: "w2", title: "Try every ramen spot in Senopati",
      content: "One per weekend. Keep a shared scoreboard.",
      category: "RESTAURANT", isFavourite: false, isChecked: false,
      linkUrl: "https://maps.google.com",
      createdBy: "Vira", createdAt: now - 86400_000 * 4,
    },
    {
      id: "w3", title: "Cook pasta from scratch together",
      category: "DATE", isFavourite: false, isChecked: true,
      checkedAt: now - 86400_000 * 2,
      createdBy: "Vira", createdAt: now - 86400_000 * 14,
    },
  ];
};

/* --------------------------------------------------------- *
 * Widget
 * --------------------------------------------------------- */

interface Props {
  /** Default author for new wishes created in the demo. */
  defaultAuthor?: string;
}

export default function WishlistBoard({ defaultAuthor = "You" }: Props) {
  const [wishes, setWishes] = useState<DemoWish[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DemoWish | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  /* Load */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DemoWish[] = JSON.parse(stored);
        setWishes(parsed.length ? parsed : SEED_WISHES());
        return;
      }
    } catch { /* ignore */ }
    const seed = SEED_WISHES();
    setWishes(seed);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch { /* ignore */ }
  }, []);

  /* Persist */
  useEffect(() => {
    if (wishes.length === 0) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes)); } catch { /* ignore */ }
  }, [wishes]);

  /* Filtered list */
  const visible = useMemo(() => {
    const sorted = [...wishes].sort((a, b) => {
      // open first, then favourite, then newest
      if (a.isChecked !== b.isChecked) return a.isChecked ? 1 : -1;
      if (a.isFavourite !== b.isFavourite) return a.isFavourite ? -1 : 1;
      return b.createdAt - a.createdAt;
    });
    if (filter === "open") return sorted.filter((w) => !w.isChecked);
    if (filter === "done") return sorted.filter((w) => w.isChecked);
    return sorted;
  }, [wishes, filter]);

  /* Stats */
  const stats = useMemo(() => ({
    total: wishes.length,
    done: wishes.filter((w) => w.isChecked).length,
    pinned: wishes.filter((w) => w.isFavourite).length,
  }), [wishes]);

  /* Actions */
  function addWish(w: Omit<DemoWish, "id" | "createdAt" | "createdBy">) {
    const wish: DemoWish = {
      ...w,
      id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      createdBy: defaultAuthor,
    };
    setWishes((prev) => [wish, ...prev]);
  }

  function updateWish(id: string, patch: Partial<DemoWish>) {
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }

  function deleteWish(id: string) {
    setWishes((prev) => prev.filter((w) => w.id !== id));
  }

  function scheduleWish(id: string) {
    // Demo: schedule it 7 days from now
    const date = new Date();
    date.setDate(date.getDate() + 7);
    updateWish(id, { scheduledFor: date.toISOString().slice(0, 10) });
  }

  return (
    <div className="detto-widget" aria-label="Detto — Wishlist">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          Detto · Wishlist
        </p>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4, fontFamily: "var(--font-display)" }}>
          Things we want to do
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
          Build a shared bucket list. Pin favourites, mark them done, or turn one into a calendar event.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <StatChip label="Total" value={stats.total} />
        <StatChip label="Done" value={stats.done} accent="success" />
        <StatChip label="Pinned" value={stats.pinned} accent="warning" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {(["all", "open", "done"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className="detto-pressable"
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem", fontWeight: 700,
              border: filter === k ? "1.5px solid var(--accent)" : "1.5px solid var(--border-subtle)",
              background: filter === k ? "var(--accent)" : "transparent",
              color: filter === k ? "var(--text-on-accent)" : "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            {k === "all" ? "All" : k === "open" ? "Open" : "Done"}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          aria-label="Add wish"
          className="detto-pressable"
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--accent)", color: "var(--text-on-accent)",
            border: "1.5px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 16px", background: "var(--surface)", borderRadius: "var(--radius-lg)" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>No wishes here yet</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4 }}>
            Tap + to add something you both want to do.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence initial={false}>
            {visible.map((w) => (
              <WishCard
                key={w.id}
                wish={w}
                onToggleFavourite={() => updateWish(w.id, { isFavourite: !w.isFavourite })}
                onToggleCheck={() =>
                  updateWish(w.id, {
                    isChecked: !w.isChecked,
                    checkedAt: !w.isChecked ? Date.now() : undefined,
                  })
                }
                onSchedule={() => scheduleWish(w.id)}
                onEdit={() => { setEditTarget(w); setFormOpen(true); }}
                onDelete={() => deleteWish(w.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Form */}
      <WishFormSheet
        isOpen={formOpen}
        editTarget={editTarget}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSubmit={(data) => {
          if (editTarget) {
            updateWish(editTarget.id, data);
          } else {
            addWish({ ...data, isFavourite: false, isChecked: false });
          }
          setFormOpen(false);
          setEditTarget(null);
        }}
      />
    </div>
  );
}

/* --------------------------------------------------------- *
 * Wish card
 * --------------------------------------------------------- */

function WishCard({
  wish,
  onToggleFavourite,
  onToggleCheck,
  onSchedule,
  onEdit,
  onDelete,
}: {
  wish: DemoWish;
  onToggleFavourite: () => void;
  onToggleCheck: () => void;
  onSchedule: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = CATEGORY_ICON[wish.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "relative",
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        padding: 14,
        border: "1px solid var(--border-subtle)",
        opacity: wish.isChecked ? 0.6 : 1,
        overflow: "hidden",
      }}
    >
      {/* Decorative giant icon */}
      <Icon
        size={96}
        strokeWidth={1}
        style={{
          position: "absolute", right: -16, bottom: -16,
          color: "var(--text-primary)", opacity: 0.05, pointerEvents: "none",
        }}
      />

      {/* Pinned ribbon */}
      {wish.isFavourite && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          padding: "2px 8px",
          borderBottomRightRadius: "var(--radius-sm)",
          background: "var(--accent-soft)", color: "var(--accent)",
          fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          <Star size={9} fill="currentColor" /> Pinned
        </div>
      )}

      <div style={{ display: "flex", gap: 10, position: "relative" }}>
        {/* Check */}
        <button onClick={onToggleCheck} aria-label="Toggle done" className="detto-pressable" style={{ marginTop: 2, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {wish.isChecked ? (
            <CheckCircle2 size={20} style={{ color: "var(--success)" }} fill="var(--success)" />
          ) : (
            <Circle size={20} style={{ color: "var(--text-secondary)" }} />
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "0.95rem", fontWeight: 700,
            color: "var(--text-primary)",
            textDecoration: wish.isChecked ? "line-through" : "none",
            wordBreak: "break-word",
          }}>
            {wish.title}
          </p>
          {wish.content && (
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.45 }}>
              {wish.content}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 8 }}>
            <span style={{
              fontSize: "0.65rem", fontWeight: 700,
              padding: "2px 8px", borderRadius: "var(--radius-full)",
              background: "var(--surface-alt)", color: "var(--text-secondary)",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <Icon size={10} /> {CATEGORY_LABEL[wish.category]}
            </span>
            {wish.linkUrl && (
              <a
                href={wish.linkUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: "0.7rem", fontWeight: 600, color: "var(--accent)",
                  display: "inline-flex", alignItems: "center", gap: 4,
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={12} /> Link
              </a>
            )}
            <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
              by {wish.createdBy}
            </span>
            {wish.scheduledFor && (
              <span style={{
                fontSize: "0.62rem", fontWeight: 600,
                padding: "2px 8px", borderRadius: "var(--radius-full)",
                background: "var(--accent-soft)", color: "var(--accent)",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                <Calendar size={10} />
                {new Date(wish.scheduledFor + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short" })}
              </span>
            )}
            {wish.isChecked && wish.checkedAt && (
              <span style={{
                fontSize: "0.62rem", fontWeight: 600,
                padding: "2px 8px", borderRadius: "var(--radius-full)",
                background: "rgba(34,197,94,0.15)", color: "var(--success)",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                Done {new Date(wish.checkedAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button onClick={onToggleFavourite} aria-label="Toggle pin" className="detto-pressable" style={cardActionBtn} title="Pin">
            <Star
              size={16}
              style={{ color: "var(--accent)" }}
              fill={wish.isFavourite ? "var(--accent)" : "none"}
            />
          </button>
          {!wish.scheduledFor && !wish.isChecked && (
            <button onClick={onSchedule} aria-label="Schedule as event" className="detto-pressable" style={cardActionBtn} title="Schedule as event">
              <Sparkles size={14} style={{ color: "var(--text-secondary)" }} />
            </button>
          )}
          <button onClick={onEdit} aria-label="Edit" className="detto-pressable" style={cardActionBtn} title="Edit">
            <Pencil size={13} style={{ color: "var(--text-secondary)" }} />
          </button>
          <button onClick={onDelete} aria-label="Delete" className="detto-pressable" style={cardActionBtn} title="Delete">
            <Trash2 size={13} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const cardActionBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: "50%",
  background: "transparent", border: "none",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", padding: 0,
};

/* --------------------------------------------------------- *
 * Form sheet
 * --------------------------------------------------------- */

interface FormData {
  title: string;
  content?: string;
  category: Category;
  linkUrl?: string;
}

function WishFormSheet({
  isOpen, editTarget, onClose, onSubmit,
}: {
  isOpen: boolean;
  editTarget: DemoWish | null;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("DATE");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    if (editTarget) {
      setTitle(editTarget.title);
      setContent(editTarget.content ?? "");
      setCategory(editTarget.category);
      setLinkUrl(editTarget.linkUrl ?? "");
    } else {
      setTitle(""); setContent(""); setCategory("DATE"); setLinkUrl("");
    }
  }, [isOpen, editTarget]);

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
                {editTarget ? "Edit wish" : "New wish"}
              </h3>
              <button onClick={onClose} aria-label="Close" style={{ ...cardActionBtn, width: 32, height: 32 }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!title.trim()) return;
                onSubmit({
                  title: title.trim(),
                  content: content.trim() || undefined,
                  category,
                  linkUrl: linkUrl.trim() || undefined,
                });
              }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <Field label="Title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Watch the sunrise at Bromo…"
                  autoFocus
                  style={inputStyle}
                />
              </Field>

              <Field label="Note (optional)">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="A short note about why it matters…"
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
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
                          fontSize: "0.72rem", fontWeight: 700,
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

              <Field label="Link (optional)">
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://…"
                  type="url"
                  style={inputStyle}
                />
              </Field>

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
                {editTarget ? "Save changes" : "Add to wishlist"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------------------- *
 * Bits
 * --------------------------------------------------------- */

function StatChip({ label, value, accent }: { label: string; value: number; accent?: "success" | "warning" }) {
  const color =
    accent === "success" ? "var(--success)" :
    accent === "warning" ? "var(--warning)" :
    "var(--accent)";
  return (
    <div style={{
      flex: 1,
      background: "var(--surface)", borderRadius: "var(--radius-md)",
      padding: "8px 12px", border: "1px solid var(--border-subtle)",
    }}>
      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{label}</p>
      <p style={{ fontSize: "1.3rem", fontWeight: 800, color, fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
        {value}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
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
