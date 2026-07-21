<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/* ---- Types ---- */
interface DemoNotification {
  id: string
  title: string
  message: string
  category: Category
  scheduledFor: string
  scheduledTime: string
  type: 'EVENT' | 'BIRTHDAY' | 'ANNIVERSARY' | 'REMINDER'
}

type Category =
  | 'DATE' | 'RESTAURANT' | 'CAFE' | 'MOVIE' | 'TRAVEL' | 'SHOPPING'
  | 'ANNIVERSARY' | 'BIRTHDAY' | 'HOLIDAY' | 'FAMILY' | 'CONCERT'
  | 'WORKOUT' | 'PLAYTIME' | 'OTHER'


/* ---- Seed ---- */
function seedNotifications(): DemoNotification[] {
  const now = new Date()
  const addDays = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return d }
  return [
    {
      id: 'n1', title: 'Dinner tonight!', message: 'Remember, we\'re trying the new ramen spot at 7 PM. Don\'t forget!',
      category: 'RESTAURANT', scheduledFor: addDays(2).toISOString().slice(0, 10), scheduledTime: '19:00', type: 'EVENT',
    },
    {
      id: 'n2', title: 'Happy Birthday!', message: '6 months together and counting. Here\'s to many more! Love you',
      category: 'ANNIVERSARY', scheduledFor: addDays(3).toISOString().slice(0, 10), scheduledTime: '09:00', type: 'ANNIVERSARY',
    },
    {
      id: 'n3', title: 'Don\'t miss your flight', message: 'Your Bali trip starts tomorrow. Check in now if you haven\'t!',
      category: 'TRAVEL', scheduledFor: addDays(4).toISOString().slice(0, 10), scheduledTime: '20:00', type: 'REMINDER',
    },
    {
      id: 'n4', title: 'Movie night reminder', message: 'Studio Ghibli marathon starts at 8 PM. Popcorn is ready!',
      category: 'MOVIE', scheduledFor: addDays(5).toISOString().slice(0, 10), scheduledTime: '19:30', type: 'EVENT',
    },
    {
      id: 'n5', title: 'Coffee date', message: 'Sunday morning coffee before brunch? 10 AM at our usual spot.',
      category: 'CAFE', scheduledFor: addDays(7).toISOString().slice(0, 10), scheduledTime: '10:00', type: 'EVENT',
    },
  ]
}

const STORAGE_KEY = 'detto-demo-notifications'

/* ---- Dummy data pool ---- */
const DUMMY_NOTIFICATIONS: { title: string; message: string; category: Category; type: DemoNotification['type']; time: string }[] = [
  { title: 'Cafe date reminder', message: 'Meet at our usual spot at 10 AM. I already ordered your matcha.', category: 'CAFE', type: 'EVENT', time: '10:00' },
  { title: 'Pack your bags!', message: 'Bali trip is in 3 days. Don\'t forget sunscreen and the polaroid camera.', category: 'TRAVEL', type: 'REMINDER', time: '08:00' },
  { title: 'Happy 8 months!', message: 'Eight months of terrible jokes and late-night snacks. Here\'s to eighty more.', category: 'ANNIVERSARY', type: 'ANNIVERSARY', time: '00:00' },
  { title: 'Pottery class tonight', message: 'Remember to wear clothes you don\'t mind getting clay on. See you at 6!', category: 'DATE', type: 'EVENT', time: '17:00' },
  { title: 'Your turn to pick dinner', message: 'No takeout this time. Something we cook together.', category: 'RESTAURANT', type: 'EVENT', time: '18:30' },
  { title: 'Don\'t forget the vet', message: 'Noodle\'s appointment is tomorrow at 2 PM. I can take her if you\'re busy.', category: 'FAMILY', type: 'REMINDER', time: '20:00' },
  { title: 'Movie night!', message: 'The new Miyazaki film is streaming now. Popcorn duty is yours.', category: 'MOVIE', type: 'EVENT', time: '20:00' },
  { title: 'Flight check-in', message: 'We can check in 24 hours early. Let me do it — forwarding you the passes.', category: 'TRAVEL', type: 'REMINDER', time: '09:00' },
  { title: 'Happy Birthday, love!', message: 'Breakfast in bed is ready. Also, that package from the watch shop arrived.', category: 'BIRTHDAY', type: 'BIRTHDAY', time: '07:30' },
  { title: 'Long weekend plan', message: 'Let\'s drive to Bandung. Book the guesthouse before it\'s full.', category: 'HOLIDAY', type: 'REMINDER', time: '12:00' },
  { title: 'Concert tomorrow!', message: 'Doors open at 5 PM. I have the tickets on my phone. Wear comfortable shoes.', category: 'CONCERT', type: 'EVENT', time: '16:00' },
  { title: 'Laundry is done', message: 'Folded and sorted. Your hoodie is on the bed.', category: 'OTHER', type: 'REMINDER', time: '19:00' },
]

