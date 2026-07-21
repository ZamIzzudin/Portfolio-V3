# Portfolio Showcase — Project Structure

```
portfolio/
├── README.md              ← Overview of what this folder contains
├── USAGE.md              ← Step-by-step guide to embed widgets
├── CASE_STUDY.md         ← Full case study (content for your portfolio page)
├── styles.css            ← Detto theme tokens (copy to your global CSS)
├── check.js              ← Sanity check script for component syntax
├── package.json          ← Metadata (optional)
├── Demo.tsx              ← Demo page that renders all three widgets together
└── components/
    ├── InteractiveCalendar.tsx   ← Calendar + event management
    ├── LoveNoteStack.tsx         ← Swipeable love notes (expiring)
    └── WishlistBoard.tsx         ← Shared couples wishlist (bucket list)
```

## What Each Component Does

| Component | Represents from Detto | Key Interactions |
|-----------|----------------------|------------------|
| `InteractiveCalendar` | Calendar & Events page | Add events, view by day, delete, navigate months |
| `LoveNoteStack` | Love Notes (ephemeral) | Swipe left/right to read, add new notes, auto-expire |
| `WishlistBoard` | Wishlist (bucket list) | Add wishes, toggle favourite, mark done, schedule as event |
| `NotificationTimeline` | Push Notification system | Time-travel slider, auto-play simulation, popup notifications on dates |

## Technology Stack

The widgets share the same stack as Detto's main app:

- **React 19** (with "use client" directives)
- **Framer Motion** for smooth animations (swipe gestures, bottom sheets, list reordering)
- **Lucide React** for iconography (calendar, heart, etc.)
- **CLSX** for conditional styling (only used in `InteractiveCalendar`)
- **localStorage** for state persistence

## Design System

All widgets follow Detto's "Nokta" token system, defined in `styles.css`:

- **Brand colors:** Coral (`#fe6b5e`), Sage (`#465955`), Fog (`#EDEAE2`)
- **Radius:** 8px → 14px → 22px (mobile-optimized curves)
- **Shadows:** Subtle elevation for cards, heavy elevation for modals
- **Motion:** Spring animations with damping 25, stiffness 300

The theme supports both light and dark modes via `data-theme="dark"` on the `<html>` element.

## Browser Requirements

- Modern browser with ES6 support (React 19)
- Touch support recommended (widgets are mobile-first)
- LocalStorage enabled (for data persistence)

## License & Attribution

This showcase is provided as a demonstration of NotuTeam's work. You may embed these widgets in your personal portfolio with attribution:

> Interactive widgets from Detto — a couples app built by NotuTeam.

Do not redistribute these components in commercial products or claim them as your own work.

## Support

If you encounter issues:

1. Check `USAGE.md` for setup instructions
2. Run `node check.js` to verify component syntax
3. Review `CASE_STUDY.md` for context about the original project

## Next Steps

1. Copy `styles.css` to your portfolio's global CSS
2. Import the widget(s) you want to use
3. Wrap them in your portfolio layout
4. See `Demo.tsx` for a complete example
