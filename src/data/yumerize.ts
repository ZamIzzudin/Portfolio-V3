export interface PainPoint {
  title: string
  desc: string
}

export interface CoreFeature {
  title: string
  desc: string
}

export interface YumerizePageData {
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
    buttonLabel2: string
    buttonHref: string
    buttonHref2: string
  }
}

const yumerizeData: YumerizePageData = {
  tagline:
    'Lightweight API documentation & API hitter for Node.js — zero-config, auto-discovers routes, and serves a beautiful dark-themed UI to explore and test your endpoints.',

  techBadges: [
    'Node.js',
    'Express',
    'NestJS',
    'Fastify',
    'API Docs',
    'OpenAPI',
  ],

  problem: {
    label: 'Problem That We Faced',
    title: 'Why API documentation\nfeels like a chore',
    painPoints: [
      {
        title: 'YAML Boilerplate',
        desc: 'Writing and maintaining Swagger or OpenAPI YAML specs is tedious. A single route change means updating the spec manually — and when they drift apart, your docs become misleading.',
      },
      {
        title: 'Decorator Clutter',
        desc: 'Some tools require you to wrap every endpoint with decorators and type annotations just to generate basic docs. Your controller code becomes twice as long and half as readable.',
      },
      {
        title: 'No Built-in Testing',
        desc: 'Most documentation tools stop at rendering a pretty page. To actually test your endpoints, you need to switch to Postman or Insomnia — losing the context of what you were just reading.',
      },
      {
        title: 'Framework Lock-in',
        desc: 'Documentation solutions built for one framework rarely work for another. Migrating from Express to Fastify or NestJS means starting your docs setup from scratch.',
      },
    ],
  },

  concept: {
    label: 'The Approach',
    title: 'Zero config.\nPlug in and go.',
    quote:
      'No YAML files. No decorators. No complex setup. Just plug it in and your docs are ready.',
    desc: 'Yumerize captures your routes directly from the framework router, generates a full-featured documentation UI on the fly, and includes an API hitter so you can test endpoints right where you read about them.',
  },

  coreFeatures: {
    label: 'Core Features',
    title: 'What Yumerize actually does',
    items: [
      {
        title: 'Auto-Route Discovery',
        desc: 'Scans your Express, NestJS, or Fastify router tree and discovers every registered route automatically. No manual registration needed.',
      },
      {
        title: 'Built-in API Hitter',
        desc: 'Test any endpoint directly from the documentation UI. Full request builder with params, headers, auth, and all body types — no external tools required.',
      },
      {
        title: 'Optional Enrichment',
        desc: 'Add `api.doc()` to any route for richer metadata — params, descriptions, response examples. Completely optional; undocumented routes still appear in the UI.',
      },
      {
        title: 'Global Auth Token',
        desc: 'Hit a login endpoint once and the token is auto-extracted and saved. All subsequent requests with Inherit Token auth reuse it automatically.',
      },
      {
        title: 'Response Benchmarking',
        desc: 'Documented example responses are shown alongside the request builder so you can compare actual responses against the agreed contract before sending a real request.',
      },
      {
        title: 'DOCX Export',
        desc: 'Export all documented routes as a formatted Word document with one click. Includes title page, table of contents, and per-endpoint details with color-coded methods.',
      },
    ],
  },

  showcase: {
    label: 'Showcase',
    title: 'Try Yumerize in 60 seconds',
    subtitle:
      'Interactive demos showcasing the core features. Try them right here — all state is in-memory.',
  },

  cta: {
    heading: 'Stop writing docs.\nStart shipping them.',
    subtitle:
      'Three lines of code, zero config files. Install Yumerize and your API documentation is ready before you finish your coffee.',
    buttonLabel: 'Try Yumerize',
    buttonLabel2: 'View on NPM',
    buttonHref: 'https://yumerize.notu.dev/',
    buttonHref2: 'https://www.npmjs.com/package/yumerize',
  },
}

export default yumerizeData
