# 📡 Subspace Terminal API, Deployment & Publish Wiki

Dokumen ini mencakup spesifikasi backend serverless `/api/contact`, konfigurasi environment, proses deployment ke **Vercel**, serta langkah memublikasikan folder `wiki/` ke **GitHub Wiki**.

---

## 🔌 Endpoint API: `POST /api/contact` (`api/contact.js`)

Digunakan oleh **Citadel Subspace Terminal CLI** pada `profile.html` (`#contact`) untuk menerima pesan pengunjung dan meneruskannya secara paralel ke **Telegram Bot** (notifikasi real-time) dan **Google Sheets Apps Script** (arsip log transmisi).

### Request Payload (`application/json`)
```json
{
  "sender": "Rick Sanchez",
  "email": "rick@citadel.io",
  "mission": "Technical Consultation",
  "message": "Need help scaling our RabbitMQ portal pipeline.",
  "_timeProof": 1732070000000,
  "portal_trap": ""
}
```

### 4 Lapisan Keamanan (Multi-Layer Defense)

| Layer | Mekanisme | Respons jika Terpicu |
| :--- | :--- | :--- |
| **1. Honeypot Trap** | Field tersembunyi `portal_trap` / `_hp`. Jika terisi oleh bot otomatis, payload dibuang diam-diam. | `200 OK` (fake success agar bot tidak mencoba ulang) |
| **2. Sliding Window Rate Limiter** | In-memory map per IP: maksimal **4 transmisi per 10 menit**. | `429 Too Many Requests` (`code: "RATE_LIMITED"`, `retryAfter`) |
| **3. Interaction Time Proof** | Memverifikasi `_timeProof`: manusia butuh minimal **1.200 ms** untuk mengisi formulir. | `400 Bad Request` (`code: "TOO_FAST"`) |
| **4. Payload Validation & Anti-Link Spam** | Validasi panjang `sender` (2–80), format `email` (≤100), panjang `message` (5–3000), whitelist `mission`, dan batas maksimal **3 URL** per pesan. | `400 Bad Request` (`MISSING_FIELDS`, `INVALID_*`, `LINK_SPAM`) |

### Response Sukses (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-20T04:00:00.000Z",
  "telegram": "delivered",
  "googleSheet": "recorded",
  "message": "Transmission successfully verified and dispatched through Citadel relays."
}
```

---

## 🔐 Environment Variables (`.env`)

Salin `.env.example` menjadi `.env` untuk pengujian lokal, atau masukkan variabel berikut di **Vercel Project Settings → Environment Variables**:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCDE-YourBotToken...
TELEGRAM_CHAT_ID=9877654123
GOOGLE_SHEET_WEB_APP_URL=https://script.google.com/macros/s/AKfycb.../exec
```

> ⚠️ **Keamanan:** File `.env` sudah masuk di `.gitignore` dan **tidak boleh** di-commit ke GitHub.

---

## 🚀 Deployment ke Vercel

1. Hubungkan repositori GitHub `nisfal/me` ke proyek Vercel.
2. **Framework Preset:** `Other` (Static + Serverless Functions di direktori `api/`).
3. **Build Command:** Kosongkan (tidak perlu bundler).
4. **Output Directory:** `.` (root).
5. Tambahkan 3 environment variables di atas agar `/api/contact` aktif.
6. `vercel.json` secara otomatis mengaktifkan `cleanUrls`, `/c-137 -> /profile`, dan `/void-404 -> /404.html`.

---

## 📖 Cara Publish Folder `wiki/` ke GitHub Wiki

GitHub menyimpan halaman Wiki pada repositori Git terpisah berakhiran `.wiki.git`. Seluruh halaman markdown di folder `wiki/` sudah diformat agar langsung kompatibel dengan GitHub Wiki (termasuk `_Sidebar.md`, `_Footer.md`, dan tautan `[[Page-Name]]`).

### Langkah Publish:
1. Buka repositori `https://github.com/nisfal/me` → tab **Settings** → pastikan fitur **Wikis** dicentang aktif.
2. Buka tab **Wiki** di GitHub lalu buat 1 halaman awal (*Create the first page* → klik *Save Page*) agar repositori `me.wiki.git` terinisialisasi oleh GitHub.
3. Jalankan perintah berikut di terminal (di luar folder repo utama):

```bash
# 1. Clone repo wiki GitHub
git clone https://github.com/nisfal/me.wiki.git
cd me.wiki

# 2. Salin seluruh file markdown dari folder wiki/ proyek utama
# (Windows PowerShell)
Copy-Item "C:\Users\asset\OneDrive\Documents\workspace\me\wiki\*.md" -Destination . -Force

# (macOS / Linux / Git Bash)
# cp /path/to/me/wiki/*.md .

# 3. Commit dan push ke GitHub Wiki
git add .
git commit -m "docs: initialize comprehensive Dimension C-137 portfolio wiki"
git push origin master
```

Setelah push selesai, buka `https://github.com/nisfal/me/wiki` — seluruh halaman, sidebar navigasi, diagram Mermaid, dan footer akan langsung tampil rapi!
