<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppNavbar from '@/components/app/AppNavbar.vue'
import ButtonPlain from '@/components/common/ButtonPlain.vue'

import InteractiveCalendar from '@/components/detto/InteractiveCalendar.vue'
import LoveNoteStack from '@/components/detto/LoveNoteStack.vue'
import NotificationTimeline from '@/components/detto/NotificationTimeline.vue'
import MemoriesBentoGallery from '@/components/detto/MemoriesBentoGallery.vue'

import dettoData from '@/data/detto'

const router = useRouter()

const { tagline, techBadges, problem, concept, coreFeatures, showcase, cta } =
  dettoData

</script>

<template>
  <section>
    <div class="container-wide py-[2rem]">
      <ButtonPlain :action="() => router.push('/')" label="&larr;" :rounded="false" size="sm" />
      <p class="section-label my-[2rem]">My Work</p>
      <div class="flex gap-5 items-center flex-col lg:flex-row">
        <div class="text-center lg:text-left w-full lg:w-auto">
          <h1 class=" heading-display project-title">
            Detto
          </h1>
          <p class="project-tagline">
            {{ tagline }}
          </p>
          <div class="tech-badges">
            <span v-for="badge in techBadges" :key="badge" class="tech-badge">{{ badge }}</span>
          </div>
        </div>
        <LoveNoteStack />
      </div>
    </div>
    <AppNavbar />

    <!-- The Problem -->
    <section class="section-space">
      <div class="container-wide">
        <p class="section-label mb-[1.6rem]">{{ problem.label }}</p>
        <h2 class="heading-display section-title">
          {{ problem.title }}
        </h2>
        <div class="pain-grid">
          <div v-for="point in problem.painPoints" :key="point.title" class="pain-card">
            <h3 class="pain-title">{{ point.title }}</h3>
            <p class="pain-desc">{{ point.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- The Concept -->
    <section class="section-space concept-section">
      <div class="container-wide">
        <p class="section-label mb-[1.6rem]">{{ concept.label }}</p>
        <h2 class="heading-display section-title">
          {{ concept.title }}
        </h2>
        <div class="concept-box">
          <p class="concept-quote">
            {{ concept.quote }}
          </p>
          <p class="concept-desc">
            {{ concept.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- Core Features -->
    <section class="section-space features-section">
      <div class="container-wide">
        <p class="section-label mb-[1.6rem]">{{ coreFeatures.label }}</p>
        <h2 class="heading-display section-title">{{ coreFeatures.title }}</h2>
        <div class="features-grid">
          <div v-for="feature in coreFeatures.items" :key="feature.title" class="feature-card">
            <h3 class="feature-card-title">{{ feature.title }}</h3>
            <p class="feature-card-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Interactive Demo -->
    <section class="section-space">
      <div class="container-wide text-center">
        <p class="section-label mb-[1.6rem]">{{ showcase.label }}</p>
        <h2 class="heading-display section-title">{{ showcase.title }}</h2>
        <p class="section-subtitle">
          {{ showcase.subtitle }}
        </p>
      </div>
      <div class="demo-grid">
        <div class="demo-item">
          <h2 class="heading-display mb-5">{{ showcase.demos[0].heading }}</h2>
          <p class="section-subtitle">
            {{ showcase.demos[0].subtitle }}
          </p>
          <InteractiveCalendar />
        </div>
        <div class="demo-item">
          <h2 class="heading-display mb-5">{{ showcase.demos[1].heading }}</h2>
          <p class="section-subtitle">
            {{ showcase.demos[1].subtitle }}
          </p>
          <NotificationTimeline />
        </div>
        <div class="demo-item">
          <h2 class="heading-display mb-5">{{ showcase.demos[2].heading }}</h2>
          <p class="section-subtitle">
            {{ showcase.demos[2].subtitle }}
          </p>
          <MemoriesBentoGallery />
        </div>

      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="section-space">
      <div class="container-wide text-center">
        <h2 class="heading-display cta-heading">
          {{ cta.heading }}
        </h2>
        <p class="cta-subtitle">
          {{ cta.subtitle }}
        </p>
        <div class="cta-actions">
          <a :href="cta.buttonHref" target="_blank" rel="noopener noreferrer" class="btn-primary">
            {{ cta.buttonLabel }}
          </a>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.back-link {
  display: inline-block;
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-secondary);
  text-decoration: none;
  margin-bottom: 1.6rem;
  transition: color var(--duration) var(--ease-out);
}

.back-link:hover {
  color: var(--color-primary);
}

.project-title {
  font-size: clamp(3.2rem, 5.5vw, 4.8rem);
  margin-bottom: 1.6rem;
}

.project-tagline {
  max-width: 52rem;
  font-size: clamp(1.4rem, 2.5vw, 1.75rem);
  line-height: 1.65;
  color: var(--color-secondary);
  margin: 0;
}

.tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 2rem;
}

.tech-badge {
  font-size: 1.15rem;
  font-weight: 500;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--accent-soft) 12%, transparent);
  color: var(--accent);
}

