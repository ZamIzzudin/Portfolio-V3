<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

/* ---- Types ---- */
interface DemoEvent {
  id: string
  title: string
  category: Category
  date: string
  location?: string
}

type Category =
  | 'DATE' | 'RESTAURANT' | 'CAFE' | 'MOVIE' | 'TRAVEL' | 'SHOPPING'
  | 'ANNIVERSARY' | 'BIRTHDAY' | 'HOLIDAY' | 'FAMILY' | 'CONCERT'
  | 'WORKOUT' | 'PLAYTIME' | 'OTHER'

const CATEGORY_LABEL: Record<Category, string> = {
  DATE: 'Date', RESTAURANT: 'Restaurant', CAFE: 'Cafe', MOVIE: 'Movie',
  TRAVEL: 'Travel', SHOPPING: 'Shopping', ANNIVERSARY: 'Anniversary',
  BIRTHDAY: 'Birthday', HOLIDAY: 'Holiday', FAMILY: 'Family',
  CONCERT: 'Concert', WORKOUT: 'Workout', PLAYTIME: 'Playtime', OTHER: 'Other',
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const STORAGE_KEY = 'detto-demo-calendar-events'

/* ---- Dummy data pool ---- */
const DUMMY_EVENTS: Omit<DemoEvent, 'id' | 'date'>[] = [
  { title: 'Stargazing at the rooftop', category: 'DATE', location: 'Home terrace' },
  { title: 'Try the new gelato place', category: 'CAFE', location: 'Kemang' },
  { title: 'Concert tickets booked!', category: 'CONCERT', location: 'JIS' },
  { title: 'Weekend getaway to Puncak', category: 'TRAVEL', location: 'Puncak' },
  { title: 'Brunch at the vineyard cafe', category: 'RESTAURANT', location: 'Sentul' },
  { title: 'Paint & sip night', category: 'DATE', location: 'Living room' },
  { title: 'Morning jog together', category: 'WORKOUT', location: 'Senayan' },
  { title: 'Movie marathon — Studio Ghibli', category: 'MOVIE', location: 'Home' },
  { title: 'Visit the weekend flea market', category: 'SHOPPING', location: 'Museum MACAN' },
  { title: 'Anniversary dinner', category: 'ANNIVERSARY', location: 'Pluit Raya' },
  { title: 'Board game night', category: 'PLAYTIME', location: 'Home' },
  { title: 'Family BBQ Sunday', category: 'FAMILY', location: 'Mom\'s house' },
  { title: 'Watch the sunset at the beach', category: 'TRAVEL', location: 'Anyer' },
  { title: 'Cook Thai curry together', category: 'DATE', location: 'Home' },
  { title: 'Holiday staycation planning', category: 'HOLIDAY', location: 'Bali' },
  { title: 'Surprise birthday prep', category: 'BIRTHDAY', location: 'Secret' },
  { title: 'Late night dessert run', category: 'RESTAURANT', location: 'PIK Avenue' },
  { title: 'Visit the cat cafe', category: 'CAFE', location: 'Menteng' },
]

let dummyIdx = 0

/* ---- State ---- */
const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth())
const selectedDay = ref<number | null>(today.getDate())
const events = ref<DemoEvent[]>([])

/* ---- Seed ---- */
function seedEvents(): DemoEvent[] {
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const addDays = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return d }
  return [
    { id: 's1', title: 'Movie night — Studio Ghibli', category: 'MOVIE', date: iso(addDays(2)), location: 'Home' },
    { id: 's2', title: 'Dinner at Padang Merdeka', category: 'RESTAURANT', date: iso(addDays(5)), location: 'Senopati' },
    { id: 's3', title: '6 months together', category: 'ANNIVERSARY', date: iso(addDays(14)) },
  ]
}

/* ---- LocalStorage ---- */
function loadEvents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) { events.value = JSON.parse(stored); return }
  } catch { /* ignore */ }
  const seed = seedEvents()
  events.value = seed
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)) } catch { /* ignore */ }
}

watch(events, (val) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch { /* ignore */ }
}, { deep: true })

