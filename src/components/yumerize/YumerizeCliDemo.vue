<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'

type DemoPhase = 'terminal' | 'browser'

interface Route {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  group: string
}

const phase = ref<DemoPhase>('terminal')
const terminalInput = ref('')
const terminalOutput = ref<string[]>([
  '$ ©Yumerize 2026',
])

const terminalRef = ref<HTMLDivElement>()

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const selectedMethod = ref<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET')
const apiUrl = ref('/api/users')
const responseBody = ref<unknown>(null)
const statusCode = ref<number | null>(null)
const isLoading = ref(false)

const searchQuery = ref('')
const selectedRouteId = ref<string>('users-get')

const routes: Route[] = [
  { id: 'users-get', method: 'GET', path: '/api/users', group: 'Users' },
  { id: 'users-post', method: 'POST', path: '/api/users', group: 'Users' },
  { id: 'users-put', method: 'PUT', path: '/api/users/:id', group: 'Users' },
  { id: 'users-patch', method: 'PATCH', path: '/api/users/:id', group: 'Users' },
  { id: 'users-delete', method: 'DELETE', path: '/api/users/:id', group: 'Users' },
  { id: 'products-get', method: 'GET', path: '/api/products', group: 'Products' },
  { id: 'products-post', method: 'POST', path: '/api/products', group: 'Products' },
  { id: 'products-delete', method: 'DELETE', path: '/api/products/:id', group: 'Products' },
]

const filteredRoutes = computed(() => {
  if (!searchQuery.value) return routes
  const query = searchQuery.value.toLowerCase()
  return routes.filter(r =>
    r.path.toLowerCase().includes(query) ||
    r.method.toLowerCase().includes(query) ||
    r.group.toLowerCase().includes(query)
  )
})

const routeGroups = computed(() => {
  const groups: Record<string, Route[]> = {}
  for (const route of filteredRoutes.value) {
    if (!groups[route.group]) {
      groups[route.group] = []
    }
    groups[route.group].push(route)
  }
  return groups
})

const handleTerminalSubmit = async () => {
  const cmd = terminalInput.value.trim()

  terminalOutput.value.push(`$ ${cmd}`)

  if (cmd === 'npm run dev') {
    await nextTick()
    terminalOutput.value.push('Starting development server...')
    await new Promise(r => setTimeout(r, 800))
    terminalOutput.value.push('✓ Server running at http://localhost:3000')
    await new Promise(r => setTimeout(r, 400))
    terminalOutput.value.push('✓ Yumerize docs available at http://localhost:3000/docs')
    await new Promise(r => setTimeout(r, 500))
    phase.value = 'browser'
  } else if (cmd === 'clear') {
    terminalOutput.value = [
      '$ Welcome to Yumerize Demo',
      '$ Try typing "npm run dev" to start the server',
    ]
  } else if (cmd === 'reset') {
    resetBrowser()
    terminalOutput.value.push('✓ Browser state reset')
  } else {
    terminalOutput.value.push(`bash: ${cmd}: command not found`)
  }

  terminalInput.value = ''
  await nextTick()
  terminalRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleRouteClick = (route: Route) => {
  selectedRouteId.value = route.id
  selectedMethod.value = route.method
  apiUrl.value = route.path
  statusCode.value = null
  responseBody.value = null
}

const resetBrowser = () => {
  selectedMethod.value = 'GET'
  apiUrl.value = '/api/users'
  responseBody.value = null
  statusCode.value = null
  searchQuery.value = ''
  selectedRouteId.value = 'users-get'
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery.value = target.value
  }, 300)
}

const handleSendRequest = async () => {
  isLoading.value = true
  statusCode.value = null
  responseBody.value = null

  await new Promise(r => setTimeout(r, 600))

  if (selectedMethod.value === 'GET' && apiUrl.value === '/api/users') {
    statusCode.value = 200
    responseBody.value = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]
  } else if (selectedMethod.value === 'POST') {
    statusCode.value = 201
    responseBody.value = {
      id: 3,
      name: 'New User',
      email: 'new@example.com',
      created_at: new Date().toISOString(),
    }
  } else if (selectedMethod.value === 'PUT' || selectedMethod.value === 'PATCH') {
    statusCode.value = 404
    responseBody.value = {
      error: 'Not Found',
      message: 'Resource not found in this demo',
    }
  } else if (selectedMethod.value === 'DELETE') {
    statusCode.value = 204
    responseBody.value = null
  } else {
    statusCode.value = 404
    responseBody.value = {
      error: 'Not Found',
      message: 'Endpoint not found in this demo',
    }
  }

  isLoading.value = false
}
</script>

