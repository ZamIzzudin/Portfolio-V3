<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppNavbar from '@/components/app/AppNavbar.vue'
import ButtonPlain from '@/components/common/ButtonPlain.vue'
import GuestCamera from '@/components/nalla/GuestCamera.vue'
import ThemePickerDemo from '@/components/nalla/ThemePickerDemo.vue'
import RsvpLoopDemo from '@/components/nalla/RsvpLoopDemo.vue'
import CheckinLoopDemo from '@/components/nalla/CheckinLoopDemo.vue'

import nallaData from '@/data/nalla'

const router = useRouter()

const { tagline, techBadges, problem, concept, coreFeatures, experience, showcase, cta } =
  nallaData
</script>

<template>
  <section class="project-nalla">
    <div class="container-wide py-[2rem]">
      <ButtonPlain :action="() => router.push('/')" label="&larr;" :rounded="false" size="sm" />
      <p class="section-label my-[2rem]">My Work</p>
      <h1 class="heading-display project-title">
        Nalla
      </h1>
      <p class="project-tagline">
        {{ tagline }}
      </p>
      <div class="tech-badges">
        <span v-for="badge in techBadges" :key="badge" class="tech-badge">{{ badge }}</span>
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

    <!-- The Experience -->
    <section class="section-space">
      <div class="container-wide text-center">
        <p class="section-label mb-[1.6rem]">{{ experience.label }}</p>
        <h2 class="heading-display section-title">{{ experience.title }}</h2>
        <p class="section-subtitle">
          {{ experience.subtitle }}
        </p>
        <div class="phase-grid">
          <div v-for="(phase, index) in experience.phases" :key="phase.title" class="phase-card">
            <span class="phase-step">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="phase-title">{{ phase.title }}</h3>
            <p class="phase-desc">{{ phase.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Demos -->
    <section class="section-space demos-section">
      <div class="container-wide">
        <div class="text-center">
          <p class="section-label mb-[1.6rem]">{{ showcase.label }}</p>
          <h2 class="heading-display section-title">{{ showcase.title }}</h2>
          <p class="section-subtitle mx-auto!">{{ showcase.subtitle }}</p>
        </div>

        <div class="demos-grid">
          <!-- Golden Moment — kamera tamu (interaktif) -->
          <div class="demo-block">
            <div class="demo-stage demo-stage-tall">
              <GuestCamera />
            </div>
            <h3 class="demo-heading">{{ showcase.demos[0].heading }}</h3>
            <p class="demo-subtitle">{{ showcase.demos[0].subtitle }}</p>
          </div>

          <!-- Koleksi tema (interaktif) -->
          <div class="demo-block">
            <div class="demo-stage">
              <ThemePickerDemo />
            </div>
            <h3 class="demo-heading">{{ showcase.demos[1].heading }}</h3>
            <p class="demo-subtitle">{{ showcase.demos[1].subtitle }}</p>
          </div>

          <!-- RSVP real-time (loop otomatis) -->
          <div class="demo-block">
            <div class="demo-stage">
              <RsvpLoopDemo />
            </div>
            <h3 class="demo-heading">{{ showcase.demos[2].heading }}</h3>
            <p class="demo-subtitle">{{ showcase.demos[2].subtitle }}</p>
          </div>

          <!-- QR check-in (loop otomatis) -->
          <div class="demo-block">
            <div class="demo-stage demo-stage-tall">
              <CheckinLoopDemo />
            </div>
            <h3 class="demo-heading">{{ showcase.demos[3].heading }}</h3>
            <p class="demo-subtitle">{{ showcase.demos[3].subtitle }}</p>
          </div>
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
/* ---- Palet brand Nalla pada halaman ini ----
   Porto memakai brand ungu (#6c49b6) global; ganti dengan brand nalla:
   ink hijau tua + aksen emas. Token di-override di root section sehingga
   semua komponen turunan (badge, fase, tombol) ikut berganti. */
.project-nalla {
  --brand-color: #2b3a33;
  --brand-color-transparent: #2b3a3330;
  --accent: #c99a3e;
  --accent-soft: #e8c065;
}

/* Mode gelap: ink tak terbaca di latar gelap — gunakan emas sebagai brand */
html.dark .project-nalla {
  --brand-color: #e8c065;
  --brand-color-transparent: #e8c06530;
  --accent: #e8c065;
  --accent-soft: #f0d99a;
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
  background: color-mix(in srgb, var(--brand-color) 12%, transparent);
  color: var(--brand-color);
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
  text-align: left;
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
  border-left: 2px solid var(--brand-color);
  padding-left: 2.4rem;
  text-align: left;
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
  text-align: left;
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

/* Experience phases */
.phase-grid {
  display: grid;
  gap: 2.4rem;
  margin-top: 0.8rem;
  text-align: left;
}

@media (min-width: 640px) {
  .phase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .phase-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.phase-card {
  border-top: 1px solid var(--color-divider);
  padding-top: 2.4rem;
}

.phase-step {
  display: block;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--brand-color);
  margin-bottom: 1rem;
}

.phase-title {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.phase-desc {
  margin: 1.2rem 0 0;
  font-size: clamp(1.2rem, 2vw, 1.45rem);
  line-height: 1.55;
  color: var(--color-secondary);
}

/* Interactive demos */
.demos-section {
  background: var(--color-hero-bg);
}

.demos-grid {
  display: grid;
  gap: 3.2rem 2.4rem;
}

@media (min-width: 768px) {
  .demos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.demo-block {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.demo-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.2rem 2rem;
  border: 1px solid var(--color-divider);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.demo-heading {
  margin: 2rem 0 0;
  font-size: clamp(1.5rem, 2.5vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.demo-subtitle {
  max-width: 40rem;
  margin: 1rem auto 0;
  font-size: clamp(1.2rem, 2vw, 1.45rem);
  line-height: 1.55;
  color: var(--color-secondary);
}

/* Bottom CTA */
.cta-heading {
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  margin: 0;
  white-space: pre-line;
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
  background: var(--brand-color);
}
</style>