/* ---- Computed ---- */
const eventDays = computed(() => {
  const map = new Map<number, DemoEvent[]>()
  for (const ev of events.value) {
    const d = new Date(ev.date + 'T00:00:00')
    if (d.getMonth() === month.value && d.getFullYear() === year.value) {
      const arr = map.get(d.getDate()) ?? []
      arr.push(ev)
      map.set(d.getDate(), arr)
    }
  }
  return map
})

const visibleEvents = computed(() => {
  if (selectedDay.value) return eventDays.value.get(selectedDay.value) ?? []
  return Array.from(eventDays.value.values()).flat().sort((a, b) => a.date.localeCompare(b.date))
})

const cells = computed(() => {
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const firstDay = new Date(year.value, month.value, 1).getDay()
  const result: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) result.push(null)
  for (let d = 1; d <= daysInMonth; d++) result.push(d)
  return result
})

const monthName = computed(() =>
  new Date(year.value, month.value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

/* ---- Actions ---- */
function prevMonth() {
  selectedDay.value = null
  if (month.value === 0) { month.value = 11; year.value-- } else month.value--
}
function nextMonth() {
  selectedDay.value = null
  if (month.value === 11) { month.value = 0; year.value++ } else month.value++
}

function selectDay(day: number | null) {
  selectedDay.value = selectedDay.value === day ? null : day
}

function addDummyEvent() {
  const dummy = DUMMY_EVENTS[dummyIdx % DUMMY_EVENTS.length]
  dummyIdx++
  const day = selectedDay.value ?? today.getDate()
  const dateStr = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const ev: DemoEvent = {
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: dummy.title,
    category: dummy.category,
    date: dateStr,
    location: dummy.location,
  }
  events.value.push(ev)
  selectedDay.value = day
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })
}

onMounted(loadEvents)
</script>

