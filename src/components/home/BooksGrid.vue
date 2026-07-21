<script setup lang="ts">
import { books } from '@/data/content'
</script>

<template>
  <section class="section-space section-divider">
    <div class="container-wide">
      <h2 class="section-label mb-[3.2rem] m-0">{{ books.title }}</h2>

      <div class="books-grid">
        <a v-for="item in books.items" :key="item.title" :href="item.href" target="_blank" rel="noopener noreferrer"
          class="card-link">
          <div class="book-cover">
            <img :src="item.image" :alt="item.title" loading="lazy" width="750" height="1125" />
          </div>
          <div class="book-body">
            <p class="card-meta m-0">{{ item.author }}</p>
            <h3 class="card-title m-0">{{ item.title }}</h3>
            <p class="card-desc m-0">{{ item.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
