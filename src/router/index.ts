import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Personal Portfolio - Azzam' },
  },
  {
    path: '/project/wikin',
    name: 'project-wikin',
    component: () => import('@/views/WikinProjectView.vue'),
    meta: { title: 'Wikin — AI-Powered TOEFL & IELTS Simulator' },
  },
  {
    path: '/project/detto',
    name: 'project-detto',
    component: () => import('@/views/DettoProjectView.vue'),
    meta: { title: 'Detto — A Small Space for Your Story, Together' },
  },
  {
    path: '/project/yumerize',
    name: 'project-yumerize',
    component: () => import('@/views/YumerizeProjectView.vue'),
    meta: { title: 'Yumerize — Lightweight API Docs & Hitter for Node.js' },
  },
  {
    path: '/project/findchange',
    name: 'project-findchange',
    component: () => import('@/views/FindchangeProjectView.vue'),
    meta: { title: 'Findchange — React State Watcher & Console Capture Tool' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title || 'Naoto of Themex'
})

export default router
