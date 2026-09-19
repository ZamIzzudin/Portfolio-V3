<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/* ---- Types ---- */
interface DemoNote {
  id: string
  message: string
  author: string
  color: string
  createdAt: number
  expiresAt: number
}

const STORAGE_KEY = 'detto-demo-notes'
const SWIPE_THRESHOLD = 50

const PALETTE = ['#fe6b5e', '#4B8B6B', '#E8B84B', '#465955', '#9F7AEA']
function pickColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function getTimeRemaining(expiresAt: number): string {
  const diff = expiresAt - Date.now()
  if (diff <= 0) return 'expired'
  const minutes = Math.floor(diff / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  if (minutes > 0) return `${minutes}m ${seconds}s left`
  return `${seconds}s left`
}

/* ---- Seed ---- */
function seedNotes(): DemoNote[] {
  const now = Date.now()
  return [
    { id: 'n1', message: 'Picked up your favourite croissants for breakfast. Don\'t skip coffee again', author: 'Aldy', color: '#fe6b5e', createdAt: now - 1000 * 60 * 60 * 2, expiresAt: now + 1000 * 60 * 8 },
    { id: 'n2', message: 'Rescheduled the dentist for Saturday morning so we have Friday night free. Movie pick is yours', author: 'Vira', color: '#4B8B6B', createdAt: now - 1000 * 60 * 60 * 5, expiresAt: now + 1000 * 60 * 12 },
    { id: 'n3', message: 'Saw a puppy that looked exactly like the one we said we\'d adopt one day. Took a photo, will show you later.', author: 'Aldy', color: '#E8B84B', createdAt: now - 1000 * 60 * 30, expiresAt: now + 1000 * 60 * 9 },
  ]
}

/* ---- Dummy data pool ---- */
const DUMMY_NOTES: { message: string; author: string }[] = [
  { message: 'Left your favourite snacks on the desk. Don\'t skip lunch again today.', author: 'Aldy' },
  { message: 'The laundry is done and folded. Your lucky socks are on top.', author: 'Vira' },
  { message: 'Booked us that pottery class you kept sending me reels about. Saturday at 3.', author: 'Aldy' },
  { message: 'Found a stray cat near the parking lot. Named it Noodle. Sent you a photo.', author: 'Vira' },
  { message: 'Your mom called — she said she misses us. Let\'s visit this weekend?', author: 'Aldy' },
  { message: 'I fixed the Wi-Fi. You\'re welcome.', author: 'Vira' },
  { message: 'Saw the sunrise today and thought of you. Wish you were beside me.', author: 'Aldy' },
  { message: 'Picked up extra coffee. The barista gave me a free cookie. Split it later?', author: 'Vira' },
  { message: 'Your turn to choose the movie tonight. No Ghibli this time — I picked last time.', author: 'Aldy' },
  { message: 'Watered the plants. The monstera is getting huge. Send regards to Mr Monstera.', author: 'Vira' },
  { message: 'Just remembered that silly thing you said at dinner. Still laughing.', author: 'Aldy' },
  { message: 'The cake turned out amazing! Save some for me or I\'m telling everyone.', author: 'Vira' },
]

let dummyIdx = 0

/* ---- State ---- */
const notes = ref<DemoNote[]>([])
const activeIndex = ref(0)
const now = ref(Date.now())
let tickTimer: ReturnType<typeof setInterval> | null = null

/* ---- Swipe tracking ---- */
const swipeX = ref(0)
const startX = ref(0)
const isSwiping = ref(false)
const isLeaving = ref(false)
let leaveTimer: ReturnType<typeof setTimeout> | null = null

/* ---- Load ---- */
function loadNotes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) { notes.value = JSON.parse(stored); return }
  } catch { /* ignore */ }
  const seed = seedNotes()
  notes.value = seed
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)) } catch { /* ignore */ }
}

watch(notes, (val) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch { /* ignore */ }
}, { deep: true })

