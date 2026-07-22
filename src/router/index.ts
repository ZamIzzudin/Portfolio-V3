import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Azzam Izzudin Hasan - Web Developer & Portfolio',
      description: 'Azzam Izzudin Hasan - Web Developer specializing in Vue.js, React, Node.js. Explore projects like Wikin, Detto, Yumerize, and FindChange.',
      image: 'https://azzamizzudin.dev/og-image.png',
      url: 'https://azzamizzudin.dev/',
      type: 'website'
    },
  },
  {
    path: '/project/wikin',
    name: 'project-wikin',
    component: () => import('@/views/WikinProjectView.vue'),
    meta: {
      title: 'Wikin — AI-Powered TOEFL & IELTS Simulator',
      description: 'Wikin helps you prepare with AI-powered simulations, actionable performance insights, and flexible IELTS/TOEFL pathways tailored to your goals.',
      image: 'https://azzamizzudin.dev/og-image.png',
      url: 'https://azzamizzudin.dev/project/wikin',
      type: 'article'
    },
  },
  {
    path: '/project/detto',
    name: 'project-detto',
    component: () => import('@/views/DettoProjectView.vue'),
    meta: {
      title: 'Detto — A Small Space for Your Story, Together',
      description: 'A shared, private space where couples plan dates, save photos to the moments they belong to, and watch their relationship take shape as one continuous timeline.',
      image: 'https://azzamizzudin.dev/og-image.png',
      url: 'https://azzamizzudin.dev/project/detto',
      type: 'article'
    },
  },
  {
    path: '/project/yumerize',
    name: 'project-yumerize',
    component: () => import('@/views/YumerizeProjectView.vue'),
    meta: {
      title: 'Yumerize — Lightweight API Docs & Hitter for Node.js',
      description: 'Lightweight API Docs for Node.js Zero-config, No YAML, no decorators, no setup files and will auto-discovers your routes, and serves a beautiful UI to explore and test your endpoints.',
      image: 'https://azzamizzudin.dev/og-image.png',
      url: 'https://azzamizzudin.dev/project/yumerize',
      type: 'article'
    },
  },
  {
    path: '/project/findchange',
    name: 'project-findchange',
    component: () => import('@/views/FindchangeProjectView.vue'),
    meta: {
      title: 'Findchange — React State Watcher & Console Capture Tool',
      description: 'Trace state changes and capture all console.* output in a dedicated popup window with timestamps and file locations. Safe for production.',
      image: 'https://azzamizzudin.dev/og-image.png',
      url: 'https://azzamizzudin.dev/project/findchange',
      type: 'article'
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 - Page Not Found',
      description: 'The page you are looking for does not exist.',
      image: 'https://azzamizzudin.dev/og-image.png',
      url: 'https://azzamizzudin.dev/404',
      type: 'website',
      robots: 'noindex'
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  const meta = to.meta

  // Update title
  document.title = (meta.title as string) || 'Azzam Izzudin Hasan'

  // Update meta description
  updateMetaTag('description', meta.description as string)

  // Update Open Graph tags
  updateMetaTag('og:title', meta.title as string, 'property')
  updateMetaTag('og:description', meta.description as string, 'property')
  updateMetaTag('og:image', meta.image as string, 'property')
  updateMetaTag('og:url', meta.url as string, 'property')
  updateMetaTag('og:type', meta.type as string, 'property')

  // Update Twitter tags
  updateMetaTag('twitter:title', meta.title as string, 'name')
  updateMetaTag('twitter:description', meta.description as string, 'name')
  updateMetaTag('twitter:image', meta.image as string, 'name')

  // Update canonical link
  updateCanonicalLink(meta.url as string)

  // Update robots meta
  updateMetaTag('robots', (meta.robots as string) || 'index, follow', 'name')

  // Update JSON-LD structured data
  updateJsonLd(to)
})

function updateMetaTag(name: string, content: string, type: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${type}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(type, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function updateCanonicalLink(url: string) {
  let element = document.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', url)
}

function updateJsonLd(route: any) {
  // Remove existing JSON-LD
  const existing = document.getElementById('json-ld')
  if (existing) {
    existing.remove()
  }

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Azzam Izzudin Hasan',
    jobTitle: 'Web Developer',
    email: 'azzamizzudinhasan@gmail.com',
    url: 'https://azzamizzudin.dev/',
    sameAs: [
      'https://www.linkedin.com/in/azzam-izzudin-hasan/',
      'https://github.com/ZamIzzudin',
      'https://discord.com/users/533661901977026580',
      'https://x.com/KakUdinnn',
      'https://www.instagram.com/hasanizzud',
      'https://www.threads.com/@hasanizzud',
    ],
    description: 'Web Developer specializing in Vue.js, React, Node.js',
    knowsAbout: ['Vue.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
  }

  const script = document.createElement('script')
  script.id = 'json-ld'
  script.type = 'application/ld+json'

  // Add project schema for project pages
  if (route.name?.toString().startsWith('project-')) {
    const projectSchema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: route.meta.title,
      description: route.meta.description,
      url: route.meta.url,
      author: {
        '@type': 'Person',
        name: 'Azzam Izzudin Hasan',
        url: 'https://azzamizzudin.dev/',
      },
    }
    script.textContent = JSON.stringify([baseSchema, projectSchema])
  } else {
    script.textContent = JSON.stringify(baseSchema)
  }

  document.head.appendChild(script)
}

export default router
