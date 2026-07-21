<script setup lang="ts">
import { closing } from '@/data/content'
</script>

<template>
  <section class="section-space section-divider">
    <div class="container-wide">
      <h2 class="cta-mega m-0 text-center">
        <span v-for="(line, i) in closing.lines" :key="i" class="block">
          {{ line }}
        </span>
      </h2>

      <div class="feature-tiles mt-[clamp(4.8rem,7vw,6.4rem)]">
        <div v-for="feature in closing.features" :key="feature.title" class="feature-tile">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>

      <div class="mockup-grid mt-[clamp(5.6rem,8vw,8rem)]">
        <div v-for="(src, i) in closing.mockups" :key="i" class="mockup-frame">
          <img :src="src" :alt="`Naoto mockup ${i + 1}`" loading="lazy" />
        </div>
      </div>

      <div class="mt-[clamp(6.4rem,9vw,9.6rem)] text-center">
        <h3 class="heading-display m-0 text-[clamp(2.8rem,4.5vw,4.2rem)]">
          {{ closing.finalTitle }}
        </h3>
        <p class="mt-[1.4rem] text-[1.75rem] text-secondary m-0">
          {{ closing.finalSubtitle }}
        </p>
        <a :href="closing.ctaHref" class="btn-primary mt-[3.2rem]" target="_blank" rel="noopener noreferrer">
          {{ closing.cta }}
        </a>
      </div>
    </div>
  </section>
</template>
