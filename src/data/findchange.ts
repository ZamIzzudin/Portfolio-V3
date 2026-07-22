export interface PainPoint {
  title: string
  desc: string
}

export interface CoreFeature {
  title: string
  desc: string
}

export interface FindchangePageData {
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
  }
  cta: {
    heading: string
    subtitle: string
    buttonLabel: string
    buttonHref: string
  }
}

const findchangeData: FindchangePageData = {
  tagline:
    'A React state watcher and console capture tool with a separate debug window for real-time state tracing and log monitoring during development.',

  techBadges: [
    'React',
    'Debug',
    'State Watcher',
    'DevTools',
    'Development',
    'Tracing',
    'Console',
    'Logger',
    'SSR',
  ],

  problem: {
    label: 'Problem That We Faced',
    title: 'Why debugging React apps\nfeels chaotic',
    painPoints: [
      {
        title: 'Console Pollution',
        desc: 'We sprinkle console.log everywhere to track state changes, but these logs get lost in the sea of other output. Switching between the inspector and console is tedious and breaks flow.',
      },
      {
        title: 'No Continuous Visibility',
        desc: 'React DevTools shows state at a point in time, but you have to keep the inspector panel open and constantly refresh to see what changed. There is no persistent view while you code.',
      },
      {
        title: 'Production Log Leakage',
        desc: 'Debug logs accidentally shipped to production leak internal details, confuse end users, and create security concerns. Removing them manually before every build is error-prone.',
      },
      {
        title: 'SSR Log Blindspots',
        desc: 'Server-side logs never appear in the browser console. You have to dig through server terminals to debug hydration mismatches, data fetching errors, or render failures.',
      },
    ],
  },

  concept: {
    label: 'The Approach',
    title: 'A dedicated window\nfor debugging',
    quote:
      'Stop sprinkling console.log. Watch your state in a separate popup window that updates in real-time.',
    desc: 'Findchange creates a dedicated debug popup that stays open while you code. States update instantly as they change, and all console calls are captured with timestamps and file locations. Production-safe, SSR-safe, and completely invisible in your app until you need it.',
  },

  coreFeatures: {
    label: 'Core Features',
    title: 'What Findchange actually does',
    items: [
      {
        title: 'Separate Debug Window',
        desc: 'Popup window (not a tab) that stays open while you code. Your app and debug view live side by side, so you can interact with components and watch state changes simultaneously.',
      },
      {
        title: 'Real-time State Watcher',
        desc: 'Track any React state with useDebugState(). States reflect instantly as they change, with collapsible JSON blocks. Fold/unfold preference persists across refreshes.',
      },
      {
        title: 'Smart Auto-sorting',
        desc: 'Recently changed states automatically float to the top, so you always see what is actively evolving. The list stays organized without manual sorting.',
      },
      {
        title: 'Console Override',
        desc: 'Capture all console.* methods (log, warn, error, info, debug, trace, table, dir, group) with timestamps and file locations. Logs appear in the Console tab of the debug window.',
      },
      {
        title: 'Tabbed Popup Interface',
        desc: 'Automatically shows tabs for whichever features you enable — Watcher, Console, or both. Clean interface tailored to your debugging workflow.',
      },
      {
        title: 'SSR & Production Safe',
        desc: 'Works on both client and server without crashing. In production, all hooks become no-ops and console calls are suppressed (zero bundle impact, no log leakage).',
      },
    ],
  },

  showcase: {
    label: 'Showcase',
    title: 'Try Findchange in 60 seconds',
    subtitle:
      'Interactive demos showcasing the core features. Try them right here — all state is in-memory.',
  },

  cta: {
    heading: 'Stop guessing.\nStart watching.',
    subtitle:
      'One component, one hook, and you have a dedicated debug window that updates in real-time. Install Findchange and debug React apps the way they were meant to be debugged.',
    buttonLabel: 'Try FindChange',
    buttonHref: 'https://github.com/NotuTeam/FindChange',
  },
}

export default findchangeData
