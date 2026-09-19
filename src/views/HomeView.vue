<script setup lang="ts">
import AppNavbar from '@/components/app/AppNavbar.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import FeatureBanners from '@/components/home/FeatureBanners.vue'
import TechStackSection from '@/components/home/TechStackSection.vue'
import ExperienceSection from '@/components/home/ExperienceSection.vue'
</script>

<template>
  <div>
    <HeroSection />
    <AppNavbar />
    <FeatureBanners />
    <TechStackSection />
    <ExperienceSection />

    <!-- Contact Section -->
    <section class="section-space bg-[var(--color-hero-bg)]" id="contact">
      <div class="container-wide text-center">
        <h2 class="heading-display contact-title">
          Have a project in mind?
        </h2>
        <p class="contact-subtitle">
          Would you like to share it? Feel free to reach out by writing email.
        </p>
        <a href="mailto:azzamizzudinhasan@gmail.com" class="btn-primary btn-md">
          Get in Touch
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-title {
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  margin-bottom: clamp(1rem, 2vw, 1.6rem);
}

.contact-subtitle {
  max-width: 60rem;
  margin: clamp(1rem, 2vw, 1.6rem) auto clamp(2rem, 4vw, 3.2rem);
  font-size: clamp(1.2rem, 2vw, 1.65rem);
  line-height: 1.6;
  color: var(--color-secondary);
}
</style>