let dummyIdx = 0

/* ---- State ---- */
const notifications = ref<DemoNotification[]>([])
const currentDate = ref(new Date())
const isPlaying = ref(false)
const dismissedIds = ref<Set<string>>(new Set())
const showPopup = ref(false)
let playTimer: ReturnType<typeof setInterval> | null = null
const MIN_DAYS = -10
const MAX_DAYS = 20

/* ---- Load ---- */
function loadNotifications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: DemoNotification[] = JSON.parse(stored)
      notifications.value = parsed.length ? parsed : seedNotifications()
      return
    }
  } catch { /* ignore */ }
  const seed = seedNotifications()
  notifications.value = seed
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)) } catch { /* ignore */ }
}

watch(notifications, (val) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch { /* ignore */ }
}, { deep: true })

/* ---- Computed ---- */
const todaysNotifications = computed(() => {
  const dateStr = currentDate.value.toISOString().slice(0, 10)
  return notifications.value.filter(n => n.scheduledFor === dateStr && !dismissedIds.value.has(n.id))
})

const hasUnseen = computed(() => {
  const dateStr = currentDate.value.toISOString().slice(0, 10)
  return notifications.value.some(n => n.scheduledFor === dateStr && !dismissedIds.value.has(n.id))
})

const upcoming = computed(() =>
  notifications.value
    .filter(n => new Date(n.scheduledFor + 'T00:00:00') >= currentDate.value && !dismissedIds.value.has(n.id))
    .slice(0, 4),
)

const currentDaysDiff = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const current = new Date(currentDate.value)
  current.setHours(0, 0, 0, 0)
  return Math.round((current.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
})

const sliderValue = computed({
  get: () => Math.max(MIN_DAYS, Math.min(MAX_DAYS, currentDaysDiff.value)),
  set: (val) => {
    const clampedVal = Math.max(MIN_DAYS, Math.min(MAX_DAYS, val))
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + clampedVal)
    currentDate.value = newDate
  }
})

/* ---- Actions ---- */
function resetTime() {
  currentDate.value = new Date()
  isPlaying.value = false
  showPopup.value = false
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    showPopup.value = true
  }
}

function dismiss(id: string) {
  dismissedIds.value = new Set(dismissedIds.value).add(id)
  // Check if there are still unseen notifications for today
  const dateStr = currentDate.value.toISOString().slice(0, 10)
  const stillUnseen = notifications.value.some(n =>
    n.scheduledFor === dateStr && !dismissedIds.value.has(n.id)
  )
  showPopup.value = stillUnseen
}

function onSliderChange(e: Event) {
  const target = e.target as HTMLInputElement
  sliderValue.value = Number(target.value)
}

/* ---- Auto-play with bounds ---- */
watch(isPlaying, (playing) => {
  if (playTimer) { clearInterval(playTimer); playTimer = null }
  if (playing) {
    showPopup.value = true
    playTimer = setInterval(() => {
      const diff = currentDaysDiff.value
      if (diff >= MAX_DAYS) {
        // Auto-stop when reaching max bound
        isPlaying.value = false
        return
      }

      const d = new Date(currentDate.value)
      d.setDate(d.getDate() + 1)
      currentDate.value = d
    }, 800)
  }
})

watch(currentDate, (newDate) => {
  const diff = currentDaysDiff.value
  if (diff >= MAX_DAYS && isPlaying.value) {
    isPlaying.value = false
  }

  // Check if we hit a notification date while playing
  if (isPlaying.value) {
    const newDateStr = newDate.toISOString().slice(0, 10)
    const hasNotificationForNewDate = notifications.value.some(n =>
      n.scheduledFor === newDateStr && !dismissedIds.value.has(n.id)
    )

    if (hasNotificationForNewDate) {
      showPopup.value = true
    }
  }
})

