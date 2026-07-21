<script setup lang="ts">
import { showcases } from '@/data/content'
</script>

<template>
  <section class="section-space section-divider">
    <div class="container-wide">
      <h2 class="section-label mb-[3.2rem] m-0">{{ showcases.title }}</h2>

      <div class="showcase-grid">
        <a v-for="item in showcases.items" :key="item.title" :href="item.href" target="_blank" rel="noopener noreferrer"
          class="card-link">
          <div class="showcase-media">
            <img :src="item.image" :alt="item.title" loading="lazy" width="1140" height="780" />
          </div>
          <div class="showcase-body">
            <p class="card-meta m-0">{{ item.tag }}</p>
            <h3 class="card-title m-0">{{ item.title }}</h3>
            <p class="card-desc line-clamp-3 m-0">{{ item.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
