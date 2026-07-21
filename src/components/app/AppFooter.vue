<script setup lang="ts">
import { footer } from '@/data/content'
</script>

<template>
  <footer class=" footer-surface">
    <div class="container-wide footer-bottom">
      <p>{{ footer.copyright }}</p>
      <p>{{ footer.credit }}</p>
    </div>
  </footer>
</template>
