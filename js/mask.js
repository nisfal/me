#!/usr/bin/env node
/**
 * mask.js
 *
 * Tool & modul JavaScript untuk masking (redaction) data sensitif pada input JSON atau plaintext.
 * Hasil penyempurnaan & konversi dari mask.go.
 *
 * Entitas yang dideteksi & disensor:
 *   - Private Key (PEM block: RSA, EC, DSA, OPENSSH, ENCRYPTED, PGP)
 *   - Customer Name, Customer ID, Order ID (berlabel & pola kode ID)
 *   - JWT Token, Basic/Bearer Auth Token, API Key / Secret (berlabel & baris mandiri ber-entropi)
 *   - Database Connection String (mysql, mariadb, postgres, postgresql, mongodb, redis, mssql, amqp, sqlite)
 *   - Nomor Kartu Kredit (format 4-4-4-4, Amex 4-6-5, atau berlabel)
 *   - NPWP (format titik/strip XX.XXX.XXX.X-XXX.XXX, 15 digit polos, maupun 16 digit berlabel)
 *   - NIK (16 digit polos maupun berlabel)
 *   - Nomor Telepon Indonesia (+62 / 62 / 08xx dengan/tanpa pemisah spasi atau strip)
 *   - Email (RFC 5322 practical subset)
 *   - IPv6 (penuh, terkompresi ::, loopback ::1, IPv4-mapped) & IPv4 Address
 *   - Kode ID Generik (CUST-xxx, ORD-xxx, TRX-xxx, TXN-xxx, INV-xxx, dll.)
 *
 * Cara pakai (CLI):
 *   node mask.js -input data.json -format json
 *   node mask.js -input data.txt  -format text
 *   cat data.json | node mask.js -format auto
 *
 * Cara pakai (Module):
 *   const { mask, maskPlainText, maskJSON, maskJSONObject } = require('./mask.js');
 */

'use strict';

const fs = typeof require !== 'undefined' ? (() => { try { return require('fs'); } catch (_) { return null; } })() : null;

/**
 * Cek apakah input adalah Node Buffer (aman dijalankan di browser tanpa Buffer global)
 */
function isBuffer(val) {
  return typeof Buffer !== 'undefined' && typeof Buffer.isBuffer === 'function' && Buffer.isBuffer(val);
}

/**
 * Membuat tag hasil redaksi standar: [REDACTED_<LABEL>]
 * @param {string} label
 * @returns {string}
 */
function redactedTag(label) {
  return `[REDACTED_${label}]`;
}

/**
 * Menentukan label spesifik berdasarkan prefix kode ID (mis. CUST-123 -> CUSTOMER_ID)
 * @param {string} prefix
 * @returns {string}
 */
function idLabelFor(prefix) {
  switch (String(prefix).toUpperCase()) {
    case 'CUST':
    case 'CUSTOMER':
      return 'CUSTOMER_ID';
    case 'ORD':
    case 'ORDER':
      return 'ORDER_ID';
    case 'TRX':
    case 'TXN':
    case 'TRANSACTION':
      return 'TRANSACTION_ID';
    case 'INV':
    case 'INVOICE':
      return 'INVOICE_ID';
    default:
      return 'ID';
  }
}

// Prefix standar teknis yang BUKAN merupakan ID sensitif (mencegah false positive seperti ISO-8601, SHA-256, RFC-5322)
const IGNORED_ID_PREFIXES = new Set([
  'ISO', 'RFC', 'SHA', 'AES', 'RSA', 'UTF', 'IEEE', 'ANSI', 'HTTP', 'HTTPS', 'TLS', 'SSL', 'CVE', 'ERR', 'WARN', 'INFO'
]);

/**
 * Mengecek apakah string 20+ karakter pada satu baris tampak seperti API key / token acak
 * dan bukan kata biasa, nama variabel snake_case, atau garis pemisah markdown (---- / ____).
 * @param {string} token
 * @returns {boolean}
 */
