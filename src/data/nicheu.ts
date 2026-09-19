export interface PainPoint {
  title: string
  desc: string
}

export interface CoreFeature {
  title: string
  desc: string
}

export interface NicheuPageData {
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

const nicheuData: NicheuPageData = {
  tagline:
    'A personal AI agent that lives inside WhatsApp — with a self-defined persona, a fictional daily routine, long-term memory, and the ability to message you first.',

  techBadges: [
    'TypeScript',
    'Express',
    'MongoDB',
    'Baileys',
    'LLM',
    'Next.js',
    'Docker',
    'Agentic AI',
  ],

  problem: {
    label: 'Problem That We Faced',
    title: 'Why most chatbots\nfeel lifeless',
    painPoints: [
      {
        title: 'Stateless Replies',
        desc: 'Typical Q&A bots answer one message at a time and forget everything after. There is no continuity, no shared history, and no sense that the agent actually knows you.',
      },
      {
        title: 'Always Waiting',
        desc: 'Almost every assistant is purely reactive. It never reaches out first, never checks in, and never behaves like a companion with its own rhythm.',
      },
      {
        title: 'Fixed Toolsets',
        desc: 'Capabilities are locked at deploy time. Want a new skill? Ship a new release. That friction makes personal agents hard to grow alongside real usage.',
      },
      {
        title: 'Shallow Context',
        desc: 'Without durable memory and persona, conversations stay generic. The agent cannot reason over past facts or sustain a coherent identity across days and weeks.',
      },
    ],
  },

  concept: {
    label: 'The Approach',
    title: 'A companion with\nits own life',
    quote:
      'Not a typical Q&A chatbot. A stateful agent that remembers, follows a daily schedule, and can message you first.',
    desc: 'NicheU (short for "Niche Daily") runs every interaction through one agent core: user messages from WhatsApp and cron-based scheduler ticks share the same LLM tool-use loop, with memory retrieval, persona context, and optional proactive replies.',
  },

  coreFeatures: {
    label: 'Core Features',
    title: 'What NicheU actually does',
    items: [
      {
        title: 'Persona Onboarding',
        desc: 'During the first conversation, you define who the agent is — name, role, and personality. That persona becomes the foundation for every future response.',
      },
      {
        title: 'Long-term Memory',
        desc: 'Relevant facts are pulled from MongoDB via embedding similarity search, with a plain-text fallback when no embedding model is configured — production-minded degradation.',
      },
      {
        title: 'Daily Schedule Generation',
        desc: 'The system generates a fictional daily activity plan and uses it as living context, giving the agent a believable routine instead of a blank idle state.',
      },
      {
        title: 'Proactive Messaging',
        desc: 'A scheduled job sends unprompted greetings, check-ins, and reminders, capped by a daily limit and quiet hours so it stays useful instead of spammy.',
      },
      {
        title: 'Self-extending Tools',
        desc: 'The agent can author new tools from chat and auto-enable them, executed inside a restricted VM sandbox — capabilities that grow without a redeploy.',
      },
      {
        title: 'Conversation Compaction',
        desc: 'Chat history is summarized and compacted over time so long-running relationships stay efficient inside the model context window.',
      },
    ],
  },

  showcase: {
    label: 'How It Works',
    title: 'One agent core,\ntwo entry points',
    subtitle:
      'WhatsApp messages and scheduler ticks both enter the same LLM-driven tool-use loop: reason, pull memory, invoke tools, then reply or push a proactive message.',
  },

  cta: {
    heading: 'A WhatsApp agent\nthat remembers you.',
    subtitle:
      'Persona, memory, schedule, and self-made tools — end-to-end ownership of an agentic product, from Baileys integration to Docker deployment.',
    buttonLabel: 'View on GitHub',
    buttonHref: 'https://github.com/ZamIzzudin/NicheU',
  },
}

export default nicheuData
