<script setup lang="ts">
import AppFooter from '@/components/app/AppFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[var(--color-surface)] text-[var(--color-primary)]">

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
