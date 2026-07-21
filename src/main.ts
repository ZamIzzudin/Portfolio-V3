import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import { initTheme } from './composables/useTheme'

// Apply saved/system theme before first paint of Vue tree
initTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