.section-title {
  font-size: clamp(2.4rem, 3.6vw, 3.4rem);
  margin-bottom: 2rem;
  white-space: pre-line;
}

.section-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.55rem);
  line-height: 1.6;
  color: var(--color-secondary);
  margin: 0 0 3.2rem;
}

/* Pain points */
.pain-grid {
  display: grid;
  gap: 2rem;
  margin-top: 2.8rem;
}

@media (min-width: 640px) {
  .pain-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.pain-card {
  border-top: 1px solid var(--color-divider);
  padding-top: 2.4rem;
}

.pain-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-primary);
}

.pain-desc {
  margin: 1rem 0 0;
  font-size: 1.45rem;
  line-height: 1.55;
  color: var(--color-secondary);
}

/* Concept */
.concept-section {
  background: var(--color-hero-bg);
}

.concept-box {
  margin-top: 5.6rem;
  border-left: 2px solid var(--color-primary);
  padding-left: 2.4rem;
}

.concept-quote {
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 1.6rem;
  font-style: italic;
}

.concept-desc {
  font-size: 1.65rem;
  line-height: 1.6;
  color: var(--color-secondary);
  margin: 0;
}

/* Features */
.features-section {
  background: var(--color-hero-bg);
}

.features-grid {
  display: grid;
  gap: 3.2rem;
  margin-top: 2.8rem;
}

@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  border-top: 1px solid var(--color-divider);
  padding-top: 2.4rem;
}

.feature-card-title {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.feature-card-desc {
  margin: 1.2rem 0 0;
  font-size: clamp(1.2rem, 2vw, 1.45rem);
  line-height: 1.55;
  color: var(--color-secondary);
}

.principle-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.principle-list li {
  font-size: 1.45rem;
  line-height: 1.55;
  color: var(--color-secondary);
}

.principle-list strong {
  color: var(--color-primary);
}

/* Demo */
.demo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .demo-grid {
    grid-template-columns: repeat(2, 1fr);
    padding-left: 5rem;
    padding-right: 5rem;
  }
}

@media (min-width: 1024px) {
  .demo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.demo-item {
  display: flex;
  flex-direction: column;
}

.demo-item .section-subtitle {
  margin-bottom: 2rem;
}

.demo-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 2.4rem;
}

.demo-tab {
  padding: 0.8rem 1.4rem;
  border-radius: 9999px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
  color: var(--color-secondary);
  transition: all 0.15s;
}

.demo-tab:hover {
  background: var(--hover-fill);
  color: var(--color-primary);
}

.demo-tab.active {
  background: var(--accent-soft);
  color: white;
  border-color: var(--accent-soft);
}

/* Bottom CTA */
.cta-heading {
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  margin: 0;
}

.cta-subtitle {
  max-width: 44rem;
  margin: 1.6rem auto 0;
  font-size: clamp(1.2rem, 2vw, 1.65rem);
  line-height: 1.6;
  color: var(--color-secondary);
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 3.2rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: white;
  text-decoration: none;
  padding: clamp(0.8rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  border-radius: 9999px;
  font-size: clamp(1.2rem, 1.5vw, 1.5rem);
  font-weight: 600;
  transition: opacity 0.15s;
  font-family: var(--font-sans);
}

.btn-primary:hover {
  opacity: 0.88;
}
</style>
