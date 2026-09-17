// Vercel Serverless Function: /api/contact
// Multi-Layer Shielded Subspace Relay (Anti-Bot, Anti-Spam, Rate-Limited)

// Load local .env if running outside Vercel
if (!process.env.TELEGRAM_BOT_TOKEN) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim();
          if (!process.env[k]) process.env[k] = v;
        }
      }
    }
  } catch (e) {}
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GOOGLE_SHEET_WEB_APP_URL = process.env.GOOGLE_SHEET_WEB_APP_URL;

// ── In-Memory Sliding Window Rate Limiter ──
// Max 4 transmissions per 10 minutes per IP
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 4;

function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Clean timestamps older than window
  const validTimestamps = timestamps.filter(t => now - t < RATE_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestInWindow = validTimestamps[0];
    const retryAfterSec = Math.ceil((oldestInWindow + RATE_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSec };
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  
  // Housekeeping cleanup if map grows
  if (rateLimitMap.size > 1000) {
    for (const [key, list] of rateLimitMap.entries()) {
      if (list.every(t => now - t >= RATE_WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return { limited: false };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST accepted.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || 'Unknown Relay Node';

    // ── SECURITY LAYER 1: Honeypot Trap Check ──
    // If hidden bot field is filled, silently drop and return fake success
    if (body.portal_trap || body._hp) {
      console.warn(`[DEFENSE // HONEYPOT TRIGGERED] Automated bot payload dropped from IP: ${clientIp}`);
      return res.status(200).json({
        success: true,
        message: 'Transmission processed across multiversal relays.'
      });
    }

    // ── SECURITY LAYER 2: Serverless Rate Limiting (Sliding Window per IP) ──
    const rateCheck = checkRateLimit(clientIp);
    if (rateCheck.limited) {
      console.warn(`[DEFENSE // RATE LIMIT] IP ${clientIp} exceeded threshold. Retry in ${rateCheck.retryAfterSec}s`);
      return res.status(429).json({
        error: 'Citadel Defense Protocol: Rate limit exceeded.',
        message: `Terlalu banyak transmisi dari node Anda. Silakan tunggu ${rateCheck.retryAfterSec} detik sebelum mencoba lagi.`,
        retryAfter: rateCheck.retryAfterSec,
        code: 'RATE_LIMITED'
      });
    }

    // ── SECURITY LAYER 3: Interaction Time Verification (Anti-Headless Bot) ──
    // Humans take at least 1.2s to fill out the form
    const timeProof = Number(body._timeProof);
    if (timeProof && Date.now() - timeProof < 1200) {
      console.warn(`[DEFENSE // SPEED BOT] Headless bot submission detected (${Date.now() - timeProof}ms) from IP: ${clientIp}`);
      return res.status(400).json({
        error: 'Suspiciously rapid transmission detected. Automated bots prohibited.',
        code: 'TOO_FAST'
      });
    }

    // ── SECURITY LAYER 4: Payload Sanitization & Hard Constraints ──
    let { sender, email, mission, message } = body || {};

    if (!sender || !email || !message) {
      return res.status(400).json({
        error: 'Parameter formulir belum lengkap: sender, email, dan message wajib diisi.',
        code: 'MISSING_FIELDS'
      });
    }

    sender = String(sender).trim();
    email = String(email).trim().toLowerCase();
    message = String(message).trim();
    mission = String(mission || 'General Mission').trim();

    // Length validation
    if (sender.length < 2 || sender.length > 80) {
      return res.status(400).json({ error: 'Nama pengirim harus antara 2 hingga 80 karakter.', code: 'INVALID_SENDER' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 100 || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format alamat email tidak valid.', code: 'INVALID_EMAIL' });
    }

    if (message.length < 5 || message.length > 3000) {
      return res.status(400).json({ error: 'Pesan transmisi harus antara 5 hingga 3000 karakter.', code: 'INVALID_MESSAGE' });
    }

    // Anti-Link Flooding (Spam comments typically contain excessive links)
    const urlMatches = message.match(/https?:\/\//gi) || [];
    if (urlMatches.length > 3) {
      return res.status(400).json({ error: 'Transmisi terindikasi spam: batas maksimal adalah 3 link URL.', code: 'LINK_SPAM' });
    }

    // Allowed mission categories
    const ALLOWED_MISSIONS = [
      'Freelance Web Project',
      'Full-Time Engineering Quest',
      'Technical Consultation',
      'Interdimensional Collaboration',
      'Casual Transmission',
      'General Mission'
    ];
    if (!ALLOWED_MISSIONS.includes(mission)) {
      mission = 'General Transmission';
    }

    const timestamp = new Date().toISOString();
    const wibTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    // Format rich HTML for Telegram Bot
    const telegramText = 
`🚀 <b>[CITADEL SUBSPACE TRANSMISSION RECEIVED]</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Pengirim:</b> ${escapeHtml(sender)}
📧 <b>Frequency / Email:</b> <code>${escapeHtml(email)}</code>
🎯 <b>Tipe Misi:</b> ${escapeHtml(mission)}
⏱ <b>Waktu (WIB):</b> ${wibTime}
🌐 <b>Node:</b> <code>${escapeHtml(userAgent.substring(0, 80))}</code>
━━━━━━━━━━━━━━━━━━━━
💬 <b>Pesan / Payload:</b>
${escapeHtml(message)}
━━━━━━━━━━━━━━━━━━━━
<i>Dispatched via Citadel Subspace Terminal C-137</i>`;

    // 1. Dispatch to Telegram Bot
    let telegramResult = { ok: false };
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      telegramResult = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramText,
          parse_mode: 'HTML'
        })
      }).then(async (r) => {
        const data = await r.json();
        return { ok: r.ok && data.ok, data };
      }).catch(err => ({ ok: false, error: err.message }));
    } else {
      console.warn('Telegram Bot Token or Chat ID not configured');
    }

    // 2. Dispatch to Google Sheets Apps Script Web App
    let sheetResult = { ok: false };
    if (GOOGLE_SHEET_WEB_APP_URL) {
      sheetResult = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender,
          email,
          mission,
          message,
          userAgent: `${userAgent.substring(0, 100)} (IP: ${clientIp})`
        })
      }).then(async (r) => {
        const text = await r.text();
        return { ok: r.ok, text };
      }).catch(err => ({ ok: false, error: err.message }));
    } else {
      console.warn('Google Sheet Web App URL not configured');
    }

    return res.status(200).json({
      success: true,
      timestamp,
      telegram: telegramResult.ok ? 'delivered' : 'bypassed',
      googleSheet: sheetResult.ok ? 'recorded' : 'bypassed',
      message: 'Transmission successfully verified and dispatched through Citadel relays.'
    });

  } catch (error) {
    console.error('Citadel Terminal Dispatch Error:', error);
    return res.status(500).json({ error: 'Internal subspace relay error', details: error.message });
  }
};
