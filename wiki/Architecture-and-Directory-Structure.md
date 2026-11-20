# 🏗️ Architecture & Directory Structure

Repositori `nisfal/me` dibangun dengan pendekatan **zero-bundler vanilla web architecture** (HTML5, Modern CSS3, Vanilla JavaScript ES6+) yang dipadukan dengan **Vercel Serverless Functions** untuk transmisi formulir kontak. Pendekatan ini menjaga ukuran beban awal sangat ringan, tanpa proses *build* kompleks, serta mendukung performa animasi **60 FPS**.

---

## 📁 Struktur Direktori

```text
me/
├── index.html                  # Halaman utama portofolio profesional
├── backend.html                # Showcase arsitektur Backend & Distributed Systems
├── frontend.html               # Showcase Frontend Engineering & UX
├── profile.html                # Dimension C-137 (Profil santai & Interactive Lab bertema Rick & Morty)
├── 404.html                    # Halaman error bertema Void Dimension (/void-404)
├── api/
│   └── contact.js              # Vercel Serverless Function POST /api/contact (Telegram + Google Sheets)
├── css/
│   ├── style.css               # Design system utama (index, backend, frontend)
│   ├── light-theme.css         # Variabel & gaya mode terang
│   ├── portal-transition.css   # Animasi transisi Portal Warp antar halaman utama <-> C-137
│   └── rick-morty.css          # Design system lengkap Dimension C-137 & 4 tema dimensi
├── js/
│   ├── main.js                 # Fluid Spring Cursor, kinetic typography, animasi halaman utama
│   ├── portal-travel.js        # Intersepsi navigasi ke /c-137, modal otorisasi & VFX warp
│   ├── i18n.js                 # Engine bilingual ID/EN, URL sync, dan SEO updater dinamis
│   ├── mask.js                 # Engine Data Masking / PII Redaction (CLI + Node + Browser)
│   ├── json-lab.js             # Engine Quantum JSON Synthesizer (Beautify/Minify + Semantic Diff)
│   ├── space-shooter.js        # Minigame Canvas Space Shooter (Idle / Waiting Mode)
│   └── rick-morty.js           # Controller utama Dimension C-137 & Web Audio FX Synthesizer
├── img/                        # Aset gambar avatar, wanted poster, iklan TV, testimoni
├── wiki/                       # Dokumentasi Markdown siap publish untuk GitHub Wiki
├── og-template.html            # Template HTML untuk generate og-image.png
├── og-profile-template.html    # Template HTML untuk generate og-profile.png
├── render-og.js                # Script generator Open Graph image halaman utama
├── render-og-profile.js        # Script generator Open Graph image Dimension C-137
├── vercel.json                 # Konfigurasi cleanUrls & rewrites untuk produksi (Vercel)
├── serve.json                  # Konfigurasi cleanUrls & rewrites untuk lokal (`npx serve .`)
├── robots.txt                  # Instruksi crawler mesin pencari
├── sitemap.xml                 # Peta situs SEO
└── .env.example                # Contoh environment variable untuk Subspace Terminal API
```

---

## 🔀 Arsitektur Routing & Clean URLs

Baik di produksi (`vercel.json`) maupun saat pengembangan lokal (`serve.json`), proyek menggunakan `cleanUrls: true` dan `trailingSlash: false` dengan *custom rewrites*:

| Public Route | Target File | Fungsi |
| :--- | :--- | :--- |
| `/` | `index.html` | Landing page portofolio profesional |
| `/backend` | `backend.html` | Detail keahlian & arsitektur backend |
| `/frontend` | `frontend.html` | Detail keahlian & arsitektur frontend |
| `/c-137` | `profile.html` | Halaman interaktif Dimension C-137 (Rick & Morty) |
| `/void-404` | `404.html` | Halaman fallback 404 interdimensional |
| `/api/contact` | `api/contact.js` | Serverless endpoint untuk Citadel Subspace Terminal |

### Portal Travel Transition (`js/portal-travel.js`)
Ketika pengunjung mengklik tautan **C-137** dari halaman utama (`index.html`, `backend.html`, atau `frontend.html`), `portal-travel.js` melakukan:
1. Mengintersepsi klik dan memutar efek suara `playModalOpenSound()`.
2. Menampilkan modal otorisasi portal interdimensional.
3. Setelah dikonfirmasi, memicu animasi *fullscreen portal warp* dengan `playPortalJumpSound()` lalu mengarahkan ke `/c-137?warp=in&lang=<id|en>`.
4. Sebaliknya, saat kembali ke realitas utama dari `profile.html`, dipicu animasi *reality collapse* menuju `/?warp=return&lang=<id|en>`.

---

## 🎨 CSS Design System & Performance

### Variabel Tema Dinamis (`css/rick-morty.css`)
Seluruh komponen di `profile.html` mengacu pada CSS Custom Properties di `:root`:
* `--portal-green`, `--portal-bright`, `--portal-glow`, `--portal-border`
* `--portal-cyan`, `--portal-yellow`, `--portal-purple`, `--portal-red`
* `--void-bg`, `--void-card`, `--void-elevated`
* Tipografi: `Outfit` (Display), `Space Grotesk` (Sci-Fi), `JetBrains Mono` (Code/Terminal), `Geist` (Body).

Mengubah kelas pada `<body>` (`dim-c137`, `dim-cronenberg`, `dim-purge`, `dim-citadel`) langsung mengubah seluruh aksen UI, *glow*, dan *custom SVG crosshair cursor* secara instan.

### Optimasi Performa 60 FPS
* Layer latar belakang (`#portalCanvas`, `.cosmic-grid`, `.scanlines`) diisolasi dengan `transform: translate3d(0, 0, 0)`, `contain: strict`, dan `backface-visibility: hidden` untuk mencegah *repaint* mahal saat scrolling.
* Menghindari bottleneck `shadowBlur` pada render loop Canvas partikel portal.
* Scrollspy 4-Pillar Navbar menggunakan *cached section offsets* dan `requestAnimationFrame` throttling.
