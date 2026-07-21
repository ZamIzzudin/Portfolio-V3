<script setup lang="ts">
import { ref } from 'vue'

/* ---- Types ---- */
interface Event {
  id: string
  title: string
  description: string
  date: string
  time?: string
  location: string
  category: EventCategory
  size: 'small' | 'medium' | 'large'
  color?: string
  isPast?: boolean
}

type EventCategory =
  | 'ANNIVERSARY' | 'DATE' | 'BIRTHDAY' | 'HOLIDAY'
  | 'CONCERT' | 'MOVIE' | 'TRAVEL' | 'RESTAURANT'
  | 'FAMILY' | 'FRIENDS' | 'WORKOUT' | 'HOBBY'
  | 'OTHER'

/* ---- Color palette ---- */
const EVENT_COLORS = {
  ANNIVERSARY: '#fe6b5e',
  DATE: '#E8B84B',
  BIRTHDAY: '#9F7AEA',
  HOLIDAY: '#F6AD55',
  CONCERT: '#FC8181',
  MOVIE: '#63B3ED',
  TRAVEL: '#48BB78',
  RESTAURANT: '#ED8936',
  FAMILY: '#F687B3',
  FRIENDS: '#4299E1',
  WORKOUT: '#68D391',
  HOBBY: '#F6E05E',
  OTHER: '#A0AEC0',
}

/* ---- Seed events ---- */
function seedEvents(): Event[] {
  const now = new Date()
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const addDays = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return d }
  const subDays = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d }

  return [
    {
      id: 'e1',
      title: 'Anniversary Dinner',
      description: '3 years together at our favorite restaurant',
      date: iso(addDays(3)),
      time: '19:00',
      location: 'Senopati, Jakarta',
      category: 'ANNIVERSARY',
      size: 'large',
      color: EVENT_COLORS.ANNIVERSARY,
    },
    {
      id: 'e2',
      title: 'Movie Night',
      description: 'New release marathon',
      date: iso(addDays(7)),
      time: '20:30',
      location: 'Home',
      category: 'MOVIE',
      size: 'small',
      color: EVENT_COLORS.MOVIE,
    },
    {
      id: 'e3',
      title: 'Weekend Getaway',
      description: '2 days trip to the mountains',
      date: iso(addDays(10)),
      time: '08:00',
      location: 'Puncak, Bogor',
      category: 'TRAVEL',
      size: 'medium',
      color: EVENT_COLORS.TRAVEL,
    },
    {
      id: 'e4',
      title: 'Birthday Party',
      description: 'Surprise celebration',
      date: iso(addDays(14)),
      time: '15:00',
      location: 'Kemang, Jakarta',
      category: 'BIRTHDAY',
      size: 'small',
      color: EVENT_COLORS.BIRTHDAY,
    },
    {
      id: 'e5',
      title: 'Coffee Date',
      description: 'Afternoon catch-up',
      date: iso(addDays(5)),
      time: '14:00',
      location: 'SCBD, Jakarta',
      category: 'DATE',
      size: 'small',
      color: EVENT_COLORS.DATE,
    },
    {
      id: 'e6',
      title: 'Concert Night',
      description: 'Live music experience',
      date: iso(addDays(21)),
      time: '19:30',
      location: 'JIS, Jakarta',
      category: 'CONCERT',
      size: 'medium',
      color: EVENT_COLORS.CONCERT,
    },
    {
      id: 'e7',
      title: 'Family Gathering',
      description: 'Monthly family dinner',
      date: iso(addDays(12)),
      time: '18:00',
      location: 'Kelapa Gading',
      category: 'FAMILY',
      size: 'small',
      color: EVENT_COLORS.FAMILY,
    },
    {
      id: 'e8',
      title: 'Workout Session',
      description: 'Morning yoga together',
      date: iso(addDays(1)),
      time: '07:00',
      location: 'Pondok Indah Mall',
      category: 'WORKOUT',
      size: 'small',
      color: EVENT_COLORS.WORKOUT,
    },
  ]
}

/* ---- State ---- */
const events = ref<Event[]>(seedEvents())

/* ---- Computed ---- */
const upcomingEvents = ref<Event[]>(
  events.value.filter(e => !e.isPast).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
)
const pastEvents = ref<Event[]>(
  events.value.filter(e => e.isPast).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
)

/* ---- Helpers ---- */
function formatDate(dateStr: string, time?: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }
  const dateStr2 = date.toLocaleDateString('en-US', options)
  
  if (time) {
    return `${dateStr2} • ${time}`
  }
  return dateStr2
}

function getDaysUntil(dateStr: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(dateStr + 'T00:00:00')
  targetDate.setHours(0, 0, 0, 0)
  
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
  return `In ${diffDays} days`
}

function getCategoryLabel(cat: EventCategory): string {
  const labels: Record<EventCategory, string> = {
    ANNIVERSARY: 'Anniversary', DATE: 'Date', BIRTHDAY: 'Birthday',
    HOLIDAY: 'Holiday', CONCERT: 'Concert', MOVIE: 'Movie',
    TRAVEL: 'Travel', RESTAURANT: 'Restaurant', FAMILY: 'Family',
    FRIENDS: 'Friends', WORKOUT: 'Workout', HOBBY: 'Hobby', OTHER: 'Other',
  }
  return labels[cat]
}

