<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import NallaOrnament from '@/components/nalla/NallaOrnament.vue'

// Batas maksimum tamu — loop berhenti saat jumlah cap tercapai.
const MAX_GUESTS = 300
const START_GUESTS = 176

const view = ref<'phone' | 'dash'>('phone')
const tapping = ref(false)
const pop = ref<'idle' | 'out'>('idle')
const confirmed = ref(START_GUESTS)
const bumpKey = ref(0)

const timers: number[] = []
let disposed = false

function after(ms: number, fn: () => void) {
  const id = window.setTimeout(() => {
    if (!disposed) fn()
  }, ms)
  timers.push(id)
}

/**
 * Siklus demo (port setia dari PhoneRsvp nalla):
 * 1. Phone menampilkan undangan dengan CTA "Confirm Attendance".
 * 2. CTA terlihat "disentuh" (tekan + ripple), lalu phone mundur.
 * 3. Kartu dashboard muncul, hitungan konfirmasi naik satu.
 * 4. Tahan ~5 detik, kembali ke phone — loop terus berjalan.
 */
function runCycle() {
  after(2600, () => {
    tapping.value = true // tekan tombol + ripple (~0.5s)

    after(500, () => {
      pop.value = 'out' // phone mundur (0.35s)

      after(350, () => {
        view.value = 'dash'
        pop.value = 'idle'
        tapping.value = false

        after(500, () => {
          confirmed.value = Math.min(confirmed.value + 1, MAX_GUESTS)
          bumpKey.value += 1 // pemicu animasi count-bump

          after(5000, () => {
            pop.value = 'out'

            after(350, () => {
              if (confirmed.value >= MAX_GUESTS) confirmed.value = START_GUESTS
              view.value = 'phone'
              pop.value = 'idle'
              runCycle()
            })
          })
        })
      })
    })
  })
}

onMounted(runCycle)

onUnmounted(() => {
  disposed = true
  timers.forEach(clearTimeout)
})

const animClass = computed(() => (pop.value === 'out' ? 'anim-pop-out' : 'anim-pop-in'))
const pct = computed(() => Math.round((confirmed.value / MAX_GUESTS) * 100))
</script>