function looksLikeStandaloneApiKey(token) {
  // Abaikan garis pemisah (hanya berisi - atau _)
  if (/^[-_]+$/.test(token)) return false;

  // Prefix API key populer (Stripe, GitHub, Google, AWS, Slack, dll.)
  if (/^(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{10,}$/.test(token)) return true;
  if (/^(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}$/.test(token)) return true;
  if (/^AIza[A-Za-z0-9\-_]{30,}$/.test(token)) return true;
  if (/^AKIA[A-Z0-9]{16}$/.test(token)) return true;
  if (/^xox[baprs]-[A-Za-z0-9-]{10,}$/.test(token)) return true;

  // Harus mengandung kombinasi huruf DAN angka (mencegah identifier biasa seperti WAITING_FOR_PAYMENT_CONFIRMATION)
  const hasLetter = /[A-Za-z]/.test(token);
  const hasDigit = /\d/.test(token);
  if (!hasLetter || !hasDigit) return false;

  // Jika mengandung huruf kecil, huruf besar, dan angka sekaligus -> sangat mungkin token acak
  const hasLower = /[a-z]/.test(token);
  const hasUpper = /[A-Z]/.test(token);
  if (hasLower && hasUpper && hasDigit) return true;

  // Hex string panjang (mis. 32+ karakter hex untuk MD5/SHA/secret key) atau alfanumerik dengan >= 4 digit
  const digitCount = (token.match(/\d/g) || []).length;
  return digitCount >= 4;
}

/**
 * Daftar aturan entitas berurutan.
 * Pola berlabel & blok multi-baris dieksekusi lebih dulu agar tidak terpotong oleh pola generik.
 */
const ENTITIES = [
  // 1. Private Key (PEM block)
  {
    label: 'PRIVATE_KEY',
    re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED |PGP )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA |EC |DSA |OPENSSH |ENCRYPTED |PGP )?PRIVATE KEY-----/g,
  },

  // 2. Customer Name berlabel (berhenti sebelum delimiter log , ; | ( ) [ ] { } atau pasangan key=value berikutnya)
  {
    label: 'CUSTOMER_NAME',
    labeled: true,
    re: /(customer[\s_-]?name)\s*[:=]\s*(?:"([^"\r\n]+)"|'([^'\r\n]+)'|([^\r\n,;|()[\]{}]+?))(?=\s*(?:[,;|()[\]{}]|\r?\n|$|[A-Za-z0-9_-]+\s*[:=]))/gi,
    replace: (match, keyLabel) => `${keyLabel}: ${redactedTag('CUSTOMER_NAME')}`,
  },

  // 3. Customer ID berlabel
  {
    label: 'CUSTOMER_ID',
    labeled: true,
    re: /(customer[\s_-]?id)\s*[:=]\s*(?:"([^"\r\n]+)"|'([^'\r\n]+)'|([^\s\r\n,;|()[\]{}]+))/gi,
    replace: (match, keyLabel) => `${keyLabel}: ${redactedTag('CUSTOMER_ID')}`,
  },

  // 4. Order ID berlabel (mempertahankan -[suffix] numerik bila berformat PREFIX-12345, atau menyensor penuh bila format lain)
  {
    label: 'ORDER_ID',
    labeled: true,
    re: /(order[\s_-]?id)\s*[:=]\s*['"]?(?:([A-Za-z]+)-(\d+)|([^\s\r\n,;|()[\]{}"']+))['"]?/gi,
    replace: (match, keyLabel, prefix, suffix) => {
      if (prefix && suffix) {
        return `${keyLabel}: ${redactedTag('ORDER_ID')}-${suffix}`;
      }
      return `${keyLabel}: ${redactedTag('ORDER_ID')}`;
    },
  },

  // 5. JWT Token (3 segmen base64url diawali eyJ)
  {
    label: 'JWT_TOKEN',
    re: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
  },

  // 6. Connection String Database (menjaga prefix DB_CONNECTION_STRING= bila ada)
  {
    label: 'DB_CONNECTION_STRING',
    re: /(?:(DB_CONNECTION_STRING\s*=\s*))?(?:mysql|mariadb|postgres|postgresql|mongodb(?:\+srv)?|redis|rediss|mssql|sqlserver|cockroach(?:db)?|amqp|amqps|sqlite):\/\/[^\s'"<>]+/gi,
    replace: (match, envPrefix) => {
      if (envPrefix) {
        return `DB_CONNECTION_STRING=${redactedTag('DB_CONNECTION_STRING')}`;
      }
      return redactedTag('DB_CONNECTION_STRING');
    },
  },

  // 7. API Key / Secret berlabel
  {
    label: 'API_KEY',
    re: /\b(?:api[_-]?key|access[_-]?key|secret[_-]?key|client[_-]?secret|app[_-]?secret|secret)\s*[:=]\s*(?:'[A-Za-z0-9\-_/.+=]{8,}'|"[A-Za-z0-9\-_/.+=]{8,}"|[A-Za-z0-9\-_/.+=]{16,})/gi,
  },

  // 8. Authorization Header / Bearer & Basic Token (jangan timpa jika sudah menjadi [REDACTED_JWT_TOKEN])
  {
    label: 'AUTH_TOKEN',
    re: /\b(?:Bearer|Basic)\s+(?!\[REDACTED_)[A-Za-z0-9\-._~+/]+=*/gi,
  },

  // 9. API Key / Token mandiri 20+ karakter pada satu baris penuh (hanya untuk plaintext, dicek entropinya)
  {
    label: 'API_KEY',
    standaloneOnly: true,
    re: /^[A-Za-z0-9\-_]{20,}$/gm,
    replace: (match) => (looksLikeStandaloneApiKey(match) ? redactedTag('API_KEY') : match),
  },

  // 10. Credit Card (format 4-4-4-4 atau Amex 4-6-5 dengan pemisah spasi/strip)
  {
    label: 'CREDIT_CARD',
    re: /\b(?:\d{4}[- ]\d{4}[- ]\d{4}[- ]\d{4}|\d{4}[- ]\d{6}[- ]\d{5})\b/g,
  },

  // 11. NPWP berlabel (menangani NPWP 15 maupun 16 digit yang diberi label eksplisit agar tidak salah dideteksi sebagai NIK)
  {
    label: 'NPWP',
    labeled: true,
    re: /\b(npwp)\s*[:=]\s*['"]?(?:\d{2}[.\s-]\d{3}[.\s-]\d{3}[.\s-]\d[.\s-]\d{3}[.\s-]\d{3,4}|\d{15,16})['"]?\b/gi,
    replace: (match, keyLabel) => `${keyLabel}: ${redactedTag('NPWP')}`,
  },

  // 12. NPWP format titik/strip (XX.XXX.XXX.X-XXX.XXX) & 15 digit polos
  {
    label: 'NPWP',
    re: /\b\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}\b/g,
  },
  {
    label: 'NPWP',
    re: /(?<!\[REDACTED_[A-Z_]+\]-)\b\d{15}\b/g,
  },

  // 13. NIK (16 digit polos, pastikan bukan suffix dari [REDACTED_ORDER_ID]-...)
  {
    label: 'NIK',
    re: /(?<!\[REDACTED_[A-Z_]+\]-)\b\d{16}\b/g,
  },

  // 14. Nomor Telepon Indonesia (+62 / 62 / 08xx, mendukung spasi atau strip antar grup angka)
  {
    label: 'PHONE_NUMBER',
    re: /(?<![0-9A-Za-z])(?:\+62|62|0)[\s.-]*8[1-9][0-9]{1,3}(?:[\s.-]*[0-9]{3,4}){1,3}\b|(?<![0-9A-Za-z])(?:\+62|62|0)8[1-9][0-9]{6,11}\b/g,
  },

  // 15. Email (RFC 5322 practical subset)
  {
    label: 'EMAIL',
    re: /\b[A-Za-z0-9.!#$%&'*+/=?^_{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+\b/g,
  },

  // 16. IPv6 Address (format penuh 8 segmen, terkompresi ::, loopback ::1, dan IPv4-mapped ::ffff:192.0.2.1)
  {
    label: 'IPV6_ADDRESS',
    re: /(?<![A-Fa-f0-9:])(?:(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,7}:|(?:[A-Fa-f0-9]{1,4}:){1,6}:[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,5}(?::[A-Fa-f0-9]{1,4}){1,2}|(?:[A-Fa-f0-9]{1,4}:){1,4}(?::[A-Fa-f0-9]{1,4}){1,3}|(?:[A-Fa-f0-9]{1,4}:){1,3}(?::[A-Fa-f0-9]{1,4}){1,4}|(?:[A-Fa-f0-9]{1,4}:){1,2}(?::[A-Fa-f0-9]{1,4}){1,5}|[A-Fa-f0-9]{1,4}:(?:(?::[A-Fa-f0-9]{1,4}){1,6})|:(?:(?::[A-Fa-f0-9]{1,4}){1,7}|:)|::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]))(?![A-Fa-f0-9:])/g,
  },

  // 17. IPv4 Address
  {
    label: 'IPV4_ADDRESS',
    re: /\b(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b/g,
  },

  // 18. Kode ID Generik (dijalankan paling akhir, mengabaikan prefix standar teknis & tag REDACTED)
  {
    label: 'ID_CODE',
    re: /(?<!\[REDACTED_)\b([A-Za-z]{2,10})-(\d{3,10})\b/g,
    replace: (match, prefix) => {
      if (IGNORED_ID_PREFIXES.has(prefix.toUpperCase())) {
        return match;
      }
      return redactedTag(idLabelFor(prefix));
    },
  },
];

/**
 * Daftar nama kunci JSON sensitif (dinormalisasi ke huruf kecil tanpa pemisah _, -, atau spasi).
 */
const SENSITIVE_JSON_KEYS = {
  customername: 'CUSTOMER_NAME',
  fullname: 'CUSTOMER_NAME',
  namapelanggan: 'CUSTOMER_NAME',
  namalengkap: 'CUSTOMER_NAME',
  customerid: 'CUSTOMER_ID',
  userid: 'CUSTOMER_ID',
  buyerid: 'CUSTOMER_ID',
  clientid: 'CUSTOMER_ID',
  orderid: 'ORDER_ID',
  transactionid: 'TRANSACTION_ID',
  trxid: 'TRANSACTION_ID',
  txnid: 'TRANSACTION_ID',
  invoiceid: 'INVOICE_ID',
  nik: 'NIK',
  noktp: 'NIK',
  ktp: 'NIK',
  npwp: 'NPWP',
  nonpwp: 'NPWP',
  email: 'EMAIL',
  emailaddress: 'EMAIL',
  phone: 'PHONE_NUMBER',
  phonenumber: 'PHONE_NUMBER',
  nomortelepon: 'PHONE_NUMBER',
  notelepon: 'PHONE_NUMBER',
  notelp: 'PHONE_NUMBER',
  nohp: 'PHONE_NUMBER',
  handphone: 'PHONE_NUMBER',
  mobile: 'PHONE_NUMBER',
  mobilephone: 'PHONE_NUMBER',
  whatsapp: 'PHONE_NUMBER',
  creditcard: 'CREDIT_CARD',
  cardnumber: 'CREDIT_CARD',
  ccnumber: 'CREDIT_CARD',
  nokartukredit: 'CREDIT_CARD',
  cvv: 'SECRET',
  cvc: 'SECRET',
  pin: 'SECRET',
  otp: 'SECRET',
  password: 'SECRET',
  passwd: 'SECRET',
  pass: 'SECRET',
  secret: 'SECRET',
  secretkey: 'API_KEY',
  clientsecret: 'API_KEY',
  apikey: 'API_KEY',
  accesskey: 'API_KEY',
  accesstoken: 'AUTH_TOKEN',
  refreshtoken: 'AUTH_TOKEN',
  idtoken: 'AUTH_TOKEN',
  token: 'AUTH_TOKEN',
  authtoken: 'AUTH_TOKEN',
  authorization: 'AUTH_TOKEN',
  jwt: 'JWT_TOKEN',
  jwttoken: 'JWT_TOKEN',
  privatekey: 'PRIVATE_KEY',
  connectionstring: 'DB_CONNECTION_STRING',
  dbconnectionstring: 'DB_CONNECTION_STRING',
  dburi: 'DB_CONNECTION_STRING',
  databaseurl: 'DB_CONNECTION_STRING',
  ipaddress: 'IPV4_ADDRESS',
  ip: 'IPV4_ADDRESS',
  ipv4: 'IPV4_ADDRESS',
  ipv6: 'IPV6_ADDRESS',
  clientip: 'IPV4_ADDRESS',
  remoteip: 'IPV4_ADDRESS',
};

/**
 * Normalisasi nama key JSON (lowercase, hapus _, -, dan spasi)
 * @param {string} key
 * @returns {string}
 */
function normalizeKey(key) {
  return String(key || '')
    .toLowerCase()
    .replace(/[_\-\s]/g, '');
}

/**
 * Menjalankan masking pada teks biasa (plaintext).
 * @param {string} input
 * @param {{ isJSONValue?: boolean }} [options]
 * @returns {string}
 */
function maskPlainText(input, options = {}) {
  if (typeof input !== 'string' || input.length === 0) {
    return input;
  }

  const isJSONValue = Boolean(options.isJSONValue);
  // Normalisasi non-breaking space (0xA0) menjadi spasi biasa
  let out = input.replace(/\u00a0/g, ' ');

  for (const entity of ENTITIES) {
    // Pada nilai string di dalam JSON, hindari aturan baris mandiri jika string tidak multi-baris
    if (isJSONValue && entity.standaloneOnly && !out.includes('\n')) {
      continue;
    }

    if (typeof entity.replace === 'function') {
      out = out.replace(entity.re, entity.replace);
    } else {
      out = out.replace(entity.re, redactedTag(entity.label));
    }
  }

  return out;
}

/**
 * Menentukan tag redaksi yang tepat untuk nilai pada key JSON sensitif.
 * Misalnya jika key = "ip" tetapi nilainya adalah IPv6, otomatis gunakan IPV6_ADDRESS.
 * @param {string} defaultLabel
 * @param {*} val
 * @returns {string}
 */
function resolveSensitiveKeyLabel(defaultLabel, val) {
  const strVal = String(val).trim();
  if (defaultLabel === 'IPV4_ADDRESS' && strVal.includes(':')) {
    return 'IPV6_ADDRESS';
  }
  if (defaultLabel === 'AUTH_TOKEN' && /^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(strVal)) {
    return 'JWT_TOKEN';
  }
  return defaultLabel;
}

/**
 * Memproses dan menyensor nilai JSON secara rekursif (mendukung Object, Array, String, dan Number).
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
function maskJSONValue(key, value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => maskJSONValue(key, item));
  }

  if (typeof value === 'object') {
    return maskJSONObject(value);
  }

  const normalized = normalizeKey(key);
  const sensitiveLabel = SENSITIVE_JSON_KEYS[normalized];

  if (typeof value === 'string') {
    if (sensitiveLabel) {
      if (value.trim() === '') return value;
      return redactedTag(resolveSensitiveKeyLabel(sensitiveLabel, value));
    }
    return maskPlainText(value, { isJSONValue: true });
  }

  // Perbaikan dari versi Go: nilai numerik pada key sensitif (mis. {"nik": 3171..., "customer_id": 12345}) ikut disensor
  if (typeof value === 'number' || typeof value === 'bigint') {
    if (sensitiveLabel) {
      return redactedTag(sensitiveLabel);
    }
    // Cek apabila angka panjang tanpa key sensitif adalah NIK (16 digit) atau NPWP (15 digit)
    const numStr = String(value);
    if (/^\d{16}$/.test(numStr)) return redactedTag('NIK');
    if (/^\d{15}$/.test(numStr)) return redactedTag('NPWP');
    return value;
  }

  return value;
}

/**
 * Menyensor seluruh properti di dalam objek JSON secara rekursif.
 * @param {Record<string, *>} obj
 * @returns {Record<string, *>}
 */
function maskJSONObject(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return maskJSONValue('', obj);
  }

  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    result[k] = maskJSONValue(k, v);
  }
  return result;
}

