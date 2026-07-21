<script setup lang="ts">
import { latestUpdate } from '@/data/content'
</script>

<template>
  <section class="section-space">
    <div class="container-page">
      <div class="mb-[2.4rem] flex flex-wrap items-center gap-x-[1.6rem] gap-y-[0.8rem]">
        <span class="section-label">{{ latestUpdate.label }}</span>
        <span class="text-[1.35rem] text-tertiary">{{ latestUpdate.date }}</span>
      </div>

      <p class="m-0 max-w-[56rem] text-[1.85rem] leading-[1.6] text-secondary">
        {{ latestUpdate.text }}
      </p>

      <div class="update-card mt-[3.6rem]">
        <video :src="latestUpdate.video" :poster="latestUpdate.poster" controls playsinline preload="metadata" />
      </div>
    </div>
  </section>
</template>
