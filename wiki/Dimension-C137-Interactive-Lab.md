# 🛸 Dimension C-137 Interactive Lab (`profile.html`)

Halaman `/c-137` (`profile.html`) adalah ruang eksplorasi personal dan laboratorium eksperimental bertema **Rick and Morty**, dikendalikan sepenuhnya oleh `js/rick-morty.js` dan `css/rick-morty.css`.

---

## 🧭 Struktur Navigasi 4-Pilar

Navbar desktop dilengkapi dropdown *flyout* terstruktur serta *scrollspy* otomatis (`SECTION_GROUP_MAP`):

| Pilar | Sub-Section | Anchor ID |
| :--- | :--- | :--- |
| **01. DOSSIER** | `01.1` Citizen ID · `01.2` Wanted Dossier | `#citadel` |
| **02. PROJECTS** | `02.1` Arsenal & Tech Stack · `02.2` Interdimensional Cable TV | `#arsenal`, `#cable-tv` |
| **03. LAB & FUN** | `03.1` Mr. Meeseeks Task Box · `03.2` Brainwave Masking · `03.3` Quantum JSON Synthesizer · `03.4` Santai & Multiverse Lore | `#meeseeks`, `#brainwave-mask`, `#json-synthesizer`, `#santai` |
| **04. COMMS** | `04.1` Microverse Testimonials · `04.2` Subspace Terminal CLI | `#microverse`, `#contact` |

---

## 🧩 Daftar Fitur Interaktif

### 1. Citadel Interdimensional ID Card (3D Flip)
* **Sisi Depan:** Citizen ID Card (`SPECIMEN #NF-137-JKT`) dengan bingkai portal berputar, statistik spesialisasi, asal dimensi, dan tingkat ancaman terhadap sistem *monolith*.
* **Sisi Belakang:** *Galactic Federation Wanted Dossier* (`WARRANT #C137-9942`, Bounty `1,000,000 FLURBOS`) berisi catatan humoris kejahatan arsitektur sistem.

### 2. Portal Gun Dimension Shifter
Mengubah seluruh skema warna, kursor SVG, dan atmosfer portal di halaman secara real-time:
* **Earth C-137 (`dim-c137`):** Portal Fluid Green (`#97ce4c` / `#39ff14`)
* **Cronenberg World (`dim-cronenberg`):** Bio-Amber & Pink (`#f59e0b` / `#ec4899`)
* **The Purge Planet (`dim-purge`):** Crimson Alert (`#ef4444` / `#f97316`)
* **Citadel of Ricks (`dim-citadel`):** Holographic Cyan (`#06b6d4` / `#3b82f6`)

### 3. Interdimensional Cable TV
* Televisi tabung retro-sci-fi dengan *rotary dial* untuk memutar saluran proyek nyata Nisfal Filsa (Allina Intelligence, SKCK Online POLRI, Telkom SD-WAN, MyTens Partnership, dll.) lengkap dengan efek *TV static sound* dan telemetri frekuensi (`137.42 GHz`).

### 4. Mr. Meeseeks Task Box (Rage Escalation Protocol)
* Tombol kubah 3D taktil untuk memanggil Mr. Meeseeks yang memberikan saran arsitektur & roasting dunia koding.
* **Mekanisme Rage Escalation:** Mengklik tombol berulang kali menaikkan *Stress Meter* karena "Existence is pain for a Meeseeks!"—memicu perubahan ekspresi wajah SVG, peringatan alarm, hingga tombol **EMERGENCY RESET // DISSOLVE**.

### 5. Brainwave Masking Matrix (`#brainwave-mask`)
* Visualisasi Dual Oscilloscope Canvas (Gelombang Jenius Rick `1.21 THz` vs Gelombang Penyamaran Morty terbalik fase) dan konsol redaksi real-time berbasis `js/mask.js`.
* Lihat dokumentasi detail di [[Brainwave-Masking-Engine]].

### 6. Quantum JSON Synthesizer (`#json-synthesizer`)
* Dual-chamber JSON Beautifier/Minifier (*De-Cronenberger*) dan Semantic JSON Diff Comparator (*Timeline Divergence Scanner*) berbasis `js/json-lab.js`.
* Lihat dokumentasi detail di [[Quantum-JSON-Synthesizer]].

### 7. Microverse Battery Testimonials
* Menampilkan testimoni dalam format sel baterai Microverse dengan **continuous marquee carousel** (kontrol `MUNDUR`, `JEDA`, `MAJU`, `BALIK ARAH`) serta filter:
  * **Semua Baterai (6)**
  * **Terverifikasi LinkedIn (2)** — Rekomendasi nyata dari kolega Senior Engineer & DevOps
  * **Multiverse Sci-Fi (4)** — Testimoni karakter (Rick Sanchez, Evil Morty, dll.)

### 8. Floating Robot Companion & Waiting Mode Space Shooter
* **Robot Companion:** Widget interaktif di pojok layar dengan 3 varian yang bisa diganti (**Butter Robot**, **Morty-bot**, **Rick-bot C-137**) lengkap dengan mata yang mengikuti gerakan kursor dan dialog dinamis.
* **Waiting Mode Minigame (`js/space-shooter.js`):** Jika pengguna idle selama **120 detik**, layar otomatis masuk ke *Waiting Mode* yang menjalankan game arcade **Space Shooter** berbasis HTML5 Canvas (mendukung keyboard, mouse, touch, power-up, boss laser, dan tombol `SELF DESTRUCT (BACK)`).

---

## 🔊 Native Web Audio FX Synthesizer

Seluruh efek suara di `js/rick-morty.js` disintesis secara prosedural menggunakan **Web Audio API** tanpa satu pun file MP3/WAV eksternal (0 KB beban aset audio), dan dapat dimatikan kapan saja lewat tombol **AUDIO FX: ON/OFF**:

| Fungsi | Penggunaan |
| :--- | :--- |
| `playPortalSound()` | Warp portal, validasi JSON sukses, relay ke Subspace Terminal |
| `playGlitchSound()` | Syntax Error JSON, kegagalan validasi |
| `playMortyWaveSound()` | Aktivasi Brainwave Shield / Cloak Secrets (`mask.js`) |
| `playShieldAlertSound()` | Peringatan saat Morty Shield dimatikan |
| `playMeeseeksChime()` / `playMeeseeksRageSound()` / `playMeeseeksMeltdownAlarmSound()` | Interaksi & eskalasi emosi Mr. Meeseeks Box |
| `playTvStaticSound()` | Pergantian saluran Interdimensional Cable TV |
| `playCardFlipSound()` | Membalik Citadel ID Card / mengganti mode tab |
| `playTerminalBeepSound()` / `playTerminalTransmitSound()` | Tombol utilitas, copy clipboard, & pengiriman transmisi CLI |