/**
 * Mem-parse string JSON, melakukan masking pada seluruh isinya, dan mengembalikan string JSON terformat.
 * @param {string | Buffer} input
 * @returns {string}
 */
function maskJSON(input) {
  const rawText = isBuffer(input) ? input.toString('utf8') : String(input);
  const parsed = JSON.parse(rawText);
  const masked = maskJSONValue('', parsed);
  return JSON.stringify(masked, null, 2);
}

/**
 * Fungsi utama dengan dukungan mode 'auto' | 'json' | 'text'.
 * @param {string | Buffer} input
 * @param {'auto' | 'json' | 'text'} [format='auto']
 * @returns {string}
 */
function mask(input, format = 'auto') {
  const rawText = isBuffer(input) ? input.toString('utf8') : String(input);
  const mode = String(format || 'auto').toLowerCase();

  if (mode === 'json') {
    return maskJSON(rawText);
  }
  if (mode === 'text') {
    return maskPlainText(rawText);
  }
  if (mode === 'auto') {
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return maskJSON(rawText);
      } catch (_) {
        // Fallback ke plaintext jika bukan JSON valid
      }
    }
    return maskPlainText(rawText);
  }

  throw new Error(`Format tidak dikenal: ${format} (gunakan json|text|auto)`);
}

/**
 * Menjalankan masking dan menghitung telemetri jumlah entitas yang disensor.
 * Cocok untuk UI / HUD telemetri Brainwave Masking.
 * @param {string | Buffer} input
 * @param {'auto' | 'json' | 'text'} [format='auto']
 * @returns {{ masked: string, total: number, counts: Record<string, number>, efficiency: number }}
 */
