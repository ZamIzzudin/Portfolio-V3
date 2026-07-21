<script setup lang="ts">
import { hero } from '@/data/content.ts'
import SocialIcons from './SocialIcons.vue'
import ButtonPlain from '../common/ButtonPlain.vue';

import profilePhoto from '@/assets/pict/profile2.png'
</script>

<template>
  <section class="py-[var(--section-space)]">
    <div class="container-wide">

      <div class="hero-row">
        <div class="hero-row">
          <img :src="profilePhoto" alt="Profile photo" class="hero-photo" />
          <div class="hero-body">
            <h1 class="heading-display hero-title">
              {{ hero.titleLines }}
            </h1>
            <p>{{ hero.paragraphs }}</p>
          </div>
        </div>
        <ButtonPlain variant="primary" label="Get in Touch" size="sm" />
      </div>

      <div class="mt-[3.6rem]">
        <SocialIcons :items="hero.socials" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4rem;
}

.hero-photo {
  width: 8rem;
  height: 8rem;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .hero-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.6rem;
  }
}
</style>
