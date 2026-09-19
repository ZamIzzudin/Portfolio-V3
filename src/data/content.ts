export const hero = {
  titleLines: 'Azzam Izzudin',
  paragraphs: 'Fullstack Developer',
  socials: [
    {
      name: 'Linkedin',
      href: 'https://www.linkedin.com/in/azzam-izzudin-hasan/',
      icon: 'linkedin',
    },
    {
      name: 'Github',
      href: 'https://github.com/ZamIzzudin',
      icon: 'github',
    },
    {
      name: 'Discord',
      href: 'https://discord.com/users/533661901977026580',
      icon: 'discord',
    },
    { name: 'X', href: 'https://x.com/KakUdinnn', icon: 'x' },

    {
      name: 'Instagram',
      href: 'https://www.instagram.com/ayamiyudin',
      icon: 'instagram',
    },
    {
      name: 'Threads',
      href: 'https://www.threads.com/@wikinsayt',
      icon: 'threads',
    },
    {
      name: 'Spotify',
      href: 'https://open.spotify.com/user/312as7rzwm7nwou7nfeubv7dadxe?nd=1&dlsi=119d20d0eee3436d   ',
      icon: 'spotify',
    },
  ],
}

export const featureBanners = [
  {
    eyebrow: 'Digital Wedding Invitation',
    title: 'Nalla',
    description:
      'A curated digital wedding invitation platform — personalized WhatsApp delivery, a real-time RSVP dashboard, QR guest check-in, and a guest-camera photobook, in one elegant flow.',
    cta: 'Explore More',
    to: '/project/nalla',
    href: '',
    image: '/banner/banner_nalla.png',
    reverse: true,
  },
  {
    eyebrow: 'TOEFL/IELTS Simulation',
    title: 'Wikin',
    description:
      'Wikin helps you prepare with AI-powered simulations, actionable performance insights, and flexible IELTS/TOEFL pathways tailored to your goals.',
    cta: 'Explore More',
    to: '/project/wikin',
    href: '',
    image: '/banner/banner_wikin.png',
    reverse: false,
  },
  {
    eyebrow: 'Date ',
    title: 'Detto',
    description:
      'A shared, private space where couples plan dates, save photos to the moments they belong to, and watch their relationship take shape as one continuous timeline — no feed, no algorithm, just the two of you and what you`ve built together.',
    cta: 'Explore More',
    to: '/project/detto',
    href: '',
    image: '/banner/banner_detto.png',
    reverse: true,
  },
  {
    eyebrow: 'Daily AI WhatsApp Agent',
    title: 'NicheU',
    description:
      'A personal AI agent that lives inside WhatsApp — with a self-defined persona, long-term memory, a daily routine, and the ability to message you first.',
    cta: 'Explore More',
    to: '/project/nicheu',
    href: '',
    image: '/banner/banner_niche.png',
    reverse: false,
  },
  {
    eyebrow: 'Rest API Documentation',
    title: 'Yumerize',
    description:
      'Lightweight API Docs for Node.js Zero-config,  No YAML, no decorators, no setup files and will auto-discovers your routes, and serves a beautiful UI to explore and test your endpoints.',
    cta: 'Explore More',
    to: '/project/yumerize',
    href: '',
    image: '/banner/banner_yumerize.png',
    reverse: true,
  },
  {
    eyebrow: 'Debugger',
    title: 'FindChange',
    description:
      'Trace state changes and capture all console.* output in a dedicated popup window with timestamps and file locations. Safe for production - logs are suppressed, states are no-ops.',
    cta: 'Explore More',
    to: '/project/findchange',
    href: '',
    image: '/banner/banner_findchange.png',
    reverse: false,
  },
]

export interface FeatureBanner {
  eyebrow: string
  title: string
  description: string
  cta: string
  to?: string
  href?: string
  image: string
  reverse: boolean
}

export interface TechStackGroup {
  label: string
  items: string[]
}

export const techStack: TechStackGroup[] = [
  {
    label: 'Languages',
    items: ['Javascript', 'Typescript', 'Golang', 'Python', 'Solidity'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Next', 'Vue', 'Nuxt', 'Tailwind CSS', 'Zustand', 'Pinia'],
  },
  {
    label: 'Backend',
    items: [
      'Express',
      'NestJS',
      'Gin',
      'Fastify',
      'Postgre',
      'MongoDB',
      'Minio',
    ],
  },
  {
    label: 'Tools & Infra',
    items: ['Docker', 'LLM & Agentic AI', 'Redis', 'RabbitMQ', 'GCP', 'AWS'],
  },
]

export interface ExperienceItem {
  company: string
  role: string
  period: string
  location?: string
}

export const experience = {
  resumeUrl: '/Resume%20-%20Azzam%20Izzudin%20Hasan.pdf',
  items: [
    {
      company: 'Nutech Integrasi',
      role: 'Frontend Developer',
      period: 'Nov 2024 — Present',
      location: 'Jakarta, Indonesia',
    },
    {
      company: 'Notu Teams',
      role: 'Fullstack Developer',
      period: 'Jul 2023 — Apr 2026',
      location: 'Jakarta, Indonesia',
    },
    {
      company: 'Jojonomic Indonesia',
      role: 'OOS Implementor',
      period: 'Feb 2023 — Jul 2023',
      location: 'Jakarta, Indonesia',
    },
  ] as ExperienceItem[],
}

export const navLinks = [
  { label: 'My Work', to: '#project', href: '/#project' },
  // { label: 'Blog', to: '#blog' },
  { label: 'Contact', to: '#contact', href: '/#contact' },
]

export const footer = {
  columns: [
    {
      title: 'Pages',
      links: [
        { label: 'Archive', href: 'https://naoto.themex.studio/archive/' },
        { label: 'Categories', href: 'https://naoto.themex.studio/tags/' },
        { label: 'Author', href: 'https://naoto.themex.studio/author/naoto/' },
        { label: '404', href: 'https://naoto.themex.studio/404/' },
      ],
    },
    {
      title: 'Templates',
      links: [
        {
          label: 'Landing Page',
          href: 'https://naoto.themex.studio/multiple-landing-page/',
        },
        {
          label: 'Collection',
          href: 'https://naoto.themex.studio/aesthetic-goods/',
        },
        { label: 'LinkBio', href: 'https://naoto.themex.studio/links/' },
        { label: 'Now', href: 'https://naoto.themex.studio/now/' },
        { label: 'Series', href: 'https://naoto.themex.studio/series/' },
        {
          label: 'Timeline',
          href: 'https://naoto.themex.studio/naoto-timeline/',
        },
      ],
    },
    {
      title: 'Post templates',
      links: [
        { label: 'Default', href: 'https://naoto.themex.studio/' },
        { label: 'Wide', href: 'https://naoto.themex.studio/' },
        { label: 'Full', href: 'https://naoto.themex.studio/showcase-one/' },
        { label: 'Split Narrow', href: 'https://naoto.themex.studio/' },
        { label: 'Split Wide', href: 'https://naoto.themex.studio/' },
        { label: 'No Image', href: 'https://naoto.themex.studio/' },
      ],
    },
  ],
  copyright: '© 2026 Azzam Izzudin',
}