/* ---- Computed ---- */
const activeNote = computed(() => notes.value[activeIndex.value] ?? null)

/** Kartu di belakang kartu aktif — note berikutnya yang terungkap setelah swipe */
const peekNotes = computed(() => {
  const count = Math.min(notes.value.length - 1, 2)
  return Array.from({ length: count }, (_, i) => notes.value[(activeIndex.value + i + 1) % notes.value.length])
})

/** Transform kartu aktif: ikuti jari saat drag, melayang keluar saat dismiss */
const cardStyle = computed(() => ({
  transform: `translateX(${swipeX.value}px) rotate(${swipeX.value / 24}deg)`,
  opacity: isLeaving.value ? 0 : 1 - Math.min(Math.abs(swipeX.value) / 300, 0.4),
  zIndex: Math.min(notes.value.length, 3) + 1,
}))

/* ---- Actions ---- */
function dismissActive() {
  const note = activeNote.value
  if (!note) return
  isLeaving.value = true
  swipeX.value = swipeX.value > 0 ? 480 : -480
  leaveTimer = setTimeout(() => {
    notes.value = notes.value.filter(n => n.id !== note.id)
    if (activeIndex.value >= notes.value.length) {
      activeIndex.value = Math.max(0, notes.value.length - 1)
    }
    isLeaving.value = false
    swipeX.value = 0
  }, 320)
}

function addDummyNote() {
  const dummy = DUMMY_NOTES[dummyIdx % DUMMY_NOTES.length]
  dummyIdx++
  const t = Date.now()
  const note: DemoNote = {
    id: `n_${t}_${Math.random().toString(36).slice(2, 6)}`,
    message: dummy.message,
    author: dummy.author,
    color: pickColor(dummy.author),
    createdAt: t,
    expiresAt: t + (8 + Math.floor(Math.random() * 20)) * 60_000,
  }
  notes.value.unshift(note)
  activeIndex.value = 0
}

/* ---- Swipe ---- */
function onPointerDown(e: PointerEvent) {
  if (isLeaving.value) return
  startX.value = e.clientX
  swipeX.value = 0
  isSwiping.value = true
  // Tangkap pointer agar drag tetap terlacak walau jari keluar dari kartu
  ;(e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId)
}
function onPointerMove(e: PointerEvent) {
  if (!isSwiping.value || isLeaving.value) return
  swipeX.value = e.clientX - startX.value
}
function onPointerUp() {
  if (!isSwiping.value || isLeaving.value) return
  isSwiping.value = false
  if (Math.abs(swipeX.value) > SWIPE_THRESHOLD) dismissActive()
  else swipeX.value = 0
}

/* ---- Lifecycle ---- */
onMounted(() => {
  loadNotes()
  tickTimer = setInterval(() => { now.value = Date.now() }, 30_000)
})
onUnmounted(() => {
  if (tickTimer) clearInterval(tickTimer)
  if (leaveTimer) clearTimeout(leaveTimer)
})

/* ---- Prune expired ---- */
watch(now, () => {
  const expired = notes.value.some(n => n.expiresAt <= Date.now())
  if (expired) {
    notes.value = notes.value.filter(n => n.expiresAt > Date.now())
    if (activeIndex.value >= notes.value.length) activeIndex.value = Math.max(0, notes.value.length - 1)
  }
})
</script>

