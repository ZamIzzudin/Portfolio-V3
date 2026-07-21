<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div>

    <section class="section-space text-center">
      <div class="container-page">
        <p class="mt-[2rem] text-[1.75rem] text-secondary m-0">
          This page could not be found.
        </p>
        <RouterLink to="/" class="btn-primary mt-[3.6rem]">
          Back to home
        </RouterLink>
      </div>
    </section>
  </div>
</template>
