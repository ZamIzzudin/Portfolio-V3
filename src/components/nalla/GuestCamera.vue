<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import cameraFeed from '@/assets/nalla/hero-c.mp4'

/** Kapasitas kamera sekali pakai tiap tamu. */
const MAX_SHOTS = 20
/** Jumlah slot yang tampil di strip film. */
const STRIP_SLOTS = 6

interface Shot {
  id: number
  src: string
}

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const shots = ref<Shot[]>([])
const flashKey = ref(0)
const reduceMotion = ref(false)
let shotId = 0

let mql: MediaQueryList | null = null
const onMqlChange = () => {
  reduceMotion.value = mql?.matches ?? false
}

onMounted(() => {
  mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = mql.matches
  mql.addEventListener('change', onMqlChange)
})

onUnmounted(() => {
  mql?.removeEventListener('change', onMqlChange)
})

const isFull = computed(() => shots.value.length >= MAX_SHOTS)
const latestId = computed(() => shots.value[shots.value.length - 1]?.id)

/** Ambil satu bingkai dari umpan video (potret, crop tengah) → data URL. */
function grabFrame(): string {
  const video = videoRef.value
  const canvas = canvasRef.value
  const fallback = '#2b3a33'
  if (!canvas) return fallback

  const width = 240
  const height = 320
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return fallback

  ctx.fillStyle = fallback
  ctx.fillRect(0, 0, width, height)

  if (video && video.readyState >= 2 && video.videoWidth) {
    const vw = video.videoWidth
    const vh = video.videoHeight
    const targetRatio = width / height
    const videoRatio = vw / vh
    let sw = vw
    let sh = vh
    let sx = 0
    let sy = 0
    if (videoRatio > targetRatio) {
      sw = vh * targetRatio
      sx = (vw - sw) / 2
    } else {
      sh = vw / targetRatio
      sy = (vh - sh) / 2
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, width, height)
  }

  return canvas.toDataURL('image/jpeg', 0.82)
}

function takePhoto() {
  if (isFull.value) return
  shotId += 1
  shots.value = [...shots.value, { id: shotId, src: grabFrame() }]
  flashKey.value += 1
}

function resetRoll() {
  shots.value = []
  shotId = 0
}

const padded = computed<(Shot | null)[]>(() => {
  const visible = shots.value.slice(-STRIP_SLOTS)
  const empties: null[] = Array.from(
    { length: Math.max(0, STRIP_SLOTS - visible.length) },
    () => null,
  )
  return [...empties, ...visible]
})
</script>

<template>
  <div class="nalla-scope guest-camera relative">
    <!-- Glow lembut di belakang gawai -->
    <span class="cam-glow pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full" />

    <!-- Gawai -->
    <div class="relative mx-auto w-[248px] sm:w-[280px]" style="aspect-ratio: 9 / 19">
      <div class="cam-body absolute inset-0 p-[7px]" style="border-radius: 44px">
        <div class="cam-screen relative flex h-full w-full flex-col overflow-hidden" style="border-radius: 37px">
          <!-- Notch -->
          <span class="absolute left-1/2 top-2.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black/50" />

          <!-- Header -->
          <div class="flex items-center gap-2.5 px-4 pb-3 pt-9">
            <span class="cam-avatar flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold">
              S
            </span>
            <div class="min-w-0 flex-1 text-left">
              <p class="cam-paper-text truncate text-[12px] font-bold leading-tight">
                Sari's Camera
              </p>
              <p class="cam-paper-dim truncate text-[10px] leading-tight">
                Nadia &amp; Raka
              </p>
            </div>
            <span class="cam-counter shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors" :class="isFull ? 'is-full' : ''">
              {{ shots.length }} / {{ MAX_SHOTS }}
            </span>
          </div>

          <!-- Bingkai bidik — umpan kamera -->
          <div class="cam-viewfinder relative mx-3 flex-1 overflow-hidden" style="border-radius: 18px">
            <video
              ref="videoRef"
              class="absolute inset-0 h-full w-full object-cover object-center"
              :src="cameraFeed"
              :autoplay="!reduceMotion"
              muted
              loop
              playsinline
              preload="auto"
              disablepictureinpicture
            />
            <span class="pointer-events-none absolute inset-0 bg-black/10" />

            <!-- Bidik & garis bantu -->
            <span class="vf-corner pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl-md border-l-2 border-t-2" />
            <span class="vf-corner pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-tr-md border-r-2 border-t-2" />
            <span class="vf-corner pointer-events-none absolute bottom-3 left-3 h-5 w-5 rounded-bl-md border-b-2 border-l-2" />
            <span class="vf-corner pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-md border-b-2 border-r-2" />
            <span class="vf-center pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-lg border" />

            <!-- Petunjuk / status -->
            <span class="vf-hint pointer-events-none absolute inset-x-0 bottom-3 text-center text-[10px] font-medium tracking-wide">
              {{ isFull ? 'Roll complete — every shot is in' : `${MAX_SHOTS - shots.length} shots left today` }}
            </span>

            <!-- Kilatan rana -->
            <span v-if="flashKey > 0" :key="flashKey" class="shutter-flash pointer-events-none absolute inset-0 bg-white" />
          </div>

          <!-- Strip film — jepretan yang sudah diambil -->
          <div class="flex items-center gap-1.5 px-4 pb-1 pt-3">
            <template v-for="(shot, i) in padded" :key="shot ? shot.id : `empty-${i}`">
              <img v-if="shot" :src="shot.src" alt="" class="film-shot h-9 flex-1 rounded-md object-cover"
                :class="{ 'shot-pop': shot.id === latestId }" />
              <span v-else class="film-empty h-9 flex-1 rounded-md border" />
            </template>
          </div>

          <!-- Kontrol rana -->
          <div class="flex items-center justify-between px-7 pb-6 pt-3">
            <button v-if="shots.length > 0" type="button" class="cam-mini-btn flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
              aria-label="Start a new roll" @click="resetRoll">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 2v6h6" />
                <path d="M3.5 13a9 9 0 1 0 2.3-6.4L3 8" />
              </svg>
            </button>
            <span v-else class="h-8 w-8 rounded-md border" />

            <button type="button" :disabled="isFull" :aria-label="isFull ? 'Camera roll is full' : 'Take a photo'"
              class="shutter-btn group relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] transition-transform duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-45"
              @click="takePhoto">
              <span class="h-11 w-11 rounded-full transition-colors group-active:bg-[var(--n-gold)]" style="background: var(--n-paper)" />
              <!-- denyut lembut sebagai ajakan menekan -->
              <span v-if="!isFull && shots.length === 0" class="pulse-ring absolute inset-0 rounded-full border-2" />
            </button>

            <span v-if="isFull" class="flex h-8 w-8 items-center justify-center rounded-md border" style="border-color: rgba(232, 192, 101, 0.5); color: var(--n-gold)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <span v-else class="h-8 w-8 rounded-md border" />
          </div>
        </div>
      </div>
    </div>

    <!-- Kanvas tersembunyi untuk menangkap bingkai video -->
    <canvas ref="canvasRef" class="hidden" aria-hidden="true" />
  </div>