<template>
  <div class="nalla-scope rsvp-demo flex flex-1 justify-center">
    <!-- Phone view: undangan dengan CTA -->
    <div v-if="view === 'phone'" class="relative w-full overflow-hidden" :class="animClass"
      style="aspect-ratio: 12 / 11; border-radius: 34px 34px 0 0; box-shadow: 0 14px 30px rgba(20, 18, 15, 0.22)">
      <!-- Bingkai ganda -->
      <div class="pointer-events-none absolute" style="inset: 7px; border-top-left-radius: 20px; border-top-right-radius: 20px; border: 1px solid #465955; opacity: 0.55; border-bottom: 0" />

      <div class="relative flex h-full w-full flex-col items-center justify-between px-3 pb-4 pt-5 text-center"
        style="background: #fbf9f4">
        <!-- Ornamen + heading -->
        <div class="relative flex flex-col items-center gap-1 pt-1">
          <NallaOrnament name="3" class="w-[52px] opacity-90" />
          <span class="text-[8px] font-bold uppercase tracking-[0.24em]" style="color: #959d90">
            The Wedding Of
          </span>
          <div class="h-px w-9" style="background: #465955; opacity: 0.55" />
        </div>

        <!-- Nama mempelai -->
        <div class="relative flex flex-col items-center gap-1">
          <span class="text-[19px] font-extrabold leading-tight" style="font-family: var(--n-font-display); color: #2b3a33">
            Rizky
          </span>
          <span class="flex items-center gap-1.5">
            <span class="h-px w-6" style="background: #465955; opacity: 0.6" />
            <span class="text-[12px]" style="font-family: var(--n-font-display); color: #465955">&amp;</span>
            <span class="h-px w-6" style="background: #465955; opacity: 0.6" />
          </span>
          <span class="text-[19px] font-extrabold leading-tight" style="font-family: var(--n-font-display); color: #2b3a33">
            Miya
          </span>
        </div>

        <!-- CTA — terlihat "disentuh" dengan tekan + ripple -->
        <div class="relative w-full">
          <span v-if="tapping" class="anim-ripple pointer-events-none absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
          <div class="relative mx-auto w-[80%] overflow-hidden rounded-lg px-3 py-2.5 text-[11px] font-bold text-white"
            :class="{ 'anim-btn-tap': tapping }"
            :style="{ background: '#465955', boxShadow: tapping ? '0 2px 6px rgba(70,89,85,0.3)' : '0 6px 14px rgba(70,89,85,0.4)' }">
            Confirm Attendance
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard view: kartu dasbor tuan rumah -->
    <div v-else class="w-full" :class="animClass">
      <div class="flex h-full w-full flex-col gap-3 border p-4"
        style="border-color: var(--n-line); background: var(--n-cream); border-radius: 18px; box-shadow: 0 14px 32px rgba(43, 58, 51, 0.12)">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <span class="text-[14px] font-extrabold" style="font-family: var(--n-font-display); color: var(--n-ink)">
            Dashboard
          </span>
          <span class="flex items-center gap-1 text-[10px] font-medium text-green-600">
            <span class="h-1.5 w-1.5 rounded-full bg-green-500" />
            live
          </span>
        </div>

        <!-- Stat utama: konfirmasi hadir -->
        <div class="rounded-xl border bg-white p-3" style="border-color: var(--n-line); box-shadow: 0 6px 18px rgba(43, 58, 51, 0.08)">
          <span class="block text-[11px] font-medium" style="color: var(--n-ink-soft)">
            RSVPs Confirmed
          </span>
          <div class="mt-0.5 flex items-baseline gap-1.5">
            <span :key="bumpKey" class="anim-count-bump text-[30px] font-extrabold leading-none"
              style="font-family: var(--n-font-display); color: var(--n-primary)">
              {{ confirmed }}
            </span>
            <span class="text-[12px] font-medium" style="color: var(--n-ink-soft)">/ {{ MAX_GUESTS }}</span>
          </div>
          <!-- Progress bar -->
          <div class="mt-2 h-2 w-full overflow-hidden rounded-full" style="background: var(--n-line)">
            <div class="h-full rounded-full transition-all duration-700" style="background: var(--n-primary)" :style="{ width: pct + '%' }" />
          </div>
        </div>

        <!-- Stat sekunder -->
        <div class="grid flex-1 grid-cols-2 gap-2">
          <div class="flex flex-col justify-center rounded-sm border bg-white px-2.5" style="border-color: var(--n-line)">
            <span class="block text-[10px] font-medium" style="color: var(--n-ink-soft)">
              Invitations Opened
            </span>
            <div>
              <span class="text-[25px] font-bold" style="font-family: var(--n-font-display); color: var(--n-gold)">
                {{ confirmed === MAX_GUESTS ? MAX_GUESTS : confirmed + 14 }}
              </span>
              <span class="text-[10px] font-bold opacity-80" style="color: var(--n-ink)">/{{ MAX_GUESTS }}</span>
            </div>
          </div>
          <div class="flex flex-col justify-center rounded-sm border bg-white px-2.5" style="border-color: var(--n-line)">
            <span class="block text-[10px] font-medium" style="color: var(--n-ink-soft)">
              Wishes Received
            </span>
            <div>
              <span class="text-[25px] font-bold" style="font-family: var(--n-font-display); color: var(--n-gold)">
                {{ Math.max(confirmed - 60, 0) }}
              </span>
              <span class="text-[10px] font-bold opacity-80" style="color: var(--n-ink)"> Wishes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nalla-scope {
  /* Pin skala nalla (Porto: root 62.5% + radius Naoto) — lihat GuestCamera */
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
  --n-gold: #e8c065;
  --n-gold-dark: #c99a3e;
  --n-font-display: Prata, 'Playfair Display', Georgia, 'Times New Roman', serif;
}

/* Pop in/out — pergantian phone ↔ kartu dashboard */
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pop-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.82);
  }
}

.anim-pop-in {
  animation: pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.anim-pop-out {
  animation: pop-out 0.35s cubic-bezier(0.4, 0, 1, 1) forwards;
}

/* Tombol disentuh — tekan + ripple */
@keyframes btn-tap {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(0.88);
  }
  100% {
    transform: scale(0.92);
  }
}

.anim-btn-tap {
  animation: btn-tap 0.45s ease-out forwards;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}

.anim-ripple {
  animation: ripple 0.5s ease-out forwards;
}

/* Highlight singkat saat angka bertambah */
@keyframes count-bump {
  0% {
    transform: scale(1);
    color: var(--n-gold-dark);
  }
  40% {
    transform: scale(1.3);
    color: var(--n-gold);
  }
  100% {
    transform: scale(1);
    color: var(--n-primary);
  }
}

.anim-count-bump {
  animation: count-bump 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .anim-pop-in,
  .anim-pop-out,
  .anim-btn-tap,
  .anim-ripple,
  .anim-count-bump {
    animation: none;
  }
}
</style>
