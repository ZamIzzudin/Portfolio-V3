<script setup lang="ts">
import { customContent } from '@/data/content'
</script>

<template>
  <section class="section-space section-divider">
    <div class="container-wide">
      <div class="custom-media">
        <img :src="customContent.image" alt="Custom landing page" loading="lazy" width="1600" height="730" />
      </div>

      <div class="mx-auto mt-[4.8rem] max-w-[56rem] text-center">
        <h2 class="heading-display m-0 text-[clamp(2.8rem,4vw,4rem)]">
          {{ customContent.title }}
        </h2>
        <p class="mx-auto mt-[2rem] max-w-[48rem] text-[1.65rem] leading-[1.6] text-secondary m-0">
          {{ customContent.description }}
        </p>
        <a :href="customContent.href" class="link-arrow mt-[2.8rem] justify-center" target="_blank"
          rel="noopener noreferrer">
          {{ customContent.cta }}
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>