</template>

<style scoped>
/* ---- Design token Nalla (scoped ke komponen demo) ----
   Porto memakai root font-size 62.5% (1rem = 10px) dan meng-override
   --radius-* di @theme; nalla merender pada root 16px dengan skala sendiri.
   Pin ulang token Tailwind dalam px agar ukuran identik dengan referensi. */
.nalla-scope {
  --spacing: 4px;
  --radius: 4px;
  --radius-xs: 2px;
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --n-cream: #f5f1ea;
  --n-paper: #fbf9f4;
  --n-ink: #2b3a33;
  --n-ink-soft: #959d90;
  --n-line: #e6ddcf;
  --n-primary: #465955;
  --n-primary-dark: #36433f;
  --n-gold: #e8c065;
  --n-gold-dark: #c99a3e;
  --n-gold-soft: #f0d99a;
  --n-font-display: Prata, 'Playfair Display', Georgia, 'Times New Roman', serif;
}

.guest-camera {
  color: var(--n-paper);
}

.cam-glow {
  background: rgba(232, 192, 101, 0.15);
  filter: blur(64px);
}

.cam-body {
  background: var(--n-paper);
  box-shadow: 0 14px 32px rgba(43, 58, 51, 0.12);
  border: 1px solid rgba(232, 192, 101, 0.4);
}

.cam-screen {
  background: #1f2a26;
}

.cam-avatar {
  background: var(--n-gold);
  color: var(--n-primary-dark);
  font-family: var(--n-font-display);
}

.cam-paper-text {
  color: var(--n-paper);
}

.cam-paper-dim {
  color: rgba(251, 249, 244, 0.55);
}

.cam-counter {
  border-color: rgba(232, 192, 101, 0.4);
  background: rgba(232, 192, 101, 0.15);
  color: var(--n-gold);
}

.cam-counter.is-full {
  border-color: var(--n-gold);
  background: var(--n-gold);
  color: var(--n-primary-dark);
}

.cam-viewfinder {
  background: #2b3a33;
}

.vf-corner {
  border-color: rgba(232, 192, 101, 0.7);
}

.vf-center {
  border-color: rgba(232, 192, 101, 0.5);
}

.vf-hint {
  color: rgba(251, 249, 244, 0.7);
}

/* Reset img global Porto (height:auto, TANPA @layer) menimpa utility Tailwind
   yang berlayer — h-9 kalah dan foto dirender setinggi ukuran intrinsiknya.
   Pin eksplisit mengikuti token spacing agar strip tetap setinggi h-9 (36px). */
.film-shot {
  height: calc(var(--spacing) * 9);
}

.film-empty {
  border-color: rgba(251, 249, 244, 0.1);
  background: rgba(251, 249, 244, 0.05);
}

.cam-mini-btn {
  border-color: rgba(251, 249, 244, 0.2);
  color: rgba(251, 249, 244, 0.6);
}

.cam-mini-btn:hover {
  border-color: rgba(232, 192, 101, 0.5);
  color: var(--n-gold);
}

.shutter-btn {
  border-color: rgba(251, 249, 244, 0.8);
}

.pulse-ring {
  border-color: rgba(232, 192, 101, 0.5);
  animation: gc-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Kilatan rana */
@keyframes shutter-flash {
  from {
    opacity: 0.9;
  }
  to {
    opacity: 0;
  }
}

.shutter-flash {
  animation: shutter-flash 0.42s ease-out forwards;
}

/* Jepretan baru masuk ke strip film */
@keyframes shot-pop {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.82);
  }
  60% {
    opacity: 1;
    transform: translateY(0) scale(1.06);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.shot-pop {
  animation: shot-pop 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Denyut lembut */
@keyframes gc-ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.pulse-ring {
  border-color: rgba(232, 192, 101, 0.5);
  animation: gc-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .shutter-flash,
  .shot-pop,
  .pulse-ring {
    animation: none;
  }
}
</style>
