<script setup lang="ts">
import { newsletters } from '@/data/content'
</script>

<template>
  <section class="section-space section-divider">
    <div class="container-page">
      <div class="mb-[2.4rem] flex items-center justify-between gap-4">
        <h2 class="section-label m-0">Newsletter</h2>
        <a href="https://naoto.themex.studio/blog/" class="link-arrow text-[1.4rem]" target="_blank"
          rel="noopener noreferrer">
          View all
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>

      <ul class="news-list">
        <li v-for="item in newsletters" :key="item.title">
          <a :href="item.href" target="_blank" rel="noopener noreferrer" class="news-row">
            <div class="min-w-0 flex-1">
              <h3 class="news-title m-0">{{ item.title }}</h3>
              <p class="news-excerpt m-0">{{ item.excerpt }}</p>
            </div>
            <div class="news-meta">
              <span>{{ item.date }}</span>
              <span class="news-tag">{{ item.tag }}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
