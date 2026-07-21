<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import AppNavbar from '@/components/app/AppNavbar.vue'
import ButtonPlain from '@/components/common/ButtonPlain.vue'

import AnimatedWLogo from '@/components/wikin/AnimatedWLogo.vue'
import GrammarFillBlank from '@/components/wikin/GrammarFillBlank.vue'
import AdaptiveQuiz from '@/components/wikin/AdaptiveQuiz.vue'
import ProjectGallery from '@/components/wikin/ProjectGallery.vue'

import wikinData from '@/data/wikin'

const router = useRouter()
const { techBadges, painPoints, coreFeatures, gallery, cta } = wikinData

const windowWidth = ref(0)

const logoSize = computed(() => {
  const minSize = 200
  const preferredSize = windowWidth.value * 0.3
  const maxSize = 400
  return Math.max(minSize, Math.min(preferredSize, maxSize))
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section>
    <div class="container-wide py-[2rem]">
      <ButtonPlain :action="() => router.push('/')" label="&larr;" :rounded="false" size="sm" />
      <p class="section-label my-[2rem]">My Work</p>
      <h1 class="heading-display project-title">
        Wikin
      </h1>
      <p class="project-tagline">
        Wikin helps you prepare with AI-powered simulations, actionable performance insights, and flexible
        IELTS/TOEFL pathways tailored to your goals.
      </p>
      <div class="tech-badges">
        <span v-for="badge in techBadges" :key="badge" class="tech-badge">{{ badge }}</span>
      </div>
    </div>
    <div class="mt-[5rem] relative wikin-features">
      <AnimatedWLogo :size="logoSize"
        class="rotate-180 absolute -bottom-0 -left-10 md:-left-30 hidden md:block" />
      <div class="max-w-[520px] mx-auto px-4 md:px-0">
        <GrammarFillBlank />
      </div>
      <AnimatedWLogo :size="logoSize"
        class="rotate-45 absolute bottom-0 -right-10 md:-right-30 hidden md:block" />
    </div>
    <AppNavbar />

    <!-- Problem & Solution -->
    <section class="section-space">
      <div class="container-wide">
        <p class="section-label mb-[1.6rem]">Problem That We Faced</p>
        <h2 class="heading-display section-title">
          Why students struggle with<br />standardized test prep
        </h2>
        <div class="pain-grid">
          <div v-for="point in painPoints" :key="point.title" class="pain-card">
            <h3 class="pain-title">{{ point.title }}</h3>
            <p class="pain-desc">{{ point.desc }}</p>
          </div>
        </div>

        <div class="solution-box w-full!">
          <h2 class="heading-display solution-title">Practice doesn't make perfect. Practice makes permanent.</h2>
          <p class="solution-desc">
            That is exactly why the quality of every practice session matters. Wikin ensures every attempt is meaningful
            by generating fresh, exam-aligned questions tailored to your current level — so you reinforce the right
            habits instead of repeating the same mistakes.
          </p>
        </div>
      </div>
    </section>

    <!-- Core Features -->
    <section class="section-space features-section">
      <div class="container-wide">
        <p class="section-label mb-[1.6rem]">Core Features</p>
        <h2 class="heading-display section-title">Experience that grows with you</h2>
        <div class="features-grid">
          <div v-for="feature in coreFeatures" :key="feature.title" class="feature-card">
            <h3 class="feature-card-title">{{ feature.title }}</h3>
            <p class="feature-card-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="section-space">
      <div class="container-wide">
        <ProjectGallery :label="gallery.label" :title="gallery.title" :subtitle="gallery.subtitle"
          :items="gallery.items" />
      </div>
    </section>

    <section class="container-wide mt-[2rem]">
      <AdaptiveQuiz />
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
  background: color-mix(in srgb, var(--brand-color) 12%, transparent);
  color: var(--brand-color);
}

.section-title {
  font-size: clamp(2.4rem, 3.6vw, 3.4rem);
  margin-bottom: 2rem;
}

.section-subtitle {
  max-width: 52rem;
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

.solution-box {
  margin-top: 5.6rem;
  border-left: 2px solid var(--color-primary);
  padding-left: 2.4rem;
}

.solution-title {
  font-size: clamp(2rem, 3vw, 2.8rem);
  margin-bottom: 1.2rem;
}

.solution-desc {
  font-size: 1.65rem;
  line-height: 1.6;
  color: var(--color-secondary);
  margin: 0;
}

/* Core Features */
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


/* Demo Tabs */
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
  background: var(--brand-color);
  color: white;
  border-color: var(--brand-color);
}

.demo-container {
  max-width: 88rem;
}

/* Bottom CTA */
.cta-heading {
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  margin: 0;
}

.cta-subtitle {
  max-width: 44rem;
  margin: 1.6rem auto 0;
  font-size: 1.65rem;
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
</style>
