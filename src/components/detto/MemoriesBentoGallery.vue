<script setup lang="ts">
import { ref } from 'vue'

/* ---- Types ---- */
interface Memory {
  id: string
  eventId: string
  title: string
  date: string
  location?: string
  image: string
  size: 'small' | 'medium' | 'large'
  category: Category
}

type Category =
  | 'DATE' | 'RESTAURANT' | 'CAFE' | 'MOVIE' | 'TRAVEL' | 'SHOPPING'
  | 'ANNIVERSARY' | 'BIRTHDAY' | 'HOLIDAY' | 'FAMILY' | 'CONCERT'
  | 'WORKOUT' | 'PLAYTIME' | 'OTHER'

/* ---- Seed memories ---- */
function seedMemories(): Memory[] {
  const now = new Date()
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const addDays = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d }

  return [
    {
      id: 'm1',
      eventId: 'e1',
      title: 'Bali Anniversary',
      date: iso(addDays(14)),
      location: 'Ubud, Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=800&fit=crop',
      size: 'large',
      category: 'ANNIVERSARY',
    },
    {
      id: 'm3',
      eventId: 'e3',
      title: 'Concert night',
      date: iso(addDays(7)),
      location: 'JIS',
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=600&fit=crop',
      size: 'medium',
      category: 'CONCERT',
    },
    {
      id: 'm2',
      eventId: 'e2',
      title: 'Beach sunset',
      date: iso(addDays(10)),
      location: 'Anyer',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
      size: 'small',
      category: 'TRAVEL',
    },
    {
      id: 'm4',
      eventId: 'e4',
      title: 'Weekend trip',
      date: iso(addDays(5)),
      location: 'Puncak',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop',
      size: 'small',
      category: 'TRAVEL',
    },

  ]
}

/* ---- State ---- */
const memories = ref<Memory[]>(seedMemories())

function formatDateShort(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

function getCategoryLabel(cat: Category): string {
  const labels: Record<Category, string> = {
    DATE: 'Date', RESTAURANT: 'Restaurant', CAFE: 'Cafe', MOVIE: 'Movie',
    TRAVEL: 'Travel', SHOPPING: 'Shopping', ANNIVERSARY: 'Anniversary',
    BIRTHDAY: 'Birthday', HOLIDAY: 'Holiday', FAMILY: 'Family',
    CONCERT: 'Concert', WORKOUT: 'Workout', PLAYTIME: 'Playtime', OTHER: 'Other',
  }
  return labels[cat]
}

</script>

<template>
  <div class="detto-widget">
    <!-- Header -->
    <div class="widget-header">
      <h3 class="widget-title">Every photo has a story</h3>
      <p class="widget-desc">Memories linked to events — tap any to see the full story.</p>
    </div>

    <!-- Bento Grid -->
    <div class="bento-grid">
      <div v-for="memory in memories" :key="memory.id" class="memory-card" :class="`size-${memory.size}`">
        <img :src="memory.image" :alt="memory.title" loading="lazy" />

        <div class="card-overlay">
          <div class="card-badge">
            <span>{{ getCategoryLabel(memory.category) }}</span>
          </div>

          <div class="card-content">
            <h4 class="card-title">{{ memory.title }}</h4>

            <div class="card-meta">
              <span v-if="memory.location">{{ memory.location }}</span>
              <span v-if="memory.location">-</span>
              <span>{{ formatDateShort(memory.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info footer -->
    <div class="gallery-footer">
      <p class="footer-text">
        <span class="accent-text">{{ memories.length }} memories</span> captured so far.
        Each one tells a story you built together.
      </p>
    </div>
  </div>
</template>

<style scoped>
.detto-widget {
  --accent: #fe6b5e;
  --accent-soft: #FFE1DC;
  --bg: #EDEAE2;
  --surface: #fff;
  --surface-alt: #F6F4EF;
  --text: #1B211D;
  --text-sec: #5C6660;
  --border: #E2DED3;
  --radius: 22px;
  --radius-md: 14px;
  --radius-sm: 10px;

  font-family: 'Nunito', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  border-radius: var(--radius);
  padding: 20px;
  width: 100%;
  max-width: clamp(320px, 90vw, 400px);
  margin: 0 auto;
}

/* Header */
.widget-header {
  margin-bottom: 20px;
}


.widget-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 4px 0;
}

.widget-desc {
  font-size: 0.85rem;
  color: var(--text-sec);
  margin-top: 4px;
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 120px;
  gap: 12px;
}

/* Memory Cards */
.memory-card {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.memory-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(31, 43, 39, 0.12);
}

.memory-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Card Sizes */
.size-small {
  grid-row: span 1;
  grid-column: span 1;
}

.size-medium {
  grid-row: span 2;
  grid-column: span 1;
}

.size-large {
  grid-row: span 2;
  grid-column: span 2;
}

@media (min-width: 640px) {
  .size-medium {
    grid-row: span 2;
  }

  .size-large {
    grid-row: span 3;
    grid-column: span 2;
  }
}

/* Card Overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(27, 33, 29, 0.85) 0%, rgba(27, 33, 29, 0.4) 40%, transparent 70%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: 0.95;
}

.memory-card:hover .card-overlay {
  opacity: 1;
}

/* Card Badge */
.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 999px;
  margin-bottom: 8px;
  align-self: flex-start;
}

/* Card Content */
.card-content {
  color: white;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 6px;
  line-height: 1.3;
  color: white
}

.size-medium .card-title,
.size-large .card-title {
  font-size: 1.1rem;
  color: white
}

.card-meta {
  display: flex;
  flex-direction: row;
  gap: 2px;
  font-size: 0.72rem;
  opacity: 0.9;
  color: white
}

/* Footer */
.gallery-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.footer-text {
  font-size: 0.85rem;
  color: var(--text-sec);
  text-align: center;
  line-height: 1.5;
  margin: 0;
}

.accent-text {
  color: var(--accent);
  font-weight: 700;
}
</style>
