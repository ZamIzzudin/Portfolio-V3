<script setup lang="ts">
import decor3 from '@/assets/nalla/3.svg'
import decor5 from '@/assets/nalla/5.svg'

const props = withDefaults(
  defineProps<{
    /** asset key (3 or 5) */
    name?: string | number
    /** mirror the ornament horizontally */
    flip?: boolean
  }>(),
  { name: '5', flip: false },
)

const assets: Record<string, string> = { 3: decor3, 5: decor5 }
</script>

<template>
  <img
    :src="assets[String(props.name)] ?? decor5"
    alt=""
    aria-hidden="true"
    draggable="false"
    class="ornament pointer-events-none select-none"
    :class="{ 'ornament-flip': props.flip }"
  />
</template>

<style scoped>
.ornament-flip {
  transform: scaleX(-1);
}
</style>
