# 🧬 Quantum JSON Synthesizer (`js/json-lab.js`)

**Quantum JSON Synthesizer** adalah utilitas pengembang dual-chamber di bagian **03. LAB & FUN (`#json-synthesizer`)** pada `profile.html`. Fitur ini menggabungkan konsep *lore* **The Cronenberg Cure & Timeline Divergence** dengan integrasi penuh ke ekosistem **Dimension C-137** (`mask.js`, Web Audio FX, dan Subspace Terminal).

---

## 🔬 Mode 01: De-Cronenberger (Beautify / Minify / Inspect)

Dirancang untuk "menyembuhkan" JSON mutan (*Cronenberg*) yang berantakan, *minified* satu baris, atau *double-escaped* dari log produksi:

* **Beautify & Minify:**
  * Pilihan indentasi fleksibel: **`2SP`**, **`4SP`**, atau **`TAB`**.
  * Tombol **`CRONENBERG (MINIFY)`** untuk memadatkan JSON kembali menjadi satu baris.
* **Smart Auto-Unescape (`Auto-Unescape`):**
  * Secara otomatis membongkar JSON yang terbungkus string (mis. `"{\"event\":\"PORTAL_WARP\"}"`) maupun JSON ter-escape mentah (`{\"a\":1}`) menjadi objek JSON rapi.
* **Recursive Key Sorter (`Sort Keys A-Z`):**
  * Mengurutkan seluruh key objek secara alfabetis hingga ke level terdalam tanpa mengubah urutan elemen array.
* **Editor Bernomor Baris + Highlight Aktif & Error:**
  * Input `RAW CRONENBERG INPUT` dilengkapi *line number gutter* tersinkronisasi scroll vertikal dengan `wrap="off"`.
  * Baris kursor aktif disorot hijau portal (`.ln-active`), sedangkan baris yang terkena `SyntaxError` otomatis disorot merah (`.ln-error`).
* **Glitch Diagnostic ala Rick:**
  * Saat JSON tidak valid, memutar `playGlitchSound()` dan menampilkan lokasi tepat **`LINE X, COL Y`** beserta cuplikan baris error dan pesan diagnostik bilingual.
* **Portal Syntax Highlighting & Telemetry Strip:**
  * Output menampilkan nomor baris dan pewarnaan token (Key: Cyan, String: Portal Green, Number: Morty Yellow, Boolean: Purple, Null: Red, `[REDACTED_*]`: Yellow Badge).
  * Menampilkan metrik real-time: **Ukuran (Byte/KB)**, **Kedalaman Dimensi (Max Depth)**, **Total Key**, dan **Tipe Root**.
* **Specimen Presets:**
  * `🧬 Cronenberg Minified` · `📜 Escaped Log String` · `🛡️ Payload + Secrets` · `⚠️ Broken Mutant`

---

## 🌌 Mode 02: Timeline Divergence Scanner (Compare JSON A vs B)

Membandingkan dua realitas payload JSON — **Dimension C-137 (Baseline JSON A)** vs **Dimension J19ζ7 (Target JSON B)** — untuk mendeteksi mutasi data dan *decoy*:

* **Semantic Compare (`Ignore Key Order`):**
  * Saat aktif, dua objek dengan isi sama namun urutan key berbeda tetap dianggap **100.0% TIMELINE MATCH // REAL FAMILY**.
  * Saat dimatikan, perbedaan urutan key terdeteksi sebagai *Key Order Drift Only*.
* **Timeline Stability Meter & Verdict:**
  * Menghitung persentase stabilitas berdasarkan perbandingan seluruh *leaf node* serta menampilkan ringkasan counter:
    * 🟢 **`+ ADDED`** (Mutasi ditambahkan di target)
    * 🔴 **`- REMOVED`** (Hilang dari timeline)
    * 🟡 **`~ MODIFIED`** (Perubahan nilai atau tipe data)
* **Dua Tampilan Visual Diff:**
  1. **Side-by-Side Diff:** Baris sejajar kiri-kanan berbasis algoritma **LCS (Longest Common Subsequence)** lengkap dengan nomor baris, tanda `+ / - / ~`, syntax highlighting, serta toggle **`Only Show Changes`**.
  2. **Anomaly Path Inspector:** Daftar ringkas setiap jalur **JSONPath** yang berubah (contoh: `$.portal_gun.fluid_level`, `$.squad[1]`), dilengkapi chip filter (`ALL`, `+ ADDED`, `- REMOVED`, `~ MODIFIED`) dan **klik path untuk langsung menyalin JSONPath**.
* **Utilitas Cepat:**
  * Tombol mini **`Beautify`** di masing-masing panel input A & B (dilengkapi gutter nomor baris + penyorotan error per sisi).
  * Tombol **`⇄ SWAP DIMENSIONS`** untuk menukar baseline dan target secara instan.
  * Skenario Preset: `🔫 Portal Gun v1 vs v2` · `⚖️ Decoy Check (Key Order)` · `🛡️ API Response + Secrets`.

---

## 🔗 Integrasi Ekosistem Dimension C-137

1. **One-Click `mask.js` Cloaking:**
   * Mode 01: Tombol **`🛡️ CLOAK SECRETS (mask.js)`** menyensor data sensitif di JSON lalu langsung mem-beautify hasilnya.
   * Mode 02: Tombol **`🛡️ CLOAK BOTH (mask.js)`** menyensor kedua JSON sekaligus sebelum dibandingkan.
2. **Cross-Mode Pipeline:**
   * Tombol **`🌌 KIRIM KE TIMELINE DIFF →`** di Mode 01 mengirim JSON hasil beautify langsung ke panel Baseline Dimension C-137 di Mode 02.
3. **Relay ke Subspace Terminal:**
   * Baik JSON hasil beautify maupun **Diff Report** dapat disalin ke clipboard atau langsung di-*relay* ke kolom pesan `#termMessage` di section `#contact`.

---

## 🧩 API Engine (`window.QuantumJsonEngine` / Node.js)

`js/json-lab.js` juga mendukung environment dual (Browser & CommonJS):

```javascript
const Q = window.QuantumJsonEngine; // atau require('./js/json-lab.js')

const parsed = Q.parseSmartJson(rawString, { autoUnescape: true });
if (parsed.ok) {
  const formatted = Q.formatJson(parsed.value, { indent: 2, sortKeys: true, minify: false });
  const stats = Q.analyzeJson(parsed.value, formatted);
  const diff = Q.diffJson(objA, objB, { ignoreKeyOrder: true, indent: 2 });
  console.log(diff.stabilityPct, diff.counts, diff.reportText);
}
```
