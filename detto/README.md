# Detto — Portfolio Showcase

Folder ini berisi **case study lengkap** dan **3 komponen interaktif standalone** yang siap di-embed ke halaman portfolio untuk menjelaskan projek Detto (aplikasi PWA privat untuk pasangan).

## 📁 Struktur

```
portfolio/
├── README.md              ← file ini (overview)
├── USAGE.md              ← panduan langkah demi langkah embed widget
├── STRUCTURE.md          ← struktur folder + penjelasan teknis
├── CASE_STUDY.md         ← konten case study lengkap (untuk halaman portfolio)
├── styles.css            ← CSS variables tema Detto (coral + sage)
├── check.js              ← script validasi syntax komponen
├── Demo.tsx              ← demo page yang merender semua 3 widget bersama-sama
└── components/
    ├── InteractiveCalendar.tsx   ← widget 1: calendar + event management
    ├── LoveNoteStack.tsx         ← widget 2: swipeable love notes (expiring)
    └── WishlistBoard.tsx         ← widget 3: wishlist couples (bucket list)
```

## 🚀 Cara Pakai (Cepat)

### 1. Install dependency

```bash
npm install framer-motion lucide-react clsx
```

### 2. Copy tema CSS

Salin isi `styles.css` ke global CSS portfolio kamu (atau import per-komponen).

### 3. Import dan gunakan widget

```tsx
import InteractiveCalendar from "./components/InteractiveCalendar";
import LoveNoteStack from "./components/LoveNoteStack";
import WishlistBoard from "./components/WishlistBoard";

export default function DettoPage() {
  return (
    <main>
      <InteractiveCalendar />
      <LoveNoteStack defaultTtlMinutes={10} />
      <WishlistBoard defaultAuthor="You" />
    </main>
  );
}
```

Lihat `USAGE.md` untuk detail lengkap dan contoh implementasi.

## 📦 Komponen yang Tersedia

| Komponen | Interaksi | Merepresentasikan fitur Detto |
|----------|-----------|------------------------------|
| `InteractiveCalendar` | Pilih tanggal, tambah event, hapus, navigasi bulan | Calendar & Events |
| `LoveNoteStack` | Swipe kiri/kanan, tambah note, auto-expire | Love Notes (ephemeral cards) |
| `WishlistBoard` | Tambah wish, toggle favourite, mark done, schedule as event | Wishlist (couples bucket list) |
| `NotificationTimeline` | Slider waktu, auto-play, popup notifikasi saat tanggal tercapai | Push Notifications (cron-based) |

## ✨ Fitur Widget

- **State lokal** — semua data disimpan di `localStorage`, refresh page data tetap ada
- **Tanpa backend** — bisa langsung di-embed tanpa konfigurasi API
- **Animasi smooth** — Framer Motion untuk gesture swipe, bottom sheets, list reordering
- **Mobile-first** — optimal untuk layar kecil (masuk akal untuk tema couples app)
- **Tema Detto** — coral `#fe6b5e`, sage, fog, radius rounded-22px, shadow elevation

## 🔍 Verifikasi

Untuk memastikan komponen valid, jalankan:

```bash
cd portfolio
node check.js
```

Ini akan memverifikasi bahwa semua import yang diperlukan ada dan struktur komponen benar.

## 📖 Dokumen Lain

- `USAGE.md` — step-by-step panduan implementasi (disarankan dibaca pertama)
- `STRUCTURE.md` — penjelasan struktur folder, stack teknis, design system
- `CASE_STUDY.md` — case study lengkap (tulisannya bisa langsung dipakai di portfolio)
- `Demo.tsx` — contoh page yang merender semua 3 widget dalam grid layout

## 🎨 Desain

Semua widget menggunakan sistem token "Nokta" dari Detto yang didefinisikan di `styles.css`:

- **Colors:** coral (#fe6b5e), sage (#465955), fog (#EDEAE2), brand-dark (#1F2B27)
- **Radius:** 8px → 14px → 22px → 999px (mobile-optimized curves)
- **Shadows:** subtle elevation untuk cards, heavy untuk modals
- **Motion:** spring animations (damping 25, stiffness 300)
- **Font:** Nunito (300-900) - Google Font

Tema mendukung light & dark mode via `data-theme="dark"` pada element `<html>`.

## 📝 Lisensi & Atribusi

Project ini adalah portofolio pribadi. Berikan atribusi ke projek asli bila dipublikasikan:

> Interactive widgets from Detto — a couples app built by NotuTeam.

Jangan distribusikan kembali komponen ini di produk komersial atau klaim sebagai karya sendiri.

## 🆘 Support

Lihat `USAGE.md` untuk troubleshooting atau `STRUCTURE.md` untuk info teknis lebih detail.
