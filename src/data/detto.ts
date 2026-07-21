export interface PainPoint {
  title: string
  desc: string
}

export interface CoreFeature {
  title: string
  desc: string
}

export interface ShowcaseDemo {
  heading: string
  subtitle: string
}

export interface DettoPageData {
  tagline: string
  techBadges: string[]
  problem: {
    label: string
    title: string
    painPoints: PainPoint[]
  }
  concept: {
    label: string
    title: string
    quote: string
    desc: string
  }
  coreFeatures: {
    label: string
    title: string
    items: CoreFeature[]
  }
  showcase: {
    label: string
    title: string
    subtitle: string
    demos: ShowcaseDemo[]
  }
  cta: {
    heading: string
    subtitle: string
    buttonLabel: string
    buttonHref: string
  }
}

const dettoData: DettoPageData = {
  tagline:
    'A shared, private space where couples plan dates, save photos to the moments they belong to, and watch their relationship take shape as one continuous timeline — no feed, no algorithm, just the two of you and what you`ve built together.',

  techBadges: [
    'Dating',
    'Gallery',
    'Archive',
    'Moment',
    'Whislist',
    'Relationship',
  ],

  problem: {
    label: 'Problem That We Faced',
    title: 'Why couples need a better\nshared space',
    painPoints: [
      {
        title: 'Forgotten Moments',
        desc: 'The small things that made you fall in love — inside jokes, first dates, meaningful conversations — disappear in endless message threads and scattered photos.',
      },
      {
        title: 'Missed Important Dates',
        desc: "Anniversaries pass unnoticed, date nights get forgotten, and promises made over coffee slip away because there's no gentle way to remember together.",
      },
      {
        title: 'No Space Just for Two',
        desc: "Everything shared between you lives in apps designed for everyone else — your personal photos mix with work presentations, your plans sit next to family obligations.",
      },
      {
        title: 'Lost Story Together',
        desc: "Without a dedicated place to document your journey, years of love and growth fade. You're building something beautiful together, but where does that story live?",
      },
    ],
  },

  concept: {
    label: 'The Concept',
    title: 'A quiet, intimate space\nbuilt for two',
    quote:
      "Detto represents what you've said to each other — promises made, moments shared, and the story only the two of you truly understand.",
    desc: 'Not another app to manage. A quiet corner of the digital world where your relationship lives — preserved, celebrated, and always growing together.',
  },

  coreFeatures: {
    label: 'Core Features',
    title: 'What Detto actually does',
    items: [
      {
        title: 'Private Room for Two',
        desc: 'A space that feels intimate and exclusive. Only you and your partner can enter — creating a digital home for your relationship.',
      },
      {
        title: 'Never Forget What Matters',
        desc: 'Track anniversaries, date nights, and special occasions together. Gentle reminders keep you both present for the moments that matter.',
      },
      {
        title: 'Notes That Feel Human',
        desc: "Leave sweet messages that fade naturally — like whispers between two people. They don't last forever, and that's exactly what makes them special.",
      },
      {
        title: 'Dream Together',
        desc: 'Build a shared wishlist of places to visit, things to try, and experiences you want to share. Turn wishes into plans, plans into memories.',
      },
      {
        title: 'Your Story, Organized',
        desc: 'Every photo tied to the moment it was captured — dates, places, and the feelings that made it special. Your gallery becomes your love story.',
      },
      {
        title: 'Always Close',
        desc: "Install like an app, get notifications that matter. Detto stays with you throughout your day, keeping your relationship close even when you're apart.",
      },
    ],
  },

  showcase: {
    label: 'Showcase',
    title: 'Try Detto in 60 seconds',
    subtitle:
      'Interactive demos showcasing the core features. Try them right here — all state is in-memory.',
    demos: [
      {
        heading: 'Plan moments that matter',
        subtitle:
          'See your shared calendar in action. Date nights, anniversaries, and everything in between.',
      },
      {
        heading: "Never miss what's important",
        subtitle:
          'Experience gentle reminders that keep you both present. No more forgotten dates or missed moments.',
      },
      {
        heading: 'Your love story, organized',
        subtitle:
          'Browse memories linked to the moments they belong to. Every photo has context, nothing gets lost.',
      },
    ],
  },

  cta: {
    heading: 'Build your love story together',
    subtitle:
      'Start creating memories that last. Detto is designed for couples who want to stay connected, organized, and present for each other.',
    buttonLabel: 'Try Detto',
    buttonHref: 'https://detto.notu.dev',
  },
}

export default dettoData
