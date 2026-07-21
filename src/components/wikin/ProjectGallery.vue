<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GalleryItem } from '@/data/wikin'

const props = defineProps<{
  label: string
  title: string
  subtitle: string
  items: GalleryItem[]
}>()

const currentIdx = ref(0)

const isAtStart = computed(() => currentIdx.value === 0)
const isAtEnd = computed(() => currentIdx.value >= 0 && props.items.length > 0 && currentIdx.value === props.items.length - 1)

function prev() {
  if (currentIdx.value > 0) currentIdx.value--
}

function next() {
  if (currentIdx.value < props.items.length - 1) currentIdx.value++
}

function goTo(idx: number) {
  currentIdx.value = idx
}
</script>

<template>
  <div class="gallery-section">
    <p class="section-label mb-[1.6rem]">{{ label }}</p>
    <h2 class="heading-display section-title">{{ title }}</h2>
    <p class="gallery-subtitle">{{ subtitle }}</p>

    <div class="carousel-wrapper">
      <button class="carousel-nav carousel-prev" :disabled="isAtStart" :aria-label="'Previous slide'" @click="prev">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="12,4 6,10 12,16" />
        </svg>
      </button>

      <div class="carousel-viewport">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentIdx * 100}%)` }">
          <div v-for="(item, idx) in items" :key="idx" class="carousel-slide">
            <img :src="item.src" :alt="item.alt" loading="lazy" />
          </div>
        </div>
      </div>

      <button class="carousel-nav carousel-next" :disabled="isAtEnd" :aria-label="'Next slide'" @click="next">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="8,4 14,10 8,16" />
        </svg>
      </button>
    </div>

    <div v-if="items.length > 1" class="carousel-dots">
      <button v-for="(_, idx) in items" :key="idx" class="carousel-dot" :class="{ active: idx === currentIdx }"
        :aria-label="'Go to slide ' + (idx + 1)" @click="goTo(idx)" />
    </div>
  </div>
</template>

<style scoped>
.section-title {
  font-size: clamp(2.4rem, 3.6vw, 3.4rem);
  margin-bottom: 2rem;
}

.gallery-section {
  padding: 6rem 0;
}

.gallery-subtitle {
  max-width: 52rem;
  font-size: 1.55rem;
  line-height: 1.6;
  color: var(--color-secondary);
  margin: 0 0 3.2rem;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.carousel-viewport {
  flex: 1;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-divider);
  background: var(--color-muted);
}

.carousel-track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.carousel-slide {
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.carousel-slide img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.carousel-nav {
  flex-shrink: 0;
  width: 4.4rem;
  height: 4.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-divider);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.15s;
}

.carousel-nav:hover:not(:disabled) {
  background: var(--hover-fill);
  border-color: var(--brand-color);
  color: var(--brand-color);
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: default;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.6rem;
}

.carousel-dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.carousel-dot.active {
  background: var(--brand-color);
  border-color: var(--brand-color);
  transform: scale(1.3);
}

@media (max-width: 640px) {
  .carousel-nav {
    width: 3.6rem;
    height: 3.6rem;
  }

  .carousel-nav svg {
    width: 16px;
    height: 16px;
  }
}
</style>
