export interface PainPoint {
  title: string
  desc: string
}

export interface CoreFeature {
  title: string
  desc: string
}

export interface GalleryItem {
  src: string
  alt: string
}

export interface WikinPageData {
  techBadges: string[]
  painPoints: PainPoint[]
  coreFeatures: CoreFeature[]
  gallery: {
    label: string
    title: string
    subtitle: string
    items: GalleryItem[]
  }
  cta: {
    heading: string
    subtitle: string
    buttonLabel: string
    buttonHref: string
  }
}

const wikinData: WikinPageData = {
  techBadges: ['TOEFL', 'IELTS', 'Education', 'Simulation', 'AI Support'],

  painPoints: [
    {
      title: 'No Clear Starting Point',
      desc: 'Most students dive into IELTS or TOEFL prep without a diagnostic baseline. They waste weeks on material they already know while neglecting the gaps that actually cost band points.',
    },
    {
      title: 'Unstructured Practice',
      desc: 'Without adaptive difficulty, practice becomes a coin flip — too easy and nothing sticks, too hard and confidence drops. Fixed-question banks also mean students eventually memorize answers instead of building skills.',
    },
    {
      title: 'Hard to Track Progress',
      desc: 'Paper tests and scattered apps give no unified view of improvement. Students finish dozens of exercises but still cannot answer the critical question: "Am I actually getting closer to my target band?"',
    },
    {
      title: 'Weak Area Blindspot',
      desc: 'Reading, listening, writing, speaking — each section has dozens of sub-skills. Without granular analytics, students keep repeating the same mistakes in areas they did not even realize were dragging their score down.',
    },
  ],

  coreFeatures: [
    {
      title: 'Infinite Fresh Questions',
      desc: 'Never practice the same test twice. Our AI generates unique questions for every session, ensuring you face new challenges that mirror the actual exam format.',
    },
    {
      title: 'Instant Results & Review',
      desc: 'Get your comprehensive score breakdown the moment you finish. Review your answers, see correct responses, and understand your mistakes immediately.',
    },
    {
      title: 'Smart Progress Dashboard',
      desc: 'Track your improvement across all sections with visual analytics. See how your band scores evolve over time.',
    },
  ],

  gallery: {
    label: 'Project Showcase',
    title: 'A closer look at the experience',
    subtitle:
      'Browse through the key screens that make Wikin feel intuitive and focused on what matters — your progress.',
    items: [
      {
        src: '/screenshots/wikin-01.png',
        alt: 'Wikin dashboard overview',
      },
      {
        src: '/screenshots/wikin-02.png',
        alt: 'Adaptive quiz session',
      },
      {
        src: '/screenshots/wikin-03.png',
        alt: 'Progress analytics dashboard',
      },
    ],
  },

  cta: {
    heading: 'Ready to start preparing the right way?',
    subtitle:
      'Stop guessing and start improving. Try Wikin now and see where your practice can take you.',
    buttonLabel: 'Visit Wikin',
    buttonHref: 'https://wikin.app',
  },
}

export default wikinData
