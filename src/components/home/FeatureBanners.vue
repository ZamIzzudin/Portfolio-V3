<script setup lang="ts">
import { featureBanners } from '@/data/content'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="pb-[var(--section-space)]" id="project">
    <div class="container-wide space-y-[clamp(5.6rem,8vw,9.6rem)]">
      <article v-for="(banner, index) in featureBanners" :key="index" class="feature-banner"
        :class="{ reverse: banner.reverse }">
        <div class="feature-banner-copy">
          <p v-if="banner.eyebrow" class="section-label mb-[2rem]">
            {{ banner.eyebrow }}
          </p>
          <h2 class="heading-display feature-banner-title m-0">
            {{ banner.title }}
          </h2>
          <p class="mt-[2rem] max-w-[42rem] text-[1.65rem] leading-[1.6] text-secondary m-0">
            {{ banner.description }}
          </p>
          <RouterLink v-if="banner.to" :to="banner.to" class="link-arrow mt-[2.8rem]">
            {{ banner.cta }}
            <span class="arrow" aria-hidden="true">→</span>
          </RouterLink>
          <a v-else :href="banner.href" class="link-arrow mt-[2.8rem]" target="_blank" rel="noopener noreferrer">
            {{ banner.cta }}
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div class="feature-banner-media">
          <img :src="banner.image" :alt="banner.title" loading="lazy" width="1200" height="800" />
        </div>
      </article>
    </div>
  </section>
</template>
