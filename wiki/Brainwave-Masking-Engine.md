# 🛡️ Brainwave Masking Engine (`js/mask.js`)

**Brainwave Masking Matrix** terinspirasi dari *lore* Rick and Morty: pancaran gelombang otak jenius Rick (`1.21 THz`) dapat dilacak oleh Federasi Galaksi sehingga perlu dinetralkan menggunakan gelombang otak Morty yang berkebalikan fase (*Morty Waves*).

Dalam implementasi perangkat lunak, modul **`js/mask.js`** berfungsi sebagai engine **Data Masking & PII/Secret Redaction** berbasis AST/Regex yang dapat berjalan di **3 lingkungan sekaligus**: Browser (`window.BrainwaveMasker`), Node.js Module (`require('./js/mask.js')`), dan CLI (`node js/mask.js`).

---

## 🔍 18+ Entitas Sensitif yang Dideteksi

Setiap entitas sensitif yang ditemukan akan otomatis diganti dengan tag terstandar `[REDACTED_<LABEL>]`:

| Kategori | Pola / Entitas yang Disensor | Contoh Tag Output |
| :--- | :--- | :--- |
| **Kriptografi & Auth** | Private Key PEM Block (RSA, EC, DSA, OPENSSH, PGP), JWT Token, Basic/Bearer Auth Token, API Key/Secret berlabel maupun ber-entropi tinggi (`sk_live_`, `ghp_`, `AIza`, `AKIA`, `xox*`) | `[REDACTED_PRIVATE_KEY]`, `[REDACTED_JWT]`, `[REDACTED_API_KEY]` |
| **Database & Infra** | Connection String (`mysql`, `mariadb`, `postgres`, `postgresql`, `mongodb`, `redis`, `mssql`, `amqp`, `sqlite`), IPv4 & IPv6 Address | `[REDACTED_DB_URI]`, `[REDACTED_IP_ADDRESS]` |
| **Identitas & Finansial (ID)** | NIK (16 digit), NPWP (format titik/strip 15 digit & 16 digit berlabel), Nomor Kartu Kredit (4-4-4-4 & Amex 4-6-5) | `[REDACTED_NIK]`, `[REDACTED_NPWP]`, `[REDACTED_CREDIT_CARD]` |
| **Kontak & Pelanggan** | Email (RFC 5322 subset), Nomor Telepon Indonesia (`+62` / `62` / `08xx`), Customer Name, Customer ID, Order ID, Transaction ID, Invoice ID (`CUST-`, `ORD-`, `TRX-`, `TXN-`, `INV-`) | `[REDACTED_EMAIL]`, `[REDACTED_PHONE]`, `[REDACTED_CUSTOMER_ID]`, `[REDACTED_ORDER_ID]` |

> **Anti-False-Positive Guard:** Prefix teknis standar (`ISO`, `RFC`, `SHA`, `AES`, `RSA`, `UTF`, `IEEE`, `ANSI`, `HTTP`, `HTTPS`, `TLS`, `SSL`, `CVE`, `ERR`, `WARN`, `INFO`) serta garis pemisah (`----`) dikecualikan agar tidak salah terdeteksi sebagai ID/API Key.

---

## ⚙️ Mode Format Input

1. **`auto` (Default):** Mendeteksi otomatis apakah input merupakan JSON valid atau teks log biasa (*plaintext*).
2. **`json` (Strict JSON):** Mem-parsing struktur JSON secara rekursif (*AST traversal*), memeriksa nama key sensitif (`SENSITIVE_JSON_KEYS`) sekaligus memindai isi nilai string, lalu mempertahankan struktur JSON yang valid.
3. **`text` (Plaintext):** Memindai log mentah, stack trace, atau teks bebas secara langsung.

---

## 💻 Cara Penggunaan

### 1. Sebagai CLI (Node.js)
```bash
# Masking file JSON
node js/mask.js -input payload.json -format json

# Masking file log teks biasa dan simpan ke file baru
node js/mask.js -input app.log -output sanitized.log -format text

# Pipe langsung dari stdin dengan deteksi otomatis
cat data.json | node js/mask.js -format auto
```

### 2. Sebagai Node.js Module
```javascript
const { mask, maskWithStats, maskJSON, maskPlainText } = require('./js/mask.js');

const raw = JSON.stringify({
  db: 'postgresql://rick:secret@db.citadel.io:5432/prod',
  email: 'nisfal@citadel.io',
  nik: '3174051208980001'
});

const result = maskWithStats(raw, 'json');
console.log(result.masked);
console.log('Total redacted:', result.total, 'Breakdown:', result.counts);
```

### 3. Di Browser (`window.BrainwaveMasker`)
Modul otomatis teregistrasi di global `window.BrainwaveMasker` dan digunakan secara aktif di 3 tempat pada `profile.html`:
1. **Brainwave Masking Matrix (`#brainwave-mask`):** Konsol redaksi interaktif + Dual Oscilloscope Canvas.
2. **Quantum JSON Synthesizer (`#json-synthesizer`):** Tombol 1-klik **Cloak Secrets (`mask.js`)** dan **Cloak Both (`mask.js`)**.
3. **Citadel Subspace Terminal (`#contact`):** Toggle **Morty Brainwave Shield** yang otomatis menyensor pesan sebelum dikirim ke `/api/contact`.
