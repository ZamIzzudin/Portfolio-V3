export const hero = {
  titleLines: 'Azzam Izzudin',
  paragraphs: 'Web Developer',
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
      href: 'https://www.instagram.com/hasanizzud',
      icon: 'instagram',
    },
    {
      name: 'Threads',
      href: 'https://www.threads.com/@hasanizzud',
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
    eyebrow: 'Rest API Documentation',
    title: 'Yumerize',
    description:
      'Lightweight API Docs for Node.js Zero-config,  No YAML, no decorators, no setup files and will auto-discovers your routes, and serves a beautiful UI to explore and test your endpoints.',
    cta: 'Explore More',
    to: '/project/yumerize',
    href: '',
    image:
      'https://cdn.synaps.media/naoto/content/images/2025/08/static-banner02.jpg',
    reverse: false,
  },
  {
    eyebrow: 'Debugger',
    title: 'FindChange',
    description:
      'Trace state changes and capture all console.* output in a dedicated popup window with timestamps and file locations. Safe for production - logs are suppressed, states are no-ops.',
    cta: 'Explore More',
    to: '/project/findchange',
    href: '',
    image:
      'https://cdn.synaps.media/naoto/content/images/2025/08/static-banner01.jpg',
    reverse: true,
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

export const newsletters = [
  {
    tag: 'Newsletter',
    date: '01 May',
    title: 'Newsletter #001 — Building Naoto →',
    excerpt:
      'How a frustrating theme customization session led to 6 months of obsessive design work. The decisions, mistakes, and late-night coding that shaped Naoto into what it is today.',
    href: 'https://naoto.themex.studio/newsletter-001-building-naoto/',
  },
  {
    tag: 'Newsletter',
    date: '01 May',
    title: 'Newsletter #002 — 5 Homepage Layouts That Actually Convert →',
    excerpt:
      'Real examples from Naoto users who turned their Ghost sites into client magnets. See how the right section combinations can double your newsletter signups and portfolio inquiries.',
    href: 'https://naoto.themex.studio/newsletter-002-5-homepage-layouts-that-actually-convert/',
  },
  {
    tag: 'Newsletter',
    date: '01 May',
    title: 'Newsletter #003 — The Psychology of Clean Design →',
    excerpt:
      'Why minimal themes perform better than feature-packed ones. The cognitive science behind why your visitors stay longer and engage more with simplified layouts.',
    href: 'https://naoto.themex.studio/newsletter-003-the-psychology-of-clean-design/',
  },
]

export const latestUpdate = {
  label: 'Latest Update',
  date: 'Jul 25, 2025',
  text: "Officially featured by Ghost as a recommended theme. From late-night coding sessions to Ghost's homepage. Sometimes the simple idea is the right idea. Thank you to every creator who believed in clean design.",
  video: 'https://cdn.synaps.media/naoto/content/media/2025/07/demo.mp4',
  poster: 'https://cdn.synaps.media/naoto/content/media/2025/07/demo_thumb.jpg',
}

export const goods = {
  title: 'Useful Tools',
  items: [
    {
      brand: 'Ligre',
      name: 'Ligre Youn',
      description:
        'Finest classic espresso and milk foam quality in 10 textures',
      image:
        'https://cdn.synaps.media/naoto/content/images/size/w750/format/webp/2025/07/Goods-2025-07-10_15_20--2-.jpg',
      href: 'https://ligre.com/en/produkt/ligre-youn/',
    },
    {
      brand: 'Native Union',
      name: '(Re)Classic Wallet',
      description:
        'Modern, minimalist profile for an easy-to-match everyday things',
      image:
        'https://cdn.synaps.media/naoto/content/images/size/w750/format/webp/2025/07/Goods-2025-07-10_15_19--2-.jpg',
      href: 'https://www.nativeunion.com/products/clic-reclassic-wallet',
    },
    {
      brand: 'Logitech',
      name: 'StreamCam',
      description: 'You always look your best in any lighting',
      image:
        'https://cdn.synaps.media/naoto/content/images/size/w750/format/webp/2025/07/Goods-2025-07-10_15_20.jpg',
      href: 'https://www.logitech.com/en-gb/products/webcams/streamcam.960-001281.html',
    },
  ],
}

export const books = {
  title: 'Book List',
  items: [
    {
      author: 'Ed Catmull',
      title: 'Creativity, Inc',
      description:
        'From Ed Catmull, co-founder of Pixar, comes an incisive book about creativity in business.',
      image:
        'https://cdn.synaps.media/naoto/content/images/size/w750/format/webp/2025/07/Creativity-Inc-cover.webp',
      href: 'https://naoto.themex.studio/creativity-inc/',
    },
    {
      author: 'Tom Kelley',
      title: 'The Good Creative',
      description:
        'Principles and strategies that will allow us to tap into our creative potential in our work lives, and in our personal lives.',
      image:
        'https://cdn.synaps.media/naoto/content/images/size/w750/format/webp/2025/07/Good-Creative-Book-Cover.webp',
      href: 'https://naoto.themex.studio/creative-confidence/',
    },
    {
      author: '37 Signals',
      title: 'Getting Real',
      description:
        'From Basecamp creator, a good book which highlights the traditional rubbish and points out how to overcome them',
      image:
        'https://cdn.synaps.media/naoto/content/images/size/w750/format/webp/2025/07/Getting-Real-book-cover.webp',
      href: 'https://naoto.themex.studio/getting-real/',
    },
  ],
}

export const showcases = {
  title: 'Portfolio Showcase',
  items: [
    {
      tag: 'Color exploration',
      title: 'Showcase One',
      description: 'A 30% Productivity Boost and Accelerated Growth',
      image:
        'https://images.unsplash.com/photo-1617957796155-72d8717ac882?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1140',
      href: 'https://naoto.themex.studio/showcase-one/',
    },
    {
      tag: 'Color exploration',
      title: 'Showcase Three',
      description:
        'I needed something professional but not corporate. Naoto strikes that perfect balance. The resource sections help me showcase my expertise, and the dark mode is a nice touch for evening readers.',
      image:
        'https://images.unsplash.com/photo-1487017931017-0e0d9e02bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1140',
      href: 'https://naoto.themex.studio/showcase-three/',
    },
    {
      tag: 'Color exploration',
      title: 'Showcase Two',
      description:
        'I needed something professional but not corporate. Naoto strikes that perfect balance. The resource sections help me showcase my expertise, and the dark mode is a nice touch for evening readers.',
      image:
        'https://images.unsplash.com/photo-1577451581377-523b0a03bb6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1140',
      href: 'https://naoto.themex.studio/showcase-two/',
    },
    {
      tag: 'Color exploration',
      title: 'Showcase Four',
      description: 'A 30% Productivity Boost and Accelerated Growth',
      image:
        'https://images.unsplash.com/photo-1598759473345-d8d3239a25bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1140',
      href: 'https://naoto.themex.studio/showcase-four/',
    },
  ],
}

export const customContent = {
  title: 'Last, but not least...',
  description:
    'Build a flexible landing page with your own content right from Ghost admin, by creating a custom page where the content can be displayed.',
  cta: 'Learn how',
  href: 'https://naoto.themex.studio/',
  image:
    'https://cdn.synaps.media/naoto/content/images/size/w1600/2025/07/16f6cf8049413320752bc938df267d8da5b8357c-4112x1888.png',
}

export const closing = {
  lines: ['Clean.', 'Minimal.', 'Flexible.', 'Ready in minutes.'],
  features: [
    {
      title: '10+ Homepage Sections',
      description:
        'Hero intro, blog posts, work showcase, testimonials, resource lists, logo wall, event calendar, experience timeline, newsletter updates, content blocks, static banners.',
    },
    {
      title: 'Page Templates',
      description:
        'Portfolio showcase, goods collection, linktree, series, events, blog, and more',
    },
    {
      title: 'Built-In Features',
      description:
        'Light/dark mode, color presets, responsive design, table of contents, comment, signup',
    },
  ],
  mockups: [
    'https://cdn.synaps.media/naoto/content/images/size/w1000/2025/07/651shots_so-1.png',
    'https://cdn.synaps.media/naoto/content/images/size/w1600/2025/07/4316c6b52463085a8d8ab47875d85a497ba49f76-4112x1888.png',
  ],
  finalTitle: 'No code. No complexity.',
  finalSubtitle: 'And no limits on what you can build.',
  cta: 'Purchase now',
  ctaHref:
    'https://themex.lemonsqueezy.com/buy/d40f0dd0-36f0-4878-a344-1dde482db7c9?ref=naoto.themex.studio',
}

export const navLinks = [
  { label: 'My Work', to: '#project' },
  { label: 'Blog', to: '#blog' },
  { label: 'Contact', to: '#contact' },
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
  copyright: '© 2026 Azzam Izzudin Hasan.',
  credit: 'Made using Vue + Vite + Tailwind',
}