function addDummyNotification() {
  const dummy = DUMMY_NOTIFICATIONS[dummyIdx % DUMMY_NOTIFICATIONS.length]
  dummyIdx++
  const addDays = Math.floor(Math.random() * 10) + 1
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + addDays)
  notifications.value.push({
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: dummy.title,
    message: dummy.message,
    category: dummy.category,
    scheduledFor: d.toISOString().slice(0, 10),
    scheduledTime: dummy.time,
    type: dummy.type,
  })
}

function formatDateLong(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

onMounted(() => {
  loadNotifications()
  // Ensure popup is hidden on initial load
  showPopup.value = false
  dismissedIds.value = new Set()
})
onUnmounted(() => { if (playTimer) clearInterval(playTimer) })
</script>

<template>
  <div class="detto-widget">
    <!-- Header -->
    <div class="widget-header">
      <h3 class="widget-title">Never Forgeting Thing You Planned Together</h3>
      <p class="widget-desc">Use the slider to travel through days.</p>
    </div>

    <!-- Current date display -->
    <div class="date-display">
      <div class="date-left">
        <div>
          <p class="date-label">Current Day</p>
          <p class="date-value">{{ formatDateLong(currentDate) }}</p>
        </div>
      </div>
      <div class="date-controls">
        <button class="ctrl-btn" @click="resetTime" title="Reset to today">&#8635;</button>
        <button class="ctrl-btn" :class="{ 'is-playing': isPlaying }" @click="togglePlay">
          <span v-if="isPlaying">&#10074;&#10074;</span>
          <span v-else>&#9658;</span>
        </button>
      </div>
    </div>

    <!-- Time slider -->
    <div class="slider-area">
      <div class="slider-header">
        <span class="slider-label">Timeline Slider</span>
        <span class="slider-desc">Slide to travel through dates</span>
      </div>
      <div class="slider-track-wrap">
        <div class="slider-track">
          <div class="slider-fill" :style="{ width: `${((sliderValue - MIN_DAYS) / (MAX_DAYS - MIN_DAYS)) * 100}%` }" />
        </div>
        <div v-for="n in notifications" :key="n.id" class="slider-dot" :class="{ dismissed: dismissedIds.has(n.id) }"
          :style="{ left: `${((new Date(n.scheduledFor + 'T00:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) - MIN_DAYS) / (MAX_DAYS - MIN_DAYS) * 100}%` }" />
        <div class="slider-thumb" :style="{ left: `${((sliderValue - MIN_DAYS) / (MAX_DAYS - MIN_DAYS)) * 100}%` }" />
        <input type="range" :min="MIN_DAYS" :max="MAX_DAYS" :value="sliderValue" @input="onSliderChange"
          class="slider-input" aria-label="Select date" />
      </div>
    </div>

    <!-- Notification indicator -->
    <Transition name="indicator">
      <div v-if="showPopup && hasUnseen" class="indicator-bar">
        <p>{{ todaysNotifications.length }} notification{{ todaysNotifications.length > 1 ? 's' : '' }} for today!</p>
      </div>
    </Transition>

    <!-- Upcoming list -->
    <div class="upcoming-section">
      <div class="upcoming-header">
        <h4 class="section-subtitle">Upcoming Event</h4>
        <button class="add-btn-sm" @click="addDummyNotification" aria-label="Add notification">+</button>
      </div>
      <div v-for="n in upcoming" :key="n.id" class="upcoming-item">
        <div class="upcoming-content">
          <span class="event-cat">{{ n.category }}</span>
          <p class="upcoming-title">{{ n.title }}</p>
          <p class="upcoming-meta">{{ formatDateShort(n.scheduledFor) }} at {{ n.scheduledTime }}</p>
        </div>
      </div>
    </div>

    <!-- Notification popup -->
    <Teleport to="body">
      <Transition name="popup">
        <div v-if="showPopup && hasUnseen && todaysNotifications[0]" class="notification-popup">
          <div class="popup-header">
            <div class="popup-brand">
              Detto Notification
            </div>
            <span class="popup-time">now</span>
          </div>
          <div class="popup-body">
            <div class="popup-content">
              <h3 class="popup-title">{{ todaysNotifications[0].title }}</h3>
              <p class="popup-message">{{ todaysNotifications[0].message }}</p>
            </div>
          </div>
          <div class="popup-actions">
            <button class="popup-dismiss" @click="dismiss(todaysNotifications[0]!.id)">Dismiss</button>
            <button class="popup-view" @click="dismiss(todaysNotifications[0]!.id)">
              View &#10140;
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  padding: 20px;
  width: 100%;
  max-width: clamp(320px, 90vw, 400px);
  margin: 0 auto;
}