function maskWithStats(input, format = 'auto') {
  const masked = mask(input, format);
  const counts = {};
  let total = 0;
  const regex = /\[REDACTED_([A-Z0-9_]+)\]/g;
  let match;
  while ((match = regex.exec(masked)) !== null) {
    const label = match[1];
    counts[label] = (counts[label] || 0) + 1;
    total++;
  }
  return {
    masked,
    total,
    counts,
    efficiency: total > 0 ? 100 : 0,
  };
}

// ============================================================================
// CLI Runner (kompatibel dengan flag Go: -input, -output, -format maupun --input)
// ============================================================================

function parseCliArgs(argv) {
  const args = { input: '-', output: '-', format: 'auto', help: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help' || arg === '-help') {
      args.help = true;
    } else if (/^--?(?:input|i)=(.+)$/.test(arg)) {
      args.input = arg.split('=')[1];
    } else if (arg === '-input' || arg === '--input' || arg === '-i') {
      args.input = argv[++i] || '-';
    } else if (/^--?(?:output|o)=(.+)$/.test(arg)) {
      args.output = arg.split('=')[1];
    } else if (arg === '-output' || arg === '--output' || arg === '-o') {
      args.output = argv[++i] || '-';
    } else if (/^--?(?:format|f)=(.+)$/.test(arg)) {
      args.format = arg.split('=')[1];
    } else if (arg === '-format' || arg === '--format' || arg === '-f') {
      args.outputFormatSet = true;
      args.format = argv[++i] || 'auto';
    }
  }
  return args;
}

