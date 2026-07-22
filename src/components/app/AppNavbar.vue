<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { navLinks } from '@/data/content'
import { useTheme } from '@/composables/useTheme'

const open = ref(false)
const scrolled = ref(false)
const { isDark, toggleTheme } = useTheme()
const router = useRouter()
const route = useRoute()

function onScroll() {
  scrolled.value = window.scrollY > window.innerHeight
}

function handleNavClick(hash: string) {
  if (route.path !== '/') {
    router.push({ path: '/', hash })
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const props = withDefaults(
  defineProps<{
    isPage?: boolean
  }>(),
  { isPage: false },
)

</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="container-wide site-header-inner">
      <nav class="nav-desktop" aria-label="Primary">
        <template v-for="link in navLinks" :key="link.label">
          <button v-if="link.to" type="button" class="nav-link" @click="handleNavClick(link.to)">
            {{ link.label }}
          </button>
          <a v-else-if="link.href" :href="link.href" class="nav-link">
            {{ link.label }}
          </a>
        </template>
      </nav>

      <div class="nav-actions">
        <button type="button" class="nav-icon-btn" aria-label="Search" title="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.4-3.4" stroke-linecap="round" />
          </svg>
        </button>

        <button type="button" class="nav-icon-btn" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="isDark ? 'Light mode' : 'Dark mode'" @click="toggleTheme">
          <!-- Moon (show when light → go dark) -->
          <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M21 14.3A8.4 8.4 0 0 1 9.7 3 6.9 6.9 0 1 0 21 14.3z" stroke-linejoin="round" />
          </svg>
          <!-- Sun (show when dark → go light) -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <circle cx="12" cy="12" r="4.2" />
            <path
              d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"
              stroke-linecap="round" />
          </svg>
        </button>

        <button type="button" class="nav-icon-btn mobile-menu-btn" :aria-expanded="open" aria-label="Menu"
          @click="open = !open">
          <svg v-if="!open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="open" class="mobile-menu">
      <nav class="container-wide" aria-label="Mobile">
        <template v-for="link in navLinks" :key="link.label">
          <button v-if="link.to" type="button" class="nav-link" @click="handleNavClick(link.to); open = false">
            {{ link.label }}
          </button>
          <a v-else-if="link.href" :href="link.href" class="nav-link">
            {{ link.label }}
          </a>
        </template>
      </nav>
    </div>
  </header>
</template>
