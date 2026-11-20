# 🌐 Internationalization (`js/i18n.js`) & SEO

Portofolio ini mendukung dua bahasa secara penuh — **Bahasa Indonesia (`id`)** dan **English (`en`)** — tanpa me-reload halaman, sekaligus menjaga konsistensi SEO (*canonical*, `hreflang`, `<title>`, dan `<meta name="description">`).

---

## 🗣️ Mekanisme Bahasa (`js/i18n.js`)

### Urutan Prioritas Deteksi Bahasa (`getInitialLanguage`)
1. **Query Parameter URL:** `?lang=id` atau `?lang=en` (prioritas tertinggi, memudahkan berbagi tautan berbahasa tertentu).
2. **`localStorage`:** Key `portfolio_language` yang tersimpan dari pilihan pengunjung sebelumnya.
3. **Browser Language Fallback:** Mengecek `navigator.language`; jika diawali `id` maka memakai `id`, selain itu `en`.

### Atribut HTML yang Didukung
| Atribut | Perilaku saat `setLanguage(lang)` dipanggil |
| :--- | :--- |
| `data-i18n="key"` | Mengisi `element.innerHTML` dari `I18N_DICTIONARY[lang][key]` |
| `data-i18n-placeholder="key"` | Mengatur atribut `placeholder` pada `<input>` / `<textarea>` |
| `data-i18n-title="key"` | Mengatur atribut `title` (tooltip) |
| `data-lang-option="id\|en"` | Tombol pemilih bahasa yang otomatis memperbarui state `.active`, `aria-pressed`, dan query URL |

### Event Reaktif (`languageChanged`)
Setiap kali bahasa diganti, `i18n.js` memancarkan event global:
```javascript
window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
```
Komponen dinamis di `js/rick-morty.js` (Interdimensional Cable TV, Mr. Meeseeks Quotes, Butter Robot, Brainwave Masking, dan Quantum JSON Synthesizer) mendengarkan event ini agar status runtime, pesan error, dan hasil telemetri ikut berganti bahasa seketika.

### Cara Menambah Key Terjemahan Baru
1. Tambahkan atribut `data-i18n="nama_key_baru"` pada elemen HTML.
2. Daftarkan `nama_key_baru` pada kedua blok bahasa di `js/i18n.js`:
   * Blok `I18N_DICTIONARY.id`
   * Blok `I18N_DICTIONARY.en`
3. Pastikan kedua blok memiliki key yang identik agar tidak ada teks yang tertinggal saat pengguna berpindah bahasa.

---

## 🔎 SEO & Open Graph Image Generator

### Optimasi SEO Bawaan
* **Structured Data (JSON-LD):** Schema `Person` di `index.html` berisi nama, jabatan, email, `sameAs` (GitHub & LinkedIn), serta daftar keahlian (`knowsAbout`).
* **Multilingual Alternate Tags:** `<link rel="alternate" hreflang="id|en|x-default">` diperbarui otomatis oleh `updateSeo()`.
* **Crawler & Indexing:** Dilengkapi `robots.txt` dan `sitemap.xml` di root repositori.

### Generator Gambar Open Graph (`og-image.png` & `og-profile.png`)
Repositori menyertakan template HTML khusus dan script render Node/Puppeteer untuk membuat kartu preview sosial media beresolusi `1200×630`:
* **Halaman Utama:** `og-template.html` → dirender oleh `render-og.js` menjadi `og-image.png`.
* **Dimension C-137:** `og-profile-template.html` → dirender oleh `render-og-profile.js` menjadi `og-profile.png`.

```bash
# Regenerasi gambar OG jika profil/desain diperbarui
node render-og.js
node render-og-profile.js
```