<template>
  <div class="detto-widget">
    <!-- Header -->
    <div class="widget-header">
      <h3 class="widget-title">Let's Plan Something</h3>
      <p class="widget-desc">Pick a day, then tap <strong>+</strong> to add an event.</p>
    </div>

    <!-- Calendar card -->
    <div class="cal-card">
      <div class="cal-nav">
        <button class="icon-btn" @click="prevMonth" aria-label="Previous month">&#8592;</button>
        <span class="cal-month">{{ monthName }}</span>
        <button class="icon-btn" @click="nextMonth" aria-label="Next month">&#8594;</button>
      </div>

      <div class="day-labels">
        <div v-for="l in DAY_LABELS" :key="l" class="day-label">{{ l }}</div>
      </div>

      <div class="cal-grid">
        <div v-for="(day, i) in cells" :key="i">
          <div v-if="day === null" class="cal-empty" />
          <button v-else class="cal-cell" :class="{
            'is-today': day === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
            'is-selected': day === selectedDay,
          }" @click="selectDay(day)">
            <span>{{ day }}</span>
            <div v-if="(eventDays.get(day)?.length ?? 0) > 0" class="dot-row">
              <span v-for="(_, j) in Math.min(eventDays.get(day)!.length, 3)" :key="j" class="event-dot" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Events list -->
    <div class="events-header">
      <h4 class="events-title">
        {{ selectedDay ? formatDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2,
          '0')}`) : 'All Event' }}
      </h4>
      <button class="add-btn" @click="addDummyEvent" aria-label="Add event">+</button>
    </div>

    <div v-if="visibleEvents.length === 0" class="empty-state">
      <p class="empty-title">Nothing planned</p>
      <p class="empty-desc">Tap the + button to add your first date.</p>
    </div>

    <TransitionGroup v-else name="event-list" tag="div" class="event-list">
      <button v-for="ev in visibleEvents" :key="ev.id" class="event-card">
        <div class="event-cat">
          {{ CATEGORY_LABEL[ev.category] }}
        </div>
        <div class="event-title">{{ ev.title }}</div>
        <div class="event-meta">
          <span>{{ formatDate(ev.date) }}</span>
          <span v-if="ev.location">-</span>
          <span v-if="ev.location">{{ ev.location }}</span>

        </div>
      </button>
    </TransitionGroup>

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
  font-family: 'Nunito', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  border-radius: var(--radius);
  padding: clamp(1rem, 3vw, 2rem);
  width: 100%;
  max-width: clamp(320px, 90vw, 400px);
  margin: 0 auto;
}

.widget-header {
  margin-bottom: clamp(0.8rem, 2vw, 1.6rem);
}

.widget-title {
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 700;
  color: var(--text);
  margin: 4px 0 0 0;
}

.widget-desc {
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  color: var(--text-sec);
  margin-top: 4px;
}

.cal-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: clamp(1rem, 2vw, 1.6rem);
}

.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(0.8rem, 2vw, 1.6rem);
}

.icon-btn {
  width: clamp(28px, 6vw, 32px);
  height: clamp(28px, 6vw, 32px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  background: var(--surface-alt);
  color: var(--text);
  cursor: pointer;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.cal-month {
  font-size: clamp(1.3rem, 3vw, 1.5rem);
  font-weight: 700;
  color: var(--text);
}

.day-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: clamp(0.5rem, 1vw, 0.8rem);
}

.day-label {
  text-align: center;
  font-size: clamp(0.6rem, 1.5vw, 0.7rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-sec);
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(2px, 0.5vw, 4px);
}

.cal-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text);
  font-weight: 500;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  aspect-ratio: 1/1;
  width: 100%;
  transition: all 150ms;
}

.cal-cell:active {
  transform: scale(0.96);
}

.cal-cell.is-selected {
  background: var(--accent);
  color: #fff;
}

.cal-cell.is-today:not(.is-selected) {
  color: var(--accent);
  font-weight: 800;
}

.dot-row {
  display: flex;
  gap: clamp(2px, 0.5vw, 3px);
  margin-top: 2px;
}

.event-dot {
  width: clamp(4px, 1vw, 5px);
  height: clamp(4px, 1vw, 5px);
  border-radius: 50%;
  background: var(--accent);
}

.cal-cell.is-selected .event-dot {
  background: #fff;
}

.events-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: clamp(1rem, 2vw, 2rem);
  margin-bottom: clamp(0.8rem, 1.5vw, 1.2rem);
}

.events-title {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  font-weight: 600;
  color: var(--text);
}

.add-btn {
  width: clamp(30px, 6vw, 35px);
  height: clamp(30px, 6vw, 35px);
  border-radius: 15%;
  background: var(--accent);
  color: #1F2B27;
  border: none;
  font-size: clamp(1.5rem, 3vw, 1.8rem);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-btn:active {
  transform: scale(0.96);
}

.empty-state {
  text-align: center;
  padding: clamp(1.5rem, 3vw, 2.4rem) 0;
  background: var(--surface);
  border-radius: var(--radius);
}

.empty-title {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  font-weight: 600;
  color: var(--text);
}

.empty-desc {
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  color: var(--text-sec);
  margin-top: 4px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.8rem, 1.5vw, 1.2rem);
}

.event-card {
  display: block;
  width: 100%;
  text-align: left;
  background: var(--surface-alt);
  border-radius: var(--radius);
  padding: clamp(1rem, 2vw, 1.6rem);
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.event-card:active {
  transform: scale(0.97);
}

.event-cat {
  background-color: #fe6b5e;
  width: fit-content;
  padding: clamp(0.1rem, 0.3vw, 0.2rem) clamp(0.5rem, 1vw, 1rem);
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: white;
  border-radius: 15px;
}

.event-title {
  font-size: clamp(1.2rem, 2.5vw, 1.4rem);
  font-weight: 600;
  color: var(--text);
  margin-bottom: clamp(0.4rem, 0.8vw, 0.6rem);
}

.event-meta {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.8rem);
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: var(--text-sec);
}

.event-list-enter-active {
  transition: all 200ms ease;
}

.event-list-leave-active {
  transition: all 150ms ease;
}

.event-list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.event-list-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Overlay & sheet */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet {
  background: var(--surface);
  border-radius: var(--radius) var(--radius) 0 0;
  padding: 20px;
  padding-bottom: 32px;
  width: 100%;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
}

.sheet-enter-active {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sheet-leave-active {
  transition: transform 200ms ease;
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sheet-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Detail overlay */
.detail-cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 12px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-sec);
  font-size: 0.85rem;
  margin-bottom: 24px;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 20px;
  border-radius: 999px;
  background: transparent;
  border: 1.5px solid var(--text-sec);
  color: var(--text);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
}

.delete-btn:active {
  transform: scale(0.97);
}
</style>