.widget-header {
  margin-bottom: 16px;
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

.date-display {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.date-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-icon {
  font-size: 1.25rem;
}

.date-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-sec);
}

.date-value {
  font-size: .9em;
  font-weight: 700;
  color: var(--text);
}

.date-controls {
  display: flex;
  gap: 8px;
}

.ctrl-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--border);
  background: var(--surface-alt);
  color: var(--text);
  cursor: pointer;
  font-size: 1rem;
  transition: all 150ms;
}

.ctrl-btn.is-playing {
  background: var(--accent);
  color: #1F2B27;
  border-color: var(--accent);
}

.ctrl-btn:active {
  transform: scale(0.96);
}

.slider-area {
  margin-bottom: 20px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.slider-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-sec);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.slider-desc {
  font-size: 0.9rem;
  color: var(--text-sec);
}

.slider-track-wrap {
  position: relative;
  padding: 10px 0;
}

.slider-track {
  height: 6px;
  border-radius: 999px;
  background: var(--border);
  position: relative;
}

.slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--accent);
  border-radius: 999px;
}

.slider-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: black;
  transition: all 200ms;
}

.slider-dot.dismissed {
  width: 6px;
  height: 6px;
  background: var(--border);
  box-shadow: none;
}

.slider-thumb {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1F2B27;
  border: 3px solid var(--accent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1;
}

.slider-input {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
  margin: 0;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}

.slider-label-text {
  font-size: 0.7rem;
  color: var(--text-sec);
}

.slider-label-text.is-center {
  font-weight: 700;
}

.indicator-bar {
  background: var(--accent-soft);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.indicator-bar p {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
}

.indicator-enter-active,
.indicator-leave-active {
  transition: all 200ms ease;
}

.indicator-enter-from,
.indicator-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.upcoming-section {
  margin-bottom: 16px;
}

.upcoming-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.add-btn-sm {
  width: 35px;
  height: 35px;
  border-radius: 15%;
  background: var(--accent);
  color: #1F2B27;
  border: none;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-btn-sm:active {
  transform: scale(0.96);
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  position: relative;
  border-radius: var(--radius-md);
  background: var(--surface);
  margin-bottom: 6px;
  border: 1px solid var(--border);
}

.upcoming-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-meta {
  font-size: 0.9rem;
  color: var(--text-sec);
}

.event-cat {
  position: absolute;
  top: 10;
  height: fit-content;
  right: 10px;
  background-color: #fe6b5e;
  width: fit-content;
  padding: 2px 10px;
  font-size: .8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: white;
  border-radius: 15px;
}

/* Popup */
.notification-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: 0 30px 60px rgba(16, 21, 18, 0.28);
  border: 1px solid var(--border);
  z-index: 1000;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.popup-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-sec);
}

.popup-icon {
  color: var(--accent);
}

.popup-time {
  font-size: 1rem;
  color: var(--text-sec);
  padding: 2px 6px;
  border-radius: 8px;
  background: var(--surface-alt);
}

.popup-body {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.popup-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.popup-content {
  flex: 1;
  min-width: 0;
}

.popup-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  line-height: 1.3;
}

.popup-message {
  font-size: 1.2rem;
  color: var(--text-sec);
  line-height: 1.45;
}

.popup-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.popup-dismiss {
  background: transparent;
  border: none;
  color: var(--text-sec);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  font-family: inherit;
}

.popup-view {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--accent);
  color: #1F2B27;
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.popup-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.popup-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
</style>