<template>
  <div class="yumerize-demo">
    <!-- Terminal Phase -->
    <div v-if="phase === 'terminal'" class="terminal-wrapper">
      <div class="terminal-header">
        <div class="terminal-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="terminal-title">Terminal</span>
      </div>
      <div class="terminal-body">
        <div ref="terminalRef" class="terminal-output">
          <div v-for="(line, i) in terminalOutput" :key="i" class="terminal-line">
            {{ line }}
          </div>
        </div>
        <div class="terminal-input-line">
          <span class="prompt">$</span>
          <input v-model="terminalInput" type="text" class="terminal-input" placeholder="Type 'npm run dev'..."
            @keydown.enter="handleTerminalSubmit" autofocus />
        </div>
      </div>
    </div>

    <!-- Browser Phase - Yumerize Docs Mock -->
    <div v-else class="browser-wrapper">
      <div class="browser-header">
        <div class="browser-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="browser-url">
          <svg class="lock-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span>localhost:3000/docs</span>
        </div>
        <button class="browser-refresh" @click="resetBrowser" title="Refresh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
      </div>

      <div class="yumerize-ui">
        <!-- Top Bar -->
        <div class="y-topbar">
          <div class="y-logo">
            <div class="y-icon">Y</div>
            <span>Yumerize API Docs</span>
          </div>
          <button class="y-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export DOCX
          </button>
        </div>

        <div class="y-body">
          <!-- Sidebar -->
          <div class="y-sidebar">
            <div class="y-side-tabs">
              <div class="y-side-tab active">Collections</div>
              <div class="y-side-tab">History</div>
              <div class="y-side-tab">Globals</div>
            </div>
            <div class="y-side-content">
              <div class="y-search">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input :value="searchQuery" @input="handleSearchInput" placeholder="Search" class="y-search-input" />
              </div>
              <template v-if="filteredRoutes.length === 0">
                <div class="y-no-results">No routes found</div>
              </template>
              <template v-else>
                <div v-for="(groupRoutes, groupName) in routeGroups" :key="groupName">
                  <div class="y-route-group">{{ groupName }}</div>
                  <div v-for="route in groupRoutes" :key="route.id" class="y-route-item"
                    :class="{ active: selectedRouteId === route.id }" @click="handleRouteClick(route)">
                    <span class="badge" :class="route.method">{{ route.method }}</span>
                    <span class="route-path">{{ route.path }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Main Panel -->
          <div class="y-main">
            <!-- URL Bar -->
            <div class="y-url-bar">
              <select v-model="selectedMethod" class="y-method-select" :class="selectedMethod.toLowerCase()">
                <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
              </select>
              <input v-model="apiUrl" type="text" class="y-url-input" placeholder="Enter URL" />
              <button class="y-send-btn" @click="handleSendRequest" :disabled="isLoading">
                <span v-if="isLoading" class="spinner"></span>
                <span v-else>Send</span>
              </button>
            </div>

            <!-- Response -->
            <div class="y-response">
              <div v-if="statusCode === null" class="y-empty">
                <div class="empty-title">Ready to send</div>
                <div class="empty-sub">Click Send to make the request</div>
              </div>
              <div v-else class="y-response-content">
                <div class="y-status-bar">
                  <span class="status-badge"
                    :class="{ 'status-ok': statusCode < 400, 'status-err': statusCode >= 400 }">
                    {{ statusCode }}
                  </span>
                  <span class="status-label">{{ statusCode < 400 ? 'Success' : 'Error' }}</span>
                      <span class="status-label">340ms</span>
                      <span class="status-label">1.2 KB</span>
                </div>
                <div class="y-body-container">
                  <pre class="y-code">{{ JSON.stringify(responseBody, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.yumerize-demo {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}

/* Terminal Styles */
.terminal-wrapper {
  background: #0d0e14;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #13141c;
  border-bottom: 1px solid #2a2d3e;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red {
  background: #ff5f57;
}

.dot.yellow {
  background: #febc2e;
}

.dot.green {
  background: #28c840;
}

.terminal-title {
  font-size: 12px;
  color: #8b8fa8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.terminal-body {
  padding: 16px;
  min-height: 240px;
  max-height: 400px;
  overflow-y: auto;
}

.terminal-line {
  margin: 4px 0;
  color: #e2e4f0;
  font-size: 13px;
  line-height: 1.6;
}

.terminal-input-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.prompt {
  color: #34d399;
  font-weight: 600;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e4f0;
  font-size: 13px;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  outline: none;
}

.terminal-input::placeholder {
  color: #4e526a;
}

/* Browser / Yumerize UI Styles */
.browser-wrapper {
  background: #0d0e14;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.browser-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #1c1e28;
  border-bottom: 1px solid #2a2d3e;
}

.browser-dots {
  display: flex;
  gap: 6px;
}

.browser-url {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0d0e14;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #8b8fa8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.lock-icon {
  flex-shrink: 0;
  color: #34d399;
}

.browser-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid #2a2d3e;
  border-radius: 6px;
  color: #8b8fa8;
  cursor: pointer;
  transition: all 0.15s;
}

.browser-refresh:hover {
  color: #e2e4f0;
  background: #1c1e28;
  border-color: #4e526a;
}

.browser-refresh svg {
  flex-shrink: 0;
}

/* Yumerize UI */
.yumerize-ui {
  display: flex;
  flex-direction: column;
  height: 420px;
  background: #0d0e14;
}

.y-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  height: 44px;
  border-bottom: 1px solid #2a2d3e;
  background: #13141c;
}

.y-logo {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  font-size: 14px;
  color: #f97316;
}

.y-icon {
  width: 26px;
  height: 26px;
  background: #f97316;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}

.y-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 5px 8px;
  border-radius: 6px;
  color: #8b8fa8;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.y-btn:hover {
  color: #e2e4f0;
  background: #1c1e28;
}

.y-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.y-sidebar {
  width: 220px;
  border-right: 1px solid #2a2d3e;
  background: #13141c;
  display: flex;
  flex-direction: column;
}

.y-side-tabs {
  display: flex;
  border-bottom: 1px solid #2a2d3e;
}

.y-side-tab {
  flex: 1;
  padding: 9px 0;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #4e526a;
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 2px solid transparent;
}

.y-side-tab:hover {
  color: #8b8fa8;
}

.y-side-tab.active {
  color: #f97316;
  border-bottom-color: #f97316;
  background: rgba(249, 115, 22, 0.09);
}

.y-side-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.y-search {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px 8px;
  background: #1c1e28;
  border: 1px solid #2a2d3e;
  border-radius: 6px;
}

.y-search input {
  background: none;
  border: none;
  color: #e2e4f0;
  font-size: 12px;
  outline: none;
  flex: 1;
}

.y-no-results {
  padding: 24px 12px;
  text-align: center;
  color: #4e526a;
  font-size: 12px;
}

.y-route-group {
  padding: 6px 6px;
  font-size: 11px;
  font-weight: 600;
  color: #8b8fa8;
}

.y-route-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px;
  cursor: pointer;
  border-radius: 6px;
  color: #8b8fa8;
  font-size: 12px;
  transition: background 0.15s;
}

.y-route-item:hover {
  background: #1c1e28;
  color: #e2e4f0;
}

.y-route-item.active {
  background: rgba(249, 115, 22, 0.09);
  color: #e2e4f0;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  min-width: 46px;
  border: 1px solid transparent;
}

.badge.GET {
  color: #34d399;
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.2);
}

