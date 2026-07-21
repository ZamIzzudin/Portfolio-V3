<script setup lang="ts">
import { goods } from '@/data/content'
</script>

<template>
  <section class="section-space section-divider">
    <div class="container-wide">
      <h2 class="section-label mb-[3.2rem] m-0">{{ goods.title }}</h2>

      <div class="goods-grid">
        <a v-for="item in goods.items" :key="item.name" :href="item.href" target="_blank" rel="noopener noreferrer"
          class="card-link">
          <div class="goods-card">
            <img :src="item.image" :alt="item.name" loading="lazy" width="750" height="750" />
          </div>
          <div class="mt-[1.8rem] px-[0.2rem]">
            <p class="card-brand m-0">{{ item.brand }}</p>
            <h3 class="card-title m-0">{{ item.name }}</h3>
            <p class="card-desc m-0">{{ item.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
