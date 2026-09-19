<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import NallaOrnament from '@/components/nalla/NallaOrnament.vue'

// Daftar tamu yang akan "check-in" bergantian.
const guests = ['Hendra Wijaya', 'Mario Rudy', 'Salsa & Bima', 'Nuno Alwi', 'Yuni & Bayu']

const view = ref<'scan' | 'welcome'>('scan')
const scanning = ref(false)
const flash = ref(false)
const pop = ref<'idle' | 'out'>('idle')
const guestIndex = ref(0)

const timers: number[] = []
let disposed = false

function after(ms: number, fn: () => void) {
  const id = window.setTimeout(() => {
    if (!disposed) fn()
  }, ms)
  timers.push(id)
}

/**
 * Siklus demo (port setia dari PhoneCheckin nalla):
 * 1. QR tampil sebagai fokus awal.
 * 2. Phone mockup naik dari kanan-bawah membuka scanner — layar kamera
 *    transparan sehingga QR terlihat menembus. Scan line menyapu + beam berdenyut.
 * 3. Kilatan emas mengonfirmasi hasil baca.
 * 4. QR + phone mundur, kartu "Welcome" muncul dengan nama tamu.
 * 5. Tahan, lalu tamu berikutnya mulai discan.
 */
function runCycle() {
  after(700, () => {
    scanning.value = true // scan line menyapu + beam berdenyut (~2.6s)

    after(2600, () => {
      flash.value = true // kilatan konfirmasi (0.4s)

      after(500, () => {
        flash.value = false
        pop.value = 'out' // QR + phone mundur bersama (0.35s)

        after(350, () => {
          view.value = 'welcome'
          pop.value = 'idle'
          scanning.value = false

          after(4500, () => {
            pop.value = 'out'

            after(350, () => {
              view.value = 'scan'
              pop.value = 'idle'
              guestIndex.value = (guestIndex.value + 1) % guests.length
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

/* ---- QR dekoratif (deterministik, bukan kode asli) ---- */
const GRID = 7
const QR_SIZE = 96
const QR_PAD = 2
const QR_CELL = Math.round((QR_SIZE - QR_PAD * 2) / GRID)

function isFinder(r: number, c: number) {
  const inSquare = (sr: number, sc: number) =>
    r >= sr && r < sr + 3 && c >= sc && c < sc + 3
  return inSquare(0, 0) || inSquare(0, 4) || inSquare(4, 0)
}

function qrSeed(i: number) {
  return (Math.sin(i * 12.9898) * 43758.5453) % 1
}

const qrCells: { r: number; c: number }[] = []
for (let r = 0; r < GRID; r++) {
  for (let c = 0; c < GRID; c++) {
    if (isFinder(r, c)) continue
    if (qrSeed(r * GRID + c + 1) > 0.45) qrCells.push({ r, c })
  }
}

const finderSize = QR_CELL * 3
const finderInner = Math.round(finderSize * 0.62)
const finderDot = Math.round(finderSize * 0.3)
</script>

<template>
  <div class="nalla-scope checkin-demo flex h-full justify-center">
    <!-- Scan view -->
    <div v-if="view === 'scan'" :key="`scan-${guestIndex}`" class="relative w-full" :class="animClass">
      <div class="relative flex items-center justify-center py-2" style="min-height: 250px">
        <!-- QR code — target utama -->
        <div class="relative">
          <div class="relative overflow-hidden rounded-2xl border bg-white p-4"
            style="border-color: var(--n-line); box-shadow: 0 14px 32px rgba(43, 58, 51, 0.12)">
            <!-- Grid QR -->
            <div class="relative" :style="{ width: QR_SIZE + 'px', height: QR_SIZE + 'px' }">
              <span v-for="cell in qrCells" :key="`${cell.r}-${cell.c}`" class="absolute"
                :style="{
                  background: '#14120f',
                  borderRadius: '1px',
                  width: QR_CELL + 'px',
                  height: QR_CELL + 'px',
                  left: QR_PAD + cell.c * QR_CELL + 'px',
                  top: QR_PAD + cell.r * QR_CELL + 'px',
                }" />
              <!-- Tiga pola finder di sudut -->
              <span v-for="f in [{ t: QR_PAD, l: QR_PAD }, { t: QR_PAD, l: QR_PAD + QR_CELL * 4 }, { t: QR_PAD + QR_CELL * 4, l: QR_PAD }]"
                :key="`${f.t}-${f.l}`" class="absolute flex items-center justify-center"
                :style="{ background: '#14120f', borderRadius: '2px', width: finderSize + 'px', height: finderSize + 'px', top: f.t + 'px', left: f.l + 'px' }">
                <span class="rounded-[1px] bg-white" :style="{ width: finderInner + 'px', height: finderInner + 'px' }" />
                <span class="absolute rounded-[1px]"
                  :style="{ background: '#14120f', width: finderDot + 'px', height: finderDot + 'px' }" />
              </span>
            </div>

            <!-- Scan line menyapu saat "membaca" -->
            <span v-if="scanning" class="anim-scan-line pointer-events-none absolute inset-x-3 top-3 h-[2px] rounded-full"
              style="background: var(--n-primary); box-shadow: 0 0 10px 2px #465955" />

            <!-- Bracket sudut membingkai target scan -->
            <span class="scan-corner absolute left-1 top-1 h-3 w-3 rounded-tl-[4px] border-l-2 border-t-2" />
            <span class="scan-corner absolute right-1 top-1 h-3 w-3 rounded-tr-[4px] border-r-2 border-t-2" />
            <span class="scan-corner absolute bottom-1 left-1 h-3 w-3 rounded-bl-[4px] border-b-2 border-l-2" />
            <span class="scan-corner absolute bottom-1 right-1 h-3 w-3 rounded-br-[4px] border-b-2 border-r-2" />

            <!-- Kilatan sukses -->
            <span v-if="flash" class="anim-scan-flash pointer-events-none absolute inset-0 rounded-2xl"
              style="background: var(--n-gold)" />
          </div>

          <!-- Badge centang sukses -->
          <span v-if="flash" class="anim-floater-in absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full text-white"
            style="background: var(--n-gold)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        </div>

        <!-- Phone mockup membuka scanner — naik dari kanan-bawah, layar transparan -->
        <div v-if="scanning" class="anim-phone-rise absolute z-10" style="right: 8%; bottom: -8%">
          <!-- Beam — tautan kamera phone ke QR -->
          <span class="anim-beam-pulse pointer-events-none absolute z-0 rounded-full"
            :style="{ width: 34, height: 2.5, left: -30, top: 48, transform: 'rotate(-12deg)', background: 'rgba(70, 89, 85, 0.4)' }" />
          <!-- Body phone -->
          <div class="relative" style="width: 124px; aspect-ratio: 9 / 19; border-radius: 22px; background: rgba(0, 0, 0, 0.5); padding: 5px; box-shadow: 0 12px 24px rgba(20, 18, 15, 0.35); border: 4px solid black">
            <!-- Layar = viewfinder kamera, transparan agar QR terlihat -->
            <div class="relative h-full w-full overflow-hidden" style="border-radius: 17px; background: rgba(0, 0, 0, 0)">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative" style="width: 72%; height: 72%">
                  <span class="absolute left-0 top-0 h-3.5 w-3.5 rounded-tl-[3px] border-l-2 border-t-2 border-white/85" />
                  <span class="absolute right-0 top-0 h-3.5 w-3.5 rounded-tr-[3px] border-r-2 border-t-2 border-white/85" />
                  <span class="absolute bottom-0 left-0 h-3.5 w-3.5 rounded-bl-[3px] border-b-2 border-l-2 border-white/85" />
                  <span class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-br-[3px] border-b-2 border-r-2 border-white/85" />
                  <span class="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85" />
                  <!-- Sapuan scan di dalam viewfinder -->
                  <span v-if="!flash" class="anim-scan-line absolute inset-x-1 top-1 h-[1.5px] rounded-full"
                    style="background: var(--n-primary); box-shadow: 0 0 8px 2px #465955" />
                </div>
              </div>

              <!-- Kilatan sukses di layar kamera -->
              <span v-if="flash" class="anim-scan-flash pointer-events-none absolute inset-0" style="background: var(--n-gold)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Welcome view: kartu sambutan tamu -->
    <div v-else :key="`welcome-${guestIndex}`" class="flex h-full w-full flex-1 items-center justify-center"
      :class="animClass">
      <div class="relative flex h-full w-full flex-col items-center justify-center gap-3 p-5 text-center"
        style="border-radius: 18px; background: #fbf9f4; box-shadow: 0 14px 32px rgba(43, 58, 51, 0.12)">
        <!-- Bingkai ganda -->
        <div class="pointer-events-none absolute" style="inset: 7px; border-radius: 14px; border: 1px solid #465955; opacity: 0.55" />

        <NallaOrnament name="3" class="relative w-[60px] opacity-90" />

        <!-- Sapaan -->
        <div class="relative flex flex-col items-center gap-1">
          <span class="text-[10px] font-bold uppercase tracking-[0.24em]" style="color: #959d90">
            Welcome
          </span>
          <span class="text-[22px] font-extrabold leading-tight" style="font-family: var(--n-font-display); color: #2b3a33">
            {{ guests[guestIndex] }}
          </span>
        </div>

        <!-- Pembatas -->
        <div class="relative h-px w-10" style="background: #465955; opacity: 0.5" />

        <!-- Catatan kaki -->
        <span class="relative text-[10px] font-medium" style="color: #959d90">(Table 4)</span>
        <NallaOrnament name="5" class="relative w-[30px] opacity-90" />
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

.scan-corner {
  border-color: var(--n-primary);
}

/* Garis scan laser — menyapu saat phone "membaca" kode */
@keyframes scan-line {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translateY(900%);
    opacity: 0;
  }
}

.anim-scan-line {
  animation: scan-line 1.4s ease-in-out infinite;
}

/* Phone naik di samping QR, miring agar kameranya mengarah ke kode */
@keyframes phone-rise {
  from {
    opacity: 0;
    transform: translateX(26px) rotate(-12deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(-12deg);
  }
}

.anim-phone-rise {
  animation: phone-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Beam — denyut samar menghubungkan kamera phone ke QR */
@keyframes beam-pulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.7;
  }
}

.anim-beam-pulse {
  animation: beam-pulse 1.2s ease-in-out infinite;
}

/* Kilatan konfirmasi baca */
@keyframes scan-flash {
  from {
    opacity: 0.85;
  }
  to {
    opacity: 0;
  }
}

.anim-scan-flash {
  animation: scan-flash 0.4s ease-out forwards;
}

/* Pop in bouncy untuk badge centang */
@keyframes floater-in {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  55% {
    opacity: 1;
    transform: scale(1.12);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.anim-floater-in {
  animation: floater-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* Pop in/out — pergantian scan ↔ kartu welcome */
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

@media (prefers-reduced-motion: reduce) {
  .anim-scan-line,
  .anim-phone-rise,
  .anim-beam-pulse,
  .anim-scan-flash,
  .anim-floater-in,
  .anim-pop-in,
  .anim-pop-out {
    animation: none;
  }
}
</style>
