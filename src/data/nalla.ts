export interface PainPoint {
  title: string
  desc: string
}

export interface CoreFeature {
  title: string
  desc: string
}

export interface ExperiencePhase {
  title: string
  desc: string
}

export interface ShowcaseDemo {
  heading: string
  subtitle: string
}

export interface NallaPageData {
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
  experience: {
    label: string
    title: string
    subtitle: string
    phases: ExperiencePhase[]
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

const nallaData: NallaPageData = {
  tagline:
    'A curated digital wedding invitation platform — design, deliver, and track every detail of the big day, from personalized WhatsApp invitations to QR guest check-in at the venue.',

  techBadges: [
    'Digital Invitation',
    'Wedding',
    'WhatsApp Delivery',
    'RSVP Dashboard',
    'QR Check-in',
    'Guest Camera',
    'Theme Collection',
    'React',
  ],

  problem: {
    label: 'Problem That We Faced',
    title: 'Why wedding invitations\nstay chaotic',
    painPoints: [
      {
        title: 'Manual Guest Messaging',
        desc: 'Hundreds of guests mean hundreds of hand-typed WhatsApp messages. Names get misspelled, salutations get copy-pasted wrong, and someone stays up all night just pressing send.',
      },
      {
        title: 'Scattered RSVP Tracking',
        desc: 'Confirmations arrive across group chats, DMs, and paper notes. Attendance is counted by hand in a spreadsheet that is outdated the moment a single guest changes their mind.',
      },
      {
        title: 'The Day-Of Bottleneck',
        desc: 'Guests queue at a guestbook table while the reception should be flowing. Nobody really knows who has arrived, and the seating count is a running guess.',
      },
      {
        title: 'Templates That Feel Cheap',
        desc: 'A shared PDF link feels like an afterthought. The invitation is the first impression guests carry of the wedding — it deserves better than a generic template.',
      },
    ],
  },

  concept: {
    label: 'The Approach',
    title: 'One elegant flow,\nfrom invite to check-in',
    quote:
      'The invitation is the first impression your guests carry. Nalla makes it feel like a boutique piece — and keeps everything behind it just as polished.',
    desc: 'Nalla wraps the entire wedding invitation journey into one platform: pick a theme from a curated collection, fill in the details once, deliver personal invitations over WhatsApp, then watch RSVPs, wishes, and digital envelopes gather in a real-time dashboard — all the way to QR check-in at the venue.',
  },

  coreFeatures: {
    label: 'Core Features',
    title: 'What Nalla actually does',
    items: [
      {
        title: 'Personal WhatsApp Delivery',
        desc: 'Upload a guest list and Nalla composes a personal message for every name — no overnight typing, no wrong salutations. Each guest receives an invitation that feels written just for them, because it is.',
      },
      {
        title: 'Real-time Dashboard',
        desc: 'Who opened the invitation, who confirmed attendance, wishes flowing in, digital envelopes arriving — everything gathers in one private dashboard, updated automatically from the first send to the final guest.',
      },
      {
        title: 'QR Guest Check-in',
        desc: 'Import guests from Excel, group them as needed, and on the day itself simply point them to a QR scan. Attendance is recorded in real time — smooth execution, lasting impression.',
      },
      {
        title: 'Golden Moment Guest Camera',
        desc: 'Every guest who RSVPs unlocks a disposable camera inside their invitation — twenty shots each, streaming straight into the couple\u2019s shared photobook. The photographer captures the aisle; the guests capture everything around it.',
      },
      {
        title: '50+ Curated Themes',
        desc: 'From classic and grand to modern and playful, every theme is curated like a piece of art — typography, palette, and ornaments that deserve to be displayed. Switch anytime; every detail stays in sync.',
      },
      {
        title: 'Digital Envelopes & Gifts',
        desc: 'Bank accounts and e-wallets presented elegantly for the amplop, group gifting for presents, and a built-in wedding planner — checklist, budget, vendors, and timeline in one place.',
      },
    ],
  },

  experience: {
    label: 'The Experience',
    title: 'From invitation sent,\nto the last smile home',
    subtitle:
      'Three phases, one seamless flow — Nalla covers the whole arc of the celebration, so couples can focus on simply enjoying the moment.',
    phases: [
      {
        title: 'Before the Event',
        desc: '300 guests, 300 personal invitations — in seconds. Upload the guest list and Nalla arranges a personal WhatsApp message for every single name.',
      },
      {
        title: 'Leading Up to the Day',
        desc: 'Opens, RSVPs, wishes, and digital gifts — everything is visible in real time from a single, tidy dashboard. Updated automatically, every moment.',
      },
      {
        title: 'On the Day',
        desc: 'Guests arrive, are welcomed, and are recorded — no queue, no guestbook. One QR scan, and attendance logs itself instantly.',
      },
    ],
  },

  showcase: {
    label: 'Showcase',
    title: 'Try Nalla in 60 seconds',
    subtitle:
      'Interactive demos ported straight from the product — tap the shutter, pick a theme, watch RSVPs and check-ins flow in. All state is in-memory.',
    demos: [
      {
        heading: 'Golden Moment',
        subtitle:
          "Every RSVP unlocks a disposable camera in the guest's invitation — twenty shots each, streamed into one photobook. Tap the shutter.",
      },
      {
        heading: 'Curated Theme Collection',
        subtitle:
          'Pick a curator-designed theme and see the status respond — switching themes never touches the data behind them.',
      },
      {
        heading: 'RSVPs, in real time',
        subtitle:
          'A guest confirms attendance on their phone — the dashboard knows it instantly, no refresh, no recount.',
      },
      {
        heading: 'QR Check-in',
        subtitle:
          'No guestbook, no queue. Guests scan at the venue and attendance records itself — table number included.',
      },
    ],
  },

  cta: {
    heading: 'Invitations as beautiful\nas the big day.',
    subtitle:
      'Curated themes, personal WhatsApp delivery, a real-time RSVP dashboard, QR check-in, and a guest-camera photobook — designed so couples can simply enjoy the moment.',
    buttonLabel: 'Visit Nalla',
    buttonHref: 'https://nalla.id/',
  },
}

export default nallaData
