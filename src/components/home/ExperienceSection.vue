<script setup lang="ts">
import { experience } from '@/data/content'
</script>

<template>
  <section class="section-space experience-section" id="experience">
    <div class="container-wide">
      <p class="section-label">Profesional Experience</p>
      <div class="experience-header">
        <h2 class="heading-display experience-title">
          Track record,<br />
          proven in production
        </h2>
        <a :href="experience.resumeUrl" download class="btn-primary btn-md">
          Download Resume
          <span class="arrow" aria-hidden="true">↓</span>
        </a>
      </div>

      <ul class="experience-list">
        <li v-for="item in experience.items" :key="`${item.company}-${item.period}`" class="experience-row">
          <div class="experience-body">
            <h3 class="experience-company">{{ item.company }}</h3>
            <p class="experience-role">
              <span>as</span>
              {{ item.role }}
            </p>

          </div>
          <div class="experience-detail">
            <span class="experience-period">{{ item.period }}</span>
            <p v-if="item.location" class="experience-location">
              {{ item.location }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.experience-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4rem;
  margin-bottom: 4rem;
}

.experience-title {
  font-size: clamp(2.4rem, 3.6vw, 3.4rem);
  margin: clamp(1.2rem, 2vw, 1.6rem) 0 0;
  white-space: pre-line;
}

.experience-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.experience-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.6rem 2.4rem;
  border-top: 1px solid var(--color-divider);
  padding-block: clamp(2rem, 3vw, 2.8rem);
  transition:
    border-color var(--duration) var(--ease-out),
    color var(--duration) var(--ease-out);
}

.experience-row:hover {
  border-top-color: var(--brand-color);
}

.experience-company {
  font-family: var(--font-serif);
  margin: 0;
  font-size: clamp(1.8rem, 2.6vw, 2.4rem);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-primary);
  transition: color var(--duration) var(--ease-out);
}

.experience-row:hover .experience-company {
  color: var(--brand-color);
}

.experience-role {
  margin: 0.4rem 0 0;
  font-size: clamp(1.4rem, 2vw, 1.65rem);
  font-weight: 500;
  color: var(--color-secondary);
}

.experience-location {
  margin: 0.4rem 0 0;
  font-size: 1.3rem;
  color: var(--color-tertiary);
}

.experience-period {
  flex-shrink: 0;
  font-size: clamp(1.3rem, 1.8vw, 1.5rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-secondary);
  white-space: nowrap;
}

.experience-header .arrow {
  transition: transform var(--duration) var(--ease-out);
}

.experience-header a:hover .arrow {
  transform: translateY(3px);
}

.experience-detail {
  display: flex;
  flex-direction: column;
  align-items: end;
}

@media (max-width: 600px) {
  .experience-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .experience-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