<template>
  <div class="detto-widget">
    <!-- Header -->
    <div class="widget-header">
      <h3 class="widget-title">Say something short</h3>
      <p class="widget-desc">Each note disappears after a while. Swipe one away to clear it from the stack.</p>
    </div>

    <div v-if="notes.length === 0" class="empty-row">
      <div>
        <p class="empty-title">No notes right now</p>
        <p class="empty-desc">Leave a quick note for your partner.</p>
      </div>
      <button class="add-btn" @click="addDummyNote">+</button>
    </div>

    <template v-else>
      <!-- Card stack -->
      <div class="stack-area">
        <!-- Peek cards behind -->
        <div v-for="(note, i) in peekNotes" :key="`bg-${note.id}`" class="peek-card" :style="{
          transform: `translateY(${(i + 1) * 10}px) translateX(${(i + 1) * 6}px) scale(${1 - (i + 1) * 0.04})`,
          opacity: 1 - (i + 1) * 0.3,
          zIndex: Math.min(notes.length, 3) - (i + 1),
        }">
          <div class="peek-inner">
            <div class="peek-avatar" :style="{ background: note.color }">
              {{ note.author.charAt(0).toUpperCase() }}
            </div>
            <span class="peek-author">{{ note.author }}</span>
          </div>
        </div>

        <!-- Active card (:key me-remount elemen saat note berganti, agar tidak ada animasi fly-in liar) -->
        <div v-if="activeNote" :key="activeNote.id" class="swipe-card" :class="{ dragging: isSwiping }"
          :style="cardStyle" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp"
          @pointercancel="onPointerUp">
          <div class="note-card">
            <div class="note-top">
              <div class="note-author-area">
                <div class="note-avatar" :style="{ background: activeNote.color }">
                  {{ activeNote.author.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="note-author-name">{{ activeNote.author }}</p>
                  <p class="note-time">{{ getTimeRemaining(activeNote.expiresAt) }}</p>
                </div>
              </div>

            </div>

            <p class="note-message">{{ activeNote.message }}</p>
          </div>

          <!-- Swipe indicator -->
          <div v-if="Math.abs(swipeX) > 20" class="swipe-indicator" :class="{ left: swipeX > 0, right: swipeX < 0 }">
            dismiss
          </div>
        </div>
      </div>

      <!-- Pagination + add -->
      <div class="pagination-row">
        <div class="dots">
          <span v-for="(n, i) in notes" :key="n.id" class="dot" :class="{ active: i === activeIndex }" />
        </div>
        <button class="add-btn" @click="addDummyNote">+</button>
      </div>
      <p class="swipe-hint italic">swipe a note away to dismiss it</p>
    </template>

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
  max-width: 400px;
  margin: 0 auto;
}

.widget-header {
  margin-bottom: 16px;
}

.widget-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  margin: 4px 0 0 0;
}

.widget-desc {
  font-size: 1rem;
  color: var(--text-sec);
  margin-top: 4px;
}

.empty-row {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text);
}

.empty-desc {
  font-size: 0.9rem;
  color: var(--text-sec);
  margin-top: 2px;
}

.add-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  color: #1F2B27;
  border: none;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-btn:active {
  transform: scale(0.96);
}

.stack-area {
  position: relative;
  min-height: fit-content;
}

.peek-card {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  pointer-events: none;
}

.peek-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.peek-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.peek-author {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text);
}

.swipe-card {
  position: relative;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 320ms ease-out;
}

/* Saat digendong jari/kursor: ikut 1:1 tanpa easing */
.swipe-card.dragging {
  cursor: grabbing;
  transition: none;
}

.note-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: 0 10px 30px rgba(16, 21, 18, 0.12);
}

.note-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.note-author-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.note-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.note-author-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
}

.note-time {
  font-size: 0.9rem;
  color: var(--text-sec);
}

.note-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-sec);
  cursor: pointer;
  font-size: 0.9rem;
}

.action-btn:active {
  transform: scale(0.9);
}

.note-message {
  font-size: 1.2rem;
  line-height: 1.55;
  color: var(--text);
  text-align: justify;
}

.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
}

.swipe-indicator.left {
  left: 16px;
}

.swipe-indicator.right {
  right: 16px;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 0 4px;
}

.dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--border);
  transition: all 300ms;
}

.dot.active {
  width: 20px;
  background: var(--accent);
}

.swipe-hint {
  text-align: center;
  margin-top: 12px;
  font-size: 1rem;
  color: var(--text-sec);
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
</style>