function runCli() {
  const args = parseCliArgs(process.argv);

  if (args.help) {
    process.stdout.write(
      [
        'Usage: node mask.js [options]',
        '',
        'Options:',
        '  -input,  --input <path>    Path file input (default: "-" / stdin)',
        '  -output, --output <path>   Path file output (default: "-" / stdout)',
        '  -format, --format <mode>   Format input: json | text | auto (default: "auto")',
        '  -h,      --help            Tampilkan bantuan ini',
        '',
      ].join('\n')
    );
    process.exit(0);
  }

  let raw;
  try {
    if (!args.input || args.input === '-') {
      raw = fs.readFileSync(0, 'utf8');
    } else {
      raw = fs.readFileSync(args.input, 'utf8');
    }
  } catch (err) {
    process.stderr.write(`gagal membaca input: ${err.message}\n`);
    process.exit(1);
  }

  let result;
  try {
    result = mask(raw, args.format);
  } catch (err) {
    if (String(args.format).toLowerCase() === 'json') {
      process.stderr.write(`input bukan JSON valid: ${err.message}\n`);
    } else {
      process.stderr.write(`${err.message}\n`);
    }
    process.exit(1);
  }

  try {
    if (!args.output || args.output === '-') {
      process.stdout.write(result + '\n');
    } else {
      fs.writeFileSync(args.output, result, { encoding: 'utf8', mode: 0o644 });
    }
  } catch (err) {
    process.stderr.write(`gagal menulis output: ${err.message}\n`);
    process.exit(1);
  }
}
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  runCli();
}

const BrainwaveMasker = {
  mask,
  maskWithStats,
  maskPlainText,
  maskJSON,
  maskJSONObject,
  maskJSONValue,
  redactedTag,
  ENTITIES,
  SENSITIVE_JSON_KEYS,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrainwaveMasker;
}

if (typeof window !== 'undefined') {
  window.BrainwaveMasker = BrainwaveMasker;
}