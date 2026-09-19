<script setup lang="ts">
import { ref } from 'vue'

import NallaOrnament from '@/components/nalla/NallaOrnament.vue'

/** 4 tema kurator unggulan + swatch-nya (port dari data themes nalla). */
const pickerThemes = [
  { name: 'Royal Heritage', bg: '#36433f', fg: '#fbf9f4' },
  { name: 'Sakura Whisper', bg: '#f0d99a', fg: '#2b3a33' },
  { name: 'Modern Editorial', bg: '#2b3a33', fg: '#fbf9f4' },
  { name: 'Vintage Garden', bg: '#f1ece2', fg: '#2b3a33' },
]

const selected = ref(0)
const chosen = ref(pickerThemes[0])

function pick(i: number) {
  selected.value = i
  chosen.value = pickerThemes[i]
}
</script>

<template>
  <div class="nalla-scope theme-picker flex w-full flex-col border p-4" style="border-color: var(--n-line); background: var(--n-paper); border-radius: 18px; box-shadow: 0 14px 32px rgba(43, 58, 51, 0.12)">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <span class="text-[14px] font-extrabold" style="font-family: var(--n-font-display); color: var(--n-ink)">
        Choose Design
      </span>
      <span class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
        style="background: rgba(70, 89, 85, 0.1); color: var(--n-primary)">
        50+ Theme
      </span>
    </div>

    <!-- Swatch tema -->
    <div class="mt-4 grid h-fit grid-cols-4 gap-2">
      <button v-for="(t, i) in pickerThemes" :key="t.name" type="button" :aria-pressed="selected === i"
        class="swatch relative flex flex-col items-center justify-center gap-1.5 overflow-hidden transition-all duration-200"
        :class="{ active: selected === i }" :style="{ aspectRatio: '3 / 4', background: t.bg }" @click="pick(i)">
        <!-- Centang kecil saat aktif -->
        <span v-if="selected === i" class="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full"
          style="background: var(--n-gold); color: var(--n-primary-dark)">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <NallaOrnament name="3" class="w-[28px] opacity-90" />
        <span class="px-1 text-center text-[8px] font-bold leading-tight" :style="{ color: t.fg }">
          {{ t.name }}
        </span>
      </button>
    </div>

    <!-- Bar status -->
    <div class="mt-4 flex items-center justify-between rounded-lg border px-3 py-2.5"
      style="border-color: var(--n-line); background: var(--n-cream)">
      <span class="text-[11.5px] font-semibold" style="color: var(--n-ink)">
        Choosen Design:
        <span style="color: var(--n-primary)">{{ chosen.name }}</span>
      </span>
      <span class="text-[9px] font-bold uppercase tracking-wide" style="color: var(--n-gold-dark)">
        Ready to Use
      </span>
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
  --n-line: #e6ddcf;
  --n-primary: #465955;
  --n-gold: #e8c065;
  --n-gold-dark: #c99a3e;
  --n-font-display: Prata, 'Playfair Display', Georgia, 'Times New Roman', serif;
}

.swatch {
  border-radius: 10px;
  opacity: 0.85;
  cursor: pointer;
}

.swatch:hover {
  opacity: 1;
  transform: scale(1.03);
}

.swatch.active {
  opacity: 1;
  outline: 2px solid var(--n-gold);
  outline-offset: 2px;
}
</style>