.badge.POST {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.2);
}

.badge.PUT {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.08);
  border-color: rgba(96, 165, 250, 0.2);
}

.badge.DELETE {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.2);
}

/* Main Panel */
.y-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.y-url-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #2a2d3e;
}

.y-method-select {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-weight: 700;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  background: #0d0e14;
  outline: none;
  color: #e2e4f0;
  transition: all 0.15s;
}

.y-method-select.GET {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.25);
}

.y-method-select.POST {
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.25);
}

.y-method-select.PUT {
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.25);
}

.y-method-select.PATCH {
  color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.25);
}

.y-method-select.DELETE {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.25);
}

.y-url-input {
  flex: 1;
  background: #1c1e28;
  border: 1px solid #2a2d3e;
  border-radius: 6px;
  padding: 7px 12px;
  color: #e2e4f0;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
}

.y-url-input:focus {
  border-color: rgba(249, 115, 22, 0.45);
}

.y-send-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  background: #f97316;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.y-send-btn:hover {
  background: #ea6c0a;
}

.y-send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Response */
.y-response {
  flex: 1;
  overflow: hidden;
}

.y-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4e526a;
  gap: 8px;
}

.empty-icon {
  font-size: 40px;
  opacity: 0.3;
}

.empty-title {
  font-size: 15px;
  color: #8b8fa8;
}

.empty-sub {
  font-size: 12px;
  text-align: center;
  max-width: 280px;
}

.y-response-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.y-status-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 12px;
  border-bottom: 1px solid #2a2d3e;
  font-size: 12px;
}

.status-badge {
  font-weight: 700;
}

.status-ok {
  color: #34d399;
}

.status-err {
  color: #f87171;
}

.status-label {
  color: #8b8fa8;
}

.y-body-container {
  flex: 1;
  overflow-y: auto;
  background: #0d0e14;
}

.y-code {
  padding: 12px;
  margin: 0;
  color: #e2e4f0;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;
}
</style>
