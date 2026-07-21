import { computed, ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'porto-theme'

const theme = ref<ThemeMode>('light')
const ready = ref(false)
let watching = false

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.theme = mode
  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode
}

export function initTheme() {
  if (typeof window === 'undefined' || ready.value) return

  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  const mode: ThemeMode =
    stored === 'light' || stored === 'dark' ? stored : getSystemTheme()

  theme.value = mode
  applyTheme(mode)
  ready.value = true

  // Keep in sync if OS preference changes and user has no manual choice
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (localStorage.getItem(STORAGE_KEY)) return
      const next: ThemeMode = e.matches ? 'dark' : 'light'
      theme.value = next
      applyTheme(next)
    })
}

function ensureWatch() {
  if (watching) return
  watching = true

  // Lightweight manual sync — avoids multiple Vue watchers if useTheme is called often
  // Consumers call setTheme/toggleTheme which go through this path.
}

export function useTheme() {
  if (!ready.value) initTheme()
  ensureWatch()

  const isDark = computed(() => theme.value === 'dark')

  function setTheme(mode: ThemeMode) {
    theme.value = mode
    applyTheme(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    isDark,
    ready,
    setTheme,
    toggleTheme,
  }
}