function getCategoryIcon(cat: EventCategory): string {
  const icons: Record<EventCategory, string> = {
    ANNIVERSARY: '\u2764\uFE0F', DATE: '\uD83D\uDC8C', BIRTHDAY: '\uD83C\uDF82',
    HOLIDAY: '\uD83C\uDF81', CONCERT: '\uD83C\uDFB5', MOVIE: '\uD83C\uDFAC',
    TRAVEL: '\u2708\uFE0F', RESTAURANT: '\uD83C\uDF7D', FAMILY: '\uD83D\uDC65',
    FRIENDS: '\uD83D\uDC6B', WORKOUT: '\uD83D\uDCAA', HOBBY: '\uD83C\uDFAE', OTHER: '\uD83D\uDCCC',
  }
  return icons[cat]
}

function getEventColor(cat: EventCategory): string {
  return EVENT_COLORS[cat] || EVENT_COLORS.OTHER
}
</script>

<template>
  <div class="detto-widget">
    <!-- Header -->
    <div class="widget-header">
      <p class="widget-label">Detto &middot; Event Gallery</p>
      <h3 class="widget-title">Upcoming Events</h3>
      <p class="widget-desc">Your calendar, beautifully organized.</p>
    </div>

    <!-- Upcoming Events Grid -->
    <div class="section-header">
      <span class="section-title">Coming up</span>
      <span class="section-count">{{ upcomingEvents.length }} events</span>
    </div>

    <div class="bento-grid">
      <div
        v-for="event in upcomingEvents"
        :key="event.id"
        class="event-card"
        :class="`size-${event.size}`"
        :style="{
          '--event-color': event.color || getEventColor(event.category),
        }"
      >
        <div class="event-header">
          <div class="event-badge">
            <span>{{ getCategoryIcon(event.category) }}</span>
            <span>{{ getCategoryLabel(event.category) }}</span>
          </div>
          <div class="event-days">
            {{ getDaysUntil(event.date) }}
          </div>
        </div>

        <div class="event-content">
          <h4 class="event-title">{{ event.title }}</h4>
          <p class="event-description">{{ event.description }}</p>
        </div>

        <div class="event-footer">
          <div class="event-location">
            <span class="location-icon">&#128205;</span>
            <span>{{ event.location }}</span>
          </div>
          <div class="event-date-time">
            <span class="date-icon">&#128197;</span>
            <span>{{ formatDate(event.date, event.time) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Past Events Section -->
    <div v-if="pastEvents.length > 0" class="past-events-section">
      <div class="section-header">
        <span class="section-title">Past events</span>
        <span class="section-count">{{ pastEvents.length }} events</span>
      </div>

      <div class="past-events-grid">
        <div
          v-for="event in pastEvents"
          :key="event.id"
          class="past-event-card"
          :style="{
            '--event-color': event.color || getEventColor(event.category),
          }"
        >
          <div class="past-event-header">
            <div class="past-event-category">
              {{ getCategoryIcon(event.category) }} {{ getCategoryLabel(event.category) }}
            </div>
            <div class="past-event-days-ago">{{ getDaysUntil(event.date) }}</div>
          </div>

          <div class="past-event-content">
            <h4 class="past-event-title">{{ event.title }}</h4>
            <p class="past-event-date">{{ formatDate(event.date) }}</p>
            <p class="past-event-location">{{ event.location }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Info footer -->
    <div class="gallery-footer">
      <p class="footer-text">
        <span class="accent-text">{{ events.length }} total events</span> in your calendar.
        Never miss a moment together.
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
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.widget-header {
  margin-bottom: 20px;
}

.widget-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-sec);
}

.widget-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  margin: 4px 0;
}

.widget-desc {
  font-size: 0.85rem;
  color: var(--text-sec);
  margin-top: 4px;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
}

.section-count {
  font-size: 0.75rem;
  color: var(--text-sec);
  background: var(--surface-alt);
  padding: 3px 10px;
  border-radius: 999px;
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 140px;
  gap: 12px;
}

@media (min-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 140px;
    gap: 16px;
  }
}

/* Event Cards */
.event-card {
  position: relative;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--event-color);
}

.event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(31, 43, 39, 0.15);
  border-color: var(--event-color);
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

/* Event Header */
.event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.event-badge {
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
}

.event-badge span:first-child {
  font-size: 0.8rem;
}

.event-days {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--event-color);
  background: rgba(254, 107, 94, 0.1);
  padding: 4px 8px;
  border-radius: 999px;
}

/* Event Content */
.event-content {
  flex: 1;
  margin-bottom: 12px;
}

.event-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 6px;
  line-height: 1.3;
}

.size-medium .event-title,
.size-large .event-title {
  font-size: 1.3rem;
}

.event-description {
  font-size: 0.85rem;
  color: var(--text-sec);
  margin: 0;
  line-height: 1.4;
}

.size-small .event-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Event Footer */
.event-footer {
  border-top: 1px solid var(--border);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.size-medium .event-footer,
.size-large .event-footer {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.event-location,
.event-date-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--text-sec);
}

.location-icon,
.date-icon {
  font-size: 0.9rem;
}

/* Past Events Section */
.past-events-section {
  margin-top: 32px;
}

.past-events-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 640px) {
  .past-events-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.past-event-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.past-event-card:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(31, 43, 39, 0.08);
}

.past-event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.past-event-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-sec);
}

.past-event-days-ago {
  font-size: 0.7rem;
  color: var(--text-sec);
  opacity: 0.8;
}

.past-event-content {
  color: var(--text);
}

.past-event-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.past-event-date,
.past-event-location {
  font-size: 0.8rem;
  color: var(--text-sec);
  margin: 2px 0;
}

/* Footer */
.gallery-footer {
  margin-top: 24px;
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
