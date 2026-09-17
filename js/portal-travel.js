/**
 * Interdimensional Portal Travel Client - Nisfal Filsa Portfolio
 * Intercepts navigation to profile.html, triggers authorization modal & fullscreen portal warp VFX
 */

(function () {
  'use strict';

  // --- 1. Sound Synthesizer via Web Audio API ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playPortalJumpSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.linearRampToValueAtTime(3200, now + 0.4);
      filter.frequency.linearRampToValueAtTime(400, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.82);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playModalOpenSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playPortalHoverSound() {
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      // Ignore if user hasn't interacted yet
    }
  }

  // --- 2. Dynamic Modal Creation & Attachment ---
  let modalBackdrop = null;
  let targetUrl = 'profile';

  function createPortalModal() {
    if (document.getElementById('portalTravelModal')) return;

    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'portalTravelModal';
    modalBackdrop.className = 'portal-modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.setAttribute('aria-labelledby', 'portalModalTitle');

    modalBackdrop.innerHTML = `
      <div class="portal-modal-dialog">
        <div class="portal-modal-header">
          <span class="portal-modal-badge">
            <span class="portal-badge-led"></span>
            <span>SECURITY PROTOCOL // C-137 DETECTED</span>
          </span>
          <button type="button" class="portal-modal-close" id="btnPortalModalClose" aria-label="Tutup Peringatan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="portal-modal-body">
          <div class="portal-vortex-preview"></div>
          <span class="portal-modal-eyebrow">// INTERDIMENSIONAL JUMP WARNING</span>
          <h2 class="portal-modal-title" id="portalModalTitle" data-i18n="portal_modal_title">Lompat ke Dimensi C-137?</h2>
          <p class="portal-modal-desc" data-i18n="portal_modal_desc">
            Anda akan meninggalkan realitas portofolio formal dan melintasi fluida portal menuju <strong>Dimensi C-137</strong> (profil santai, sisi personal, eksperimen arsitektur liar, Cable TV, & Mr. Meeseeks).
          </p>

          <div class="portal-telemetry-box">
            <div class="telemetry-item">
              <span class="telemetry-lbl">DESTINATION:</span>
              <span class="telemetry-val">EARTH PRIME C-137</span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-lbl">TACHYON FLUID:</span>
              <span class="telemetry-val green">100% OPTIMAL</span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-lbl">MONOLITH SAFETY:</span>
              <span class="telemetry-val">HIGHLY UNSTABLE</span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-lbl">CITADEL CLEARANCE:</span>
              <span class="telemetry-val green">AUTHORIZED</span>
            </div>
          </div>
        </div>

        <div class="portal-modal-actions">
          <button type="button" class="btn-portal-cancel" id="btnPortalCancel">
            TETAP DI REALITAS BUMI
          </button>
          <button type="button" class="btn-portal-confirm" id="btnPortalConfirm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/><circle cx="12" cy="12" r="3"></circle></svg>
            <span>AKTIFKAN PORTAL GUN</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // Event Listeners for Modal
    const btnClose = document.getElementById('btnPortalModalClose');
    const btnCancel = document.getElementById('btnPortalCancel');
    const btnConfirm = document.getElementById('btnPortalConfirm');

    function closeModal() {
      document.body.classList.remove('portal-modal-open');
      if (modalBackdrop) modalBackdrop.classList.remove('active');
    }

    // Bind custom fluid cursor hover states for modal buttons
    [btnClose, btnCancel, btnConfirm].forEach(btn => {
      if (btn) {
        btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      }
    });

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        closeModal();
        triggerPortalWarp(targetUrl);
      });
    }
  }

  function openPortalModal() {
    createPortalModal();
    document.body.classList.add('portal-modal-open');
    requestAnimationFrame(() => {
      modalBackdrop.classList.add('active');
    });
  }

  // --- 3. Trigger Fullscreen Portal Warp Effect (Ultra-Smooth 60fps) ---
  function triggerPortalWarp(destination) {
    playPortalJumpSound();

    let warpOverlay = document.getElementById('portalWarpFullscreen');
    if (!warpOverlay) {
      warpOverlay = document.createElement('div');
      warpOverlay.id = 'portalWarpFullscreen';
      warpOverlay.className = 'portal-warp-fullscreen';

      let streaksHtml = '';
      for (let i = 0; i < 12; i++) {
        streaksHtml += `<div class="warp-streak" style="transform: rotate(${i * 30}deg);"></div>`;
      }

      warpOverlay.innerHTML = `
        <div class="warp-tunnel-wrapper">
          <div class="warp-ring-outer"></div>
          <div class="warp-ring-inner"></div>
          <div class="warp-singularity-core"></div>
        </div>
        <div class="warp-rays-container">
          ${streaksHtml}
        </div>
        <div class="warp-flash-blind"></div>
      `;
      document.body.appendChild(warpOverlay);
    }

    requestAnimationFrame(() => {
      warpOverlay.classList.add('active');
    });

    setTimeout(() => {
      window.location.href = destination.includes('?') ? `${destination}&warp=in` : `${destination}?warp=in`;
    }, 780);
  }

  // --- 4. Intercept All Links to profile (C-137) ---
  function bindPortalLinks() {
    const links = document.querySelectorAll('a[href*="profile.html"], a[href="profile"], a[href*="/profile"], .nav-link-portal, .floating-portal-btn');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        targetUrl = link.getAttribute('href') || 'profile';
        initAudio();
        playModalOpenSound();

        openPortalModal();
      });

      link.addEventListener('mouseenter', () => {
        playPortalHoverSound();
      });
    });
  }

  // --- 5. Reality Stabilization Toast upon Returning to Index ---
  function checkRealityReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('warp') === 'return') {
      const toast = document.createElement('div');
      toast.className = 'reality-stabilized-toast';
      toast.innerHTML = `
        <span class="stabilized-dot"></span>
        <span><strong>[REALITAS TERSTABILISASI]</strong> Berhasil kembali ke realitas bumi.</span>
      `;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('show');
      }, 150);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 4500);

      // Clean URL without refresh
      urlParams.delete('warp');
      const newQuery = urlParams.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  // --- 6. Initialize on DOM ready ---
  document.addEventListener('DOMContentLoaded', () => {
    bindPortalLinks();
    checkRealityReturn();
  });
})();
