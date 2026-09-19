<script setup lang="ts">
import { techStack } from '@/data/content'
</script>

<template>
  <section class="tech-stack-section">
    <div class="container-wide">
      <p class="section-label">Tech Stack</p>
      <h2 class="heading-display stack-title">
        Something you can talk<br />
        with me about
      </h2>

      <div class="stack-grid">
        <div v-for="group in techStack" :key="group.label" class="stack-group">
          <span class="stack-group-label">{{ group.label }}</span>
          <ul class="stack-items">
            <li v-for="item in group.items" :key="item" class="stack-item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech-stack-section {
  margin-top: 1rem;
  margin-bottom: 5rem;
}

.stack-title {
  margin: clamp(1.2rem, 2vw, 1.6rem) 0 4rem;
  font-size: clamp(2.4rem, 3.6vw, 3.4rem);
  white-space: pre-line;
}

.stack-grid {
  display: grid;
  gap: 3.2rem 2.4rem;
}

@media (min-width: 768px) {
  .stack-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stack-group {
  border-top: 1px solid var(--color-divider);
  padding-top: 2rem;
}

.stack-group-label {
  display: block;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 1.6rem;
}

.stack-items {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.8rem 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stack-item {
  position: relative;
  font-size: clamp(1.4rem, 2vw, 1.65rem);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-primary);
  transition: color var(--duration) var(--ease-out);
}

/* Pemisah titik tengah ala editorial — muncul di antara item */
.stack-item+.stack-item {
  padding-left: 1.6rem;
}

.stack-item+.stack-item::before {
  content: '·';
  position: absolute;
  left: 0.45rem;
  color: var(--color-tertiary);
}

.stack-item:hover {
  color: var(--brand-color);
}
</style>
