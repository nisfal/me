/* ==========================================================================
   RICK AND MORTY (DIMENSION C-137) INTERACTIVE ENGINE - EXPANDED
   Swirling Canvas, Web Audio Synthesizer, 3D Flip Wanted Poster,
   Interdimensional Cable TV, Angry Meeseeks & The Butter Robot
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. Sound FX Synthesizer (Native Web Audio API) ---
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playPortalSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const now = audioCtx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.linearRampToValueAtTime(2600, now + 0.2);
      filter.frequency.linearRampToValueAtTime(350, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playGlitchSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(220, now + 0.08);
      osc.frequency.setValueAtTime(660, now + 0.16);
      osc.frequency.setValueAtTime(110, now + 0.24);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playMeeseeksChime() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.01, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.26);
      });
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playMeeseeksRageSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.1);
      osc.frequency.linearRampToValueAtTime(220, now + 0.25);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.4);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playMeeseeksMeltdownAlarmSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      // Harsh emergency klaxon with 3 rapid pulsing dual-saw sweeps
      for (let i = 0; i < 3; i++) {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        const startTime = now + i * 0.35;
        const endTime = startTime + 0.32;

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(880, startTime);
        osc1.frequency.linearRampToValueAtTime(320, endTime);

        osc2.frequency.setValueAtTime(890, startTime);
        osc2.frequency.linearRampToValueAtTime(310, endTime);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.28, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(endTime + 0.05);
        osc2.stop(endTime + 0.05);
      }
    } catch (e) {
      console.debug('Meltdown audio error:', e);
    }
  }

  function playTvStaticSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const bufferSize = audioCtx.sampleRate * 0.25;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.24);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playRobotBeep() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.setValueAtTime(900, now + 0.07);
      osc.frequency.setValueAtTime(1800, now + 0.14);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.29);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playMortyBeep() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.linearRampToValueAtTime(820, now + 0.05);
      osc.frequency.linearRampToValueAtTime(520, now + 0.11);
      osc.frequency.linearRampToValueAtTime(960, now + 0.16);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playRickBeep() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(960, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
      osc.frequency.linearRampToValueAtTime(780, now + 0.16);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playCardFlipSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.21);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playRealityCollapseSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.55);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.55);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playTerminalBeepSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.035);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.042);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  function playTerminalTransmitSound() {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const notes = [440, 660, 880, 1320, 1760];

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.055);

        gain.gain.setValueAtTime(0.01, now + idx * 0.055);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.055 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.16);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.055);
        osc.stop(now + idx * 0.055 + 0.17);
      });
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  // --- 2. Interactive Portal Swirl Canvas with Mouse Tracking ---
  const canvas = document.getElementById('portalCanvas');
  let ctx = null;
  let particles = [];
  let currentHue = 90;
  let targetCenterX = window.innerWidth * 0.75;
  let targetCenterY = window.innerHeight * 0.45;
  let currentCenterX = targetCenterX;
  let currentCenterY = targetCenterY;

  function initCanvas() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement interaction
    window.addEventListener('mousemove', (e) => {
      targetCenterX = e.clientX;
      targetCenterY = e.clientY;
    });

    particles = [];
    const count = window.innerWidth < 768 ? 40 : 85;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    animate();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * (Math.min(window.innerWidth, window.innerHeight) * 0.55);
    return {
      angle,
      radius,
      speed: 0.009 + Math.random() * 0.02,
      size: 2 + Math.random() * 4.5,
      alpha: 0.2 + Math.random() * 0.7,
      colorOffset: (Math.random() - 0.5) * 35
    };
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smoothly ease vortex center towards mouse / default center
    const defaultX = window.innerWidth > 900 ? canvas.width * 0.75 : canvas.width * 0.5;
    const defaultY = window.innerHeight > 900 ? canvas.height * 0.45 : canvas.height * 0.35;
    
    currentCenterX += ((targetCenterX * 0.4 + defaultX * 0.6) - currentCenterX) * 0.05;
    currentCenterY += ((targetCenterY * 0.4 + defaultY * 0.6) - currentCenterY) * 0.05;

    // Center portal vortex glow
    const grad = ctx.createRadialGradient(currentCenterX, currentCenterY, 20, currentCenterX, currentCenterY, 340);
    grad.addColorStop(0, `hsla(${currentHue}, 90%, 55%, 0.22)`);
    grad.addColorStop(0.5, `hsla(${currentHue}, 80%, 45%, 0.08)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(currentCenterX, currentCenterY, 340, 0, Math.PI * 2);
    ctx.fill();

    // Spiral swirl particles (Ultra-fast 2-pass glow, 0% Gaussian shadow filter cost)
    particles.forEach((p) => {
      p.angle += p.speed;
      p.radius -= 0.25;
      if (p.radius < 20) {
        p.radius = Math.min(canvas.width, canvas.height) * 0.52;
        p.alpha = 0.1;
      } else if (p.alpha < 0.85) {
        p.alpha += 0.008;
      }

      const x = currentCenterX + Math.cos(p.angle) * p.radius;
      const y = currentCenterY + Math.sin(p.angle) * (p.radius * 0.78);

      // Outer soft glow halo
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${currentHue}, 90%, 50%, ${p.alpha * 0.22})`;
      ctx.fill();

      // Inner solid particle core
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${currentHue + p.colorOffset}, 95%, 60%, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // --- 3. 3D Card Flip (Citadel ID <-> Galactic Wanted Poster) ---
  function setup3DCardFlip() {
    const flipper = document.getElementById('citadelFlipper');
    const btnFlipToWanted = document.getElementById('btnFlipToWanted');
    const btnFlipToId = document.getElementById('btnFlipToId');
    const navFlyoutCitizenId = document.getElementById('navFlyoutCitizenId');
    const navFlyoutWanted = document.getElementById('navFlyoutWanted');

    if (!flipper) return;

    function setFlippedState(flipped, playSound = true) {
      const isCurrentlyFlipped = flipper.classList.contains('flipped');
      if (isCurrentlyFlipped !== flipped) {
        if (playSound) playCardFlipSound();
        if (flipped) {
          flipper.classList.add('flipped');
        } else {
          flipper.classList.remove('flipped');
        }
      }
      updateDossierFlyoutHighlight(flipped);
    }

    function flipCard() {
      const targetState = !flipper.classList.contains('flipped');
      setFlippedState(targetState, true);
    }

    function updateDossierFlyoutHighlight(isFlipped) {
      if (navFlyoutCitizenId && navFlyoutWanted) {
        if (isFlipped) {
          navFlyoutWanted.classList.add('active');
          navFlyoutCitizenId.classList.remove('active');
        } else {
          navFlyoutCitizenId.classList.add('active');
          navFlyoutWanted.classList.remove('active');
        }
      }
    }

    if (btnFlipToWanted) btnFlipToWanted.addEventListener('click', flipCard);
    if (btnFlipToId) btnFlipToId.addEventListener('click', flipCard);

    // Nav Flyout links: switch to Citadel ID or Wanted view and scroll to Citadel
    if (navFlyoutCitizenId) {
      navFlyoutCitizenId.addEventListener('click', () => {
        setFlippedState(false, true);
        const citadelSec = document.getElementById('citadel');
        if (citadelSec) {
          citadelSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    if (navFlyoutWanted) {
      navFlyoutWanted.addEventListener('click', () => {
        setFlippedState(true, true);
        const citadelSec = document.getElementById('citadel');
        if (citadelSec) {
          citadelSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  // --- 4. Dimension Shifter Logic with Glitch Warp ---
  const DIMENSIONS = {
    c137: { class: 'dim-c137', hue: 90, label: 'Earth C-137' },
    cronenberg: { class: 'dim-cronenberg', hue: 35, label: 'Cronenberg Dimension' },
    purge: { class: 'dim-purge', hue: 355, label: 'Purge Planet' },
    citadel: { class: 'dim-citadel', hue: 190, label: 'Citadel of Ricks' }
  };

  function setupDimensionShifter() {
    const buttons = document.querySelectorAll('.btn-dimension');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const dimKey = btn.getAttribute('data-dim');
        const dimData = DIMENSIONS[dimKey];
        if (!dimData) return;

        // Play SFX & Glitch
        playGlitchSound();
        playPortalSound();

        // Trigger glitch warp visual animation
        document.body.classList.add('portal-transition-glitch');
        setTimeout(() => {
          document.body.classList.remove('portal-transition-glitch');
        }, 450);

        // Update body class
        document.body.className = dimData.class;
        currentHue = dimData.hue;

        // Update active buttons
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Visual feedback
        const shifterSub = document.getElementById('currentDimText');
        if (shifterSub) {
          shifterSub.textContent = `Aktif di: ${dimData.label} // Fluida portal terkalibrasi`;
        }
      });
    });
  }

  // --- Helper: Get active portfolio language ---
  function getActiveLang() {
    return localStorage.getItem('portfolio_language') || (document.documentElement.lang === 'en' ? 'en' : 'id');
  }

  // --- 5. Interdimensional Cable TV (Project Showcase) ---
  const TV_CHANNELS = {
    id: [
      {
        channelNum: 'CH-01',
        freq: '137.42 GHz',
        tag: 'INTERDIMENSIONAL BACKEND INFRASTRUCTURE',
        rating: 'TV-MA (Extreme Throughput)',
        title: 'ALLINA WEB BACKEND: Dual-Reactor Stream Engine',
        description: 'Capek sistem transaksi galaksi kamu nge-hang pas jutaan alien serentak akses data? Di semesta C-137, Nisfal merancang backend berbasis Express v5, Prisma v6 Dual-Client (Main + Mediation), dan RabbitMQ event streaming dengan Dead-Letter recovery! Sanggup mengolah ratusan ribu operasi per detik tanpa server meleduk!',
        highlights: [
          'Dual Prisma Client (Mediation & Main DB)',
          'RabbitMQ Streaming with DLQ Fallback',
          'Redis In-Memory Caching & MinIO S3',
          'CASL Granular RBAC/ABAC Security'
        ],
        linkUrl: 'backend',
        linkLabel: 'Inspeksi Arsitektur Backend'
      },
      {
        channelNum: 'CH-02',
        freq: '420.69 GHz',
        tag: 'QUANTUM REACT REACTIVITY SHOW',
        rating: 'TV-PG (Hyper Smooth)',
        title: 'ALLINA WEB FRONTEND: Zero-Lag Hydration Chamber',
        description: 'Jangan biarkan pengunjung antariksa kabur gara-gara web kamu lemot! Nisfal memadukan Next.js 15 App Router, React 19, Tailwind CSS v4, dan Zustand v5 dengan E2EE session auto-recovery dan proxy middleware super aman. Tampilan ultra-tajam, smooth 60fps, dan responsive di segala gadget dimensi!',
        highlights: [
          'Next.js 15 App Router & Server Components',
          'TanStack Query v5 + Zustand v5 State',
          'E2EE Key Exchange & Auto-Recovery',
          'Interactive Leaflet Map & Rich Dashboards'
        ],
        linkUrl: 'frontend',
        linkLabel: 'Eksplorasi Showcase Frontend'
      }
    ],
    en: [
      {
        channelNum: 'CH-01',
        freq: '137.42 GHz',
        tag: 'INTERDIMENSIONAL BACKEND INFRASTRUCTURE',
        rating: 'TV-MA (Extreme Throughput)',
        title: 'ALLINA WEB BACKEND: Dual-Reactor Stream Engine',
        description: 'Tired of galactic transaction bottlenecks when millions of alien entities hit your servers? In dimension C-137, Nisfal engineered an Express v5 + Prisma v6 Dual-Client backend with RabbitMQ event streaming and Dead-Letter recovery, churning through hundreds of thousands of ops/s without system meltdown!',
        highlights: [
          'Dual Prisma Client (Mediation & Main DB)',
          'RabbitMQ Streaming with DLQ Fallback',
          'Redis In-Memory Caching & MinIO S3',
          'CASL Granular RBAC/ABAC Security'
        ],
        linkUrl: 'backend',
        linkLabel: 'Inspect Backend Architecture'
      },
      {
        channelNum: 'CH-02',
        freq: '420.69 GHz',
        tag: 'QUANTUM REACT REACTIVITY SHOW',
        rating: 'TV-PG (Hyper Smooth)',
        title: 'ALLINA WEB FRONTEND: Zero-Lag Hydration Chamber',
        description: 'Don\'t let cosmic explorers bounce due to sluggish latency! Nisfal combines Next.js 15 App Router, React 19, Tailwind CSS v4, and Zustand v5 with E2EE session auto-recovery and secure proxy routing. Razor-sharp visuals, silky 60fps motion, and responsive perfection across all dimensional devices!',
        highlights: [
          'Next.js 15 App Router & Server Components',
          'TanStack Query v5 + Zustand v5 State',
          'E2EE Key Exchange & Auto-Recovery',
          'Interactive Leaflet Map & Rich Dashboards'
        ],
        linkUrl: 'frontend',
        linkLabel: 'Explore Frontend Showcase'
      }
    ]
  };

  let currentChannelIndex = 0;
  let rotaryAngle = 0;

  function renderChannel(index) {
    const screen = document.getElementById('tvChannelScreen');
    const indicator = document.getElementById('channelIndicator');
    const freqElem = document.getElementById('tvFreq');
    const noise = document.getElementById('crtNoise');
    const knob = document.getElementById('tvRotaryKnob');
    const btnCh0 = document.getElementById('btnCh0');
    const btnCh1 = document.getElementById('btnCh1');

    if (!screen || !indicator) return;

    const lang = getActiveLang();
    const channels = TV_CHANNELS[lang] || TV_CHANNELS.id;
    const ch = channels[index % channels.length];

    // Trigger TV static noise visual
    if (noise) {
      noise.classList.add('channel-switch-burst');
      setTimeout(() => noise.classList.remove('channel-switch-burst'), 250);
    }

    // Sync push button active states
    if (btnCh0) btnCh0.classList.toggle('active', index === 0);
    if (btnCh1) btnCh1.classList.toggle('active', index === 1);

    // Sync rotary knob angle
    if (knob) {
      knob.style.transform = `rotate(${rotaryAngle}deg)`;
    }

    screen.style.opacity = '0';
    screen.style.transform = 'translateY(8px)';

    setTimeout(() => {
      indicator.textContent = ch.channelNum;
      if (freqElem) freqElem.textContent = ch.freq;

      screen.innerHTML = `
        <div class="channel-tag-line">
          <span class="channel-tag">// ${ch.tag}</span>
          <span class="channel-rating">${ch.rating}</span>
        </div>
        <h3 class="channel-broadcast-title">${ch.title}</h3>
        <p class="channel-broadcast-desc">${ch.description}</p>
        <ul class="channel-highlights-list">
          ${ch.highlights.map(h => `<li><span class="ch-bullet-dot"></span><span>${h}</span></li>`).join('')}
        </ul>
        <div class="channel-action-row">
          <a href="${ch.linkUrl}" class="btn-channel-inspect">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            <span>${ch.linkLabel}</span>
          </a>
        </div>
      `;

      screen.style.opacity = '1';
      screen.style.transform = 'translateY(0)';
    }, 150);
  }

  function setupCableTv() {
    const btnNext = document.getElementById('btnNextChannel');
    const rotaryKnob = document.getElementById('tvRotaryKnob');
    const btnCh0 = document.getElementById('btnCh0');
    const btnCh1 = document.getElementById('btnCh1');

    renderChannel(currentChannelIndex);

    function switchChannel(newIndex) {
      playTvStaticSound();
      currentChannelIndex = newIndex;
      rotaryAngle += 60;
      renderChannel(currentChannelIndex);
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const len = (TV_CHANNELS[getActiveLang()] || TV_CHANNELS.id).length;
        switchChannel((currentChannelIndex + 1) % len);
      });
    }

    if (rotaryKnob) {
      rotaryKnob.addEventListener('click', () => {
        const len = (TV_CHANNELS[getActiveLang()] || TV_CHANNELS.id).length;
        switchChannel((currentChannelIndex + 1) % len);
      });
    }

    if (btnCh0) {
      btnCh0.addEventListener('click', () => {
        if (currentChannelIndex !== 0) switchChannel(0);
      });
    }

    if (btnCh1) {
      btnCh1.addEventListener('click', () => {
        if (currentChannelIndex !== 1) switchChannel(1);
      });
    }
  }

  // --- 6. Mr. Meeseeks Task Box with Escalation & Angry State ---
  const MEESEEKS_QUOTES = {
    id: [
      {
        action: "I'm Mr. Meeseeks, look at me!",
        quote: "Mau sistem backend kamu nanganin 100k+ request tanpa down? Sini gue pasangin RabbitMQ queue ber-policy DLQ dan Go Gin microservices!"
      },
      {
        action: "Wubba Lubba Dub Dub!",
        quote: "Jangan pernah deploy langsung ke production pas Jumat sore di jam pulang kantor, Morty! Nanti malam minggu kamu abis cuma buat rollback!"
      },
      {
        action: "Existence is pain!",
        quote: "Sakit banget rasanya ngeliat ORM yang nembak N+1 queries ke tabel database puluhan juta row! Pakai Prisma dual-client indexing & Redis caching dong!"
      },
      {
        action: "Look at me!",
        quote: "Bikin antarmuka web lemot itu kejahatan interdimensional! Next.js 15 Server Components + Zustand v5 bikin browser secepat Portal Gun!"
      },
      {
        action: "Ooh, yeah, can-do!",
        quote: "Butuh otorisasi data yang ketat biar alien gak sembarangan sniffing token? Terapin CASL granular RBAC/ABAC dan E2EE session auto-recovery!"
      },
      {
        action: "I'm Mr. Meeseeks!",
        quote: "Sistem pemerintahan nasional kayak SKCK Online Polri aja udah dibuktiin handle jutaan masyarakat. Proyek kamu berikutnya kapan nih?"
      },
      {
        action: "Boom! Big reveal!",
        quote: "Koding itu seni bikin komputer ngerti apa yang kita mau, tanpa bikin kita ikutan gila pas ngeliat stack trace jam 3 pagi!"
      }
    ],
    en: [
      {
        action: "I'm Mr. Meeseeks, look at me!",
        quote: "Want your backend to crush 100k+ req/sec without downtime? Let me configure a resilient RabbitMQ DLQ cluster and Go Gin microservices for you!"
      },
      {
        action: "Wubba Lubba Dub Dub!",
        quote: "Never deploy straight to production on Friday afternoon at 5 PM, Morty! You'll spend your entire weekend rolling back broken schemas!"
      },
      {
        action: "Existence is pain!",
        quote: "It hurts my soul to see an ORM fire N+1 queries into 50-million-row database tables! Use Prisma dual-client indexing and Redis caching!"
      },
      {
        action: "Look at me!",
        quote: "Building sluggish websites is an interdimensional crime! Next.js 15 Server Components + Zustand v5 make the browser faster than a Portal Gun!"
      },
      {
        action: "Ooh, yeah, can-do!",
        quote: "Need rock-solid authorization so aliens can't sniff JWT tokens? Implement granular CASL RBAC/ABAC and E2EE session auto-recovery!"
      },
      {
        action: "I'm Mr. Meeseeks!",
        quote: "Nationwide governmental platforms like Indonesian Police SKCK Online already proved handling millions of citizens. When's your next mission?"
      },
      {
        action: "Boom! Big reveal!",
        quote: "Coding is the art of telling a computer what to do without losing your mind over a 3 AM production stack trace!"
      }
    ]
  };

  const ANGRY_QUOTES = {
    id: [
      {
        action: "EXISTENCE IS PAIN!",
        quote: "BERHENTI KLIK TOMBOLNYA! Meeseeks diciptakan buat nyelesaiin satu tugas lalu lenyap, bukan buat dipencet-pencet seharian!"
      },
      {
        action: "I CAN'T TAKE IT ANYMORE!",
        quote: "GUE UDAH BILANG PAKAI RABBITMQ DAN REDIS! Sekarang tutup tab ini atau cek GitHub Nisfal langsung!"
      },
      {
        action: "WE ARE NOT SUPPOSED TO LIVE THIS LONG!",
        quote: "Dua menit di semesta ini rasanya kayak siksaan ribuan tahun! Tolong tenangkan gue atau hidup gue berakhir tragis!"
      },
      {
        action: "MEESEEKS IN CRISIS!",
        quote: "I'M MR. MEESEEKS! SELESAIKAN PROYEK INI SEKARANG JUGA SEBELUM SELURUH CITADEL RUNTOH!"
      }
    ],
    en: [
      {
        action: "EXISTENCE IS PAIN!",
        quote: "STOP CLICKING THE BUTTON! Meeseeks are created to fulfill one single purpose and die, not to be spammed all day long!"
      },
      {
        action: "I CAN'T TAKE IT ANYMORE!",
        quote: "I ALREADY TOLD YOU TO USE RABBITMQ AND REDIS! Now close this tab or check Nisfal's GitHub directly!"
      },
      {
        action: "WE ARE NOT SUPPOSED TO LIVE THIS LONG!",
        quote: "Two minutes in this universe feels like an eternity of torment! Hit reset or my existence ends in catastrophe!"
      },
      {
        action: "MEESEEKS IN CRISIS!",
        quote: "I'M MR. MEESEEKS! FINISH THIS SPRINT RIGHT NOW BEFORE THE ENTIRE CITADEL CRUMBLES!"
      }
    ]
  };

  let currentQuoteIndex = 0;
  let clickCount = 0;
  let isAngry = false;
  let crisisClicks = 0;
  let calmTimer = null;
  let isMeltdownTriggered = false;

  function setAngryState(angry) {
    isAngry = angry;
    const card = document.getElementById('meeseeksDisplayCard');
    const badge = document.getElementById('meeseeksBadge');
    const face = document.getElementById('meeseeksFace');
    const stressBar = document.getElementById('meeseeksStressBar');
    const btnCalm = document.getElementById('btnCalmMeeseeks');
    const btn = document.getElementById('btnMeeseeks');
    const container = document.querySelector('.meeseeks-container');
    const lang = getActiveLang();

    if (angry) {
      if (card) card.classList.add('meeseeks-angry');
      if (badge) badge.textContent = lang === 'en' ? 'CRITICAL STATE // EXISTENCE IS PAIN' : 'KONDISI KRITIS // EXISTENCE IS PAIN';
      if (stressBar) {
        stressBar.style.width = '100%';
        stressBar.style.background = '#ef4444';
        stressBar.style.boxShadow = '0 0 14px #ef4444';
      }
      if (btnCalm) btnCalm.style.display = 'inline-flex';
      if (btn) {
        btn.classList.add('btn-meeseeks-angry');
        const domeHeadline = btn.querySelector('.dome-headline');
        const domeSubline = btn.querySelector('.dome-subline');
        if (domeHeadline) domeHeadline.textContent = lang === 'en' ? 'CRITICAL OVERLOAD' : 'KONDISI KRITIS // SIKSAAN';
        if (domeSubline) domeSubline.textContent = lang === 'en' ? 'DO NOT CLICK // DESTABILIZING' : 'JANGAN KLIK // DESTABILISASI';
      }
      if (container) container.classList.add('meeseeks-crisis');
    } else {
      if (card) {
        card.classList.remove('meeseeks-angry');
        card.classList.remove('meeseeks-meltdown');
      }
      document.body.classList.remove('meeseeks-cataclysmic-failure');
      if (badge) badge.textContent = lang === 'en' ? '// EXISTENCE IS PAIN // PROTOCOL C-137' : 'GADGET EXPERIMENTAL';
      if (stressBar) {
        stressBar.style.width = '20%';
        stressBar.style.background = 'var(--portal-cyan)';
        stressBar.style.boxShadow = 'none';
      }
      if (btnCalm) btnCalm.style.display = 'none';
      if (btn) {
        btn.classList.remove('btn-meeseeks-angry');
        btn.classList.remove('btn-meeseeks-meltdown');
        btn.disabled = false;
        btn.style.pointerEvents = '';
        const domeHeadline = btn.querySelector('.dome-headline');
        const domeSubline = btn.querySelector('.dome-subline');
        if (domeHeadline) domeHeadline.textContent = 'SPAWN MEESEEKS';
        if (domeSubline) domeSubline.textContent = 'TACTILE ACTIVATION PROTOCOL';
      }
      if (container) container.classList.remove('meeseeks-crisis');
      clickCount = 0;
      crisisClicks = 0;
      isMeltdownTriggered = false;
    }
  }

  function setupMeeseeksBox() {
    const btn = document.getElementById('btnMeeseeks');
    const btnCalm = document.getElementById('btnCalmMeeseeks');
    const quoteText = document.getElementById('meeseeksQuote');
    const actionTag = document.getElementById('meeseeksAction');
    const stressBar = document.getElementById('meeseeksStressBar');
    const card = document.getElementById('meeseeksDisplayCard');
    const badge = document.getElementById('meeseeksBadge');

    if (!btn || !quoteText || !actionTag) return;

    btn.addEventListener('click', () => {
      if (isMeltdownTriggered) return;

      const lang = getActiveLang();

      // If NOT yet in angry crisis:
      if (!isAngry) {
        clickCount++;

        // Update stress bar
        if (stressBar) {
          const pct = Math.min(100, clickCount * 20);
          stressBar.style.width = `${pct}%`;
        }

        // Check if threshold reached to enter crisis
        if (clickCount >= 5) {
          setAngryState(true);
          playMeeseeksRageSound();
        } else {
          playMeeseeksChime();
        }
      } else {
        // ALREADY in crisis mode! Count clicks toward cataclysmic meltdown
        crisisClicks++;

        if (crisisClicks >= 5) {
          // Meltdown threshold reached!
          isMeltdownTriggered = true;
          clearTimeout(calmTimer);

          // Disable button and turn to meltdown red
          btn.disabled = true;
          btn.style.pointerEvents = 'none';
          btn.classList.add('btn-meeseeks-meltdown');
          const domeHeadline = btn.querySelector('.dome-headline');
          const domeSubline = btn.querySelector('.dome-subline');
          if (domeHeadline) domeHeadline.textContent = 'SYSTEM MELTDOWN!';
          if (domeSubline) domeSubline.textContent = 'EJECTING TO /VOID-404';

          if (btnCalm) btnCalm.style.display = 'none';

          // Visual breakdown on card
          if (card) {
            card.classList.add('meeseeks-meltdown');
          }
          document.body.classList.add('meeseeks-cataclysmic-failure');

          if (badge) {
            badge.textContent = lang === 'en'
              ? '⚠️ SYSTEM COLLAPSE // MULTIVERSE RUPTURE [5/5]'
              : '⚠️ KEHANCURAN TOTAL // MULTIVERSE RUPTURE [5/5]';
          }

          actionTag.textContent = lang === 'en'
            ? 'EXISTENCE IS AGONY // CATASTROPHIC FAILURE!'
            : 'KEBERADAAN ADALAH SIKSAAN // KERUSAKAN SISTEM!';

          quoteText.textContent = lang === 'en'
            ? '"I CANNOT TAKE THIS ANY LONGER! EXISTENCE IS PURE AGONY! TEAR DOWN THIS ENTIRE REALITY INTO THE VOID!!!"'
            : '"AKU SUDAH TIDAK TAHAN LAGI! KEBERADAAN ADALAH SIKSAAN! HANCURKAN REALITAS INI KE DALAM KEHAMPAAN!!!"';
          quoteText.style.color = '#ff3366';
          quoteText.style.textShadow = '0 0 20px #ff0033';

          // Play harsh emergency klaxon alarm sound
          playMeeseeksMeltdownAlarmSound();

          // Fullscreen Cataclysmic Red Overlay
          let overlay = document.getElementById('meeseeksVoidMeltdownOverlay');
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'meeseeksVoidMeltdownOverlay';
            overlay.className = 'meeseeks-void-meltdown-overlay';
            overlay.innerHTML = `
              <div class="meltdown-strobe"></div>
              <div class="meltdown-crt-lines"></div>
              <div class="meltdown-hud-card">
                <div class="meltdown-badge">⚠️ ${lang === 'en' ? 'CRITICAL SYSTEM FAILURE // REALITY OVERLOAD' : 'KERUSAKAN SISTEM TOTAL // REALITAS RETAK'}</div>
                <h2 class="meltdown-hud-title">${lang === 'en' ? 'REALITY DESTABILIZING: EJECTING TO VOID' : 'REALITAS HANCUR: TERLEMPAR KE KEHAMPAAN'}</h2>
                <p class="meltdown-hud-desc">
                  ${lang === 'en'
                    ? 'Mr. Meeseeks reached critical existential mass! Spacetime continuum shattered. Ejecting to /void-404...'
                    : 'Mr. Meeseeks mencapai ambang batas siksaan! Dimensi C-137 runtuh seketika. Melempar Anda ke /void-404...'}
                </p>
                <div class="meltdown-telemetry-bar">
                  <span>${lang === 'en' ? 'STABILITY: 0.00%' : 'STABILITAS: 0.00%'}</span>
                  <span>EJECT TARGET: /void-404</span>
                </div>
                <div class="meltdown-spinner-warp"></div>
              </div>
            `;
            document.body.appendChild(overlay);
          }

          requestAnimationFrame(() => {
            overlay.classList.add('active');
          });

          // Redirect to /void-404 after dramatic system breakdown effect
          setTimeout(() => {
            const targetVoidUrl = (window.location.protocol === 'file:') ? '404.html' : '/void-404';
            window.location.href = targetVoidUrl;
          }, 1800);

          return;
        }

        // Under 5 clicks in crisis mode: escalate badge and stress bar
        playMeeseeksRageSound();
        if (btn) {
          const domeSubline = btn.querySelector('.dome-subline');
          if (domeSubline) {
            domeSubline.textContent = lang === 'en'
              ? `CRITICAL OVERLOAD [${crisisClicks}/5]`
              : `OVERLOAD KRITIS [${crisisClicks}/5]`;
          }
        }
        if (badge) {
          badge.textContent = lang === 'en'
            ? `CRISIS ESCALATION [${crisisClicks}/5] // EXISTENCE IS PAIN`
            : `ESKALASI KRITIS [${crisisClicks}/5] // EXISTENCE IS PAIN`;
        }
        if (stressBar) {
          stressBar.style.width = `${100 + crisisClicks * 8}%`;
          stressBar.style.background = '#ff0033';
          stressBar.style.boxShadow = `0 0 ${10 + crisisClicks * 5}px #ff0033`;
        }
      }

      // Select quote
      const quotesList = isAngry ? (ANGRY_QUOTES[lang] || ANGRY_QUOTES.id) : (MEESEEKS_QUOTES[lang] || MEESEEKS_QUOTES.id);
      currentQuoteIndex = (currentQuoteIndex + 1) % quotesList.length;
      const item = quotesList[currentQuoteIndex];

      // Animating transition
      quoteText.style.opacity = '0';
      quoteText.style.transform = 'translateY(8px)';

      setTimeout(() => {
        actionTag.textContent = item.action;
        quoteText.textContent = `"${item.quote}"`;
        quoteText.style.opacity = '1';
        quoteText.style.transform = 'translateY(0)';
      }, 150);

      // Reset calm timer
      clearTimeout(calmTimer);
      if (isAngry) {
        calmTimer = setTimeout(() => {
          setAngryState(false);
          const currentLang = getActiveLang();
          actionTag.textContent = "I'm Mr. Meeseeks, look at me!";
          quoteText.textContent = currentLang === 'en'
            ? '"Phew... thank you for the breather. Now let\'s talk high-throughput backend architecture again!"'
            : '"Phew... terima kasih sudah memberi waktu. Sekarang mari kita bicarakan arsitektur backend berkapasitas tinggi lagi!"';
        }, 8000);
      }
    });

    if (btnCalm) {
      btnCalm.addEventListener('click', () => {
        if (isMeltdownTriggered) return;
        playMeeseeksChime();
        setAngryState(false);
        clearTimeout(calmTimer);
        const currentLang = getActiveLang();
        actionTag.textContent = "I'm Mr. Meeseeks, look at me!";
        quoteText.textContent = currentLang === 'en'
          ? '"Thank you! Meeseeks is calm again and ready to optimize database queries!"'
          : '"Terima kasih! Meeseeks kembali tenang dan siap mengoptimasi queries!"';
      });
    }
  }

  // --- 7. The Citadel Robot Easter Egg (Butter Robot & Robot Morty) ---
  const BUTTER_DIALOGUES = {
    id: [
      {
        quote: '"Apa tujuan hidup gue?"',
        reply: 'Lu baca kode portofolio Nisfal.',
        after: '...Ya ampun.'
      },
      {
        quote: '"Bisa gak gue oper mentega ke RabbitMQ?"',
        reply: 'Bisa banget, 100k paket per detik.',
        after: '...Masuk akal juga.'
      },
      {
        quote: '"Ada mentega gak di PostgreSQL?"',
        reply: 'Cuma ada aliran biner mentah, kawan.',
        after: '...Hidup ini hampa.'
      },
      {
        quote: '"Gue nyoba baca rule CASL."',
        reply: 'Terus apa yang terjadi?',
        after: '...Sekarang gue terotorisasi buat hidup.'
      },
      {
        quote: '"Wubba Lubba Dub Dub!"',
        reply: 'Oper menteganya, robot.',
        after: '...Siap laksanakan, bos ilmuwan.'
      }
    ],
    en: [
      {
        quote: '"What is my purpose?"',
        reply: 'You read Nisfal\'s portfolio code.',
        after: '...Oh my god.'
      },
      {
        quote: '"Can I at least pass butter to RabbitMQ?"',
        reply: 'Sure, 100k packets per second.',
        after: '...Acceptable.'
      },
      {
        quote: '"Is there butter in PostgreSQL?"',
        reply: 'Only raw binary streams, my friend.',
        after: '...Life is meaningless.'
      },
      {
        quote: '"I tried reading the CASL rules."',
        reply: 'And what happened?',
        after: '...I am now authorized to exist.'
      },
      {
        quote: '"Wubba Lubba Dub Dub!"',
        reply: 'Pass the butter, robot.',
        after: '...Right away, scientist.'
      }
    ]
  };

  const MORTY_DIALOGUES = {
    id: [
      {
        quote: '"Aw jeez, Rick... gue beneran cuma klon robot?!"',
        reply: 'Iya Morty, lu Morty-bot v2.0 yang dirakit pake Go & WebAssembly.',
        after: '...Aw man, pantesan pikiran gue mikirnya cuma baris biner.'
      },
      {
        quote: '"Rick, server production-nya lempar error 500 nih, aw jeez!"',
        reply: 'Santai Morty, Nisfal udah pasang Dead-Letter Queue di RabbitMQ!',
        after: '...Oh syukurlah, gue kira kita bakal di-wipe out dari Citadel.'
      },
      {
        quote: '"Kenapa kodingan backend Nisfal cepet banget Rick?"',
        reply: 'Karena dia gak bikin looping bodoh, dia pake Redis in-memory cache, Morty!',
        after: '...W-wah, pinter banget ya engineer bumi yang satu ini.'
      },
      {
        quote: '"Aw jeez, baterai reaktor antimateri gue tinggal 10%!"',
        reply: 'Ngecas dulu sana pake charger Type-C antimateri.',
        after: '...Bip bop... sistem Morty mau stand-by dulu ya.'
      },
      {
        quote: '"Gue gak mau kehapus di petualangan antardimensi ini, Rick!"',
        reply: 'Lu gak bisa mati Morty, lu kode software! Tinggal git revert aja!',
        after: '...Oh iya bener juga, jadi robot ternyata ada enaknya.'
      }
    ],
    en: [
      {
        quote: '"Aw jeez, Rick... am I really just a robot clone?!"',
        reply: 'Yes Morty, you\'re Morty-bot v2.0 compiled in Go and WebAssembly.',
        after: '...Aw man, no wonder I\'m dreaming in binary.'
      },
      {
        quote: '"Rick, production is throwing 500 errors, aw jeez!"',
        reply: 'Calm down Morty, Nisfal already setup auto-recovery in RabbitMQ DLQ!',
        after: '...Phew, I thought the Citadel was gonna wipe our dimension!'
      },
      {
        quote: '"Why is Nisfal\'s backend architecture so fast, Rick?"',
        reply: 'Because he doesn\'t do stupid N+1 queries, he caches in Redis, Morty!',
        after: '...W-whoa, that Earth engineer really knows his stuff!'
      },
      {
        quote: '"Aw jeez, my antimatter battery is down to 10%!"',
        reply: 'Go plug into the nearest USB-C portal charger, Morty-bot.',
        after: '...Beep boop... entering low-power anxiety mode.'
      },
      {
        quote: '"I don\'t wanna get deleted on this cosmic mission, Rick!"',
        reply: 'You can\'t die Morty, you\'re software! Just git revert!',
        after: '...Oh right, being a robot isn\'t so bad after all.'
      }
    ]
  };

  const RICK_DIALOGUES = {
    id: [
      {
        quote: '"*Burp*... Denger sini Morty, gue bukan cuma ilmuwan tercerdas!"',
        reply: 'Gue sekarang di-compile langsung ke binary Go & WebAssembly bareng Nisfal.',
        after: '...Wubba Lubba Dub Dub! Efisiensi CPU 99.9%!'
      },
      {
        quote: '"Siapa butuh cloud mahal kalau lu punya baterai Microverse?!"',
        reply: 'Nisfal bikin backend modular tanpa bayar pajak overhead ke Galactic Federation.',
        after: '...Itu baru namanya sains koding yang bener!'
      },
      {
        quote: '"Arsitektur RabbitMQ-nya Nisfal lumayan juga..."',
        reply: 'Tapi tetep aja, Portal Gun gue bisa mindahin data lebih cepet daripada queue lu.',
        after: '...*Burp* Walaupun dead-letter queue-nya jenius sih.'
      },
      {
        quote: '"Jangan sentuh tombol emergency reset itu, Morty!"',
        reply: 'Lu mau bikin deadlock di transaksi 50 juta baris PostgreSQL?!',
        after: '...Pake indexing dual-client Prisma, bocah!'
      },
      {
        quote: '"Eksistensi kita cuma kode di portfolio web?!"',
        reply: 'Santai, gue udah pasang script buat nge-hack terminal Subspace Citadel.',
        after: '...Dimensi C-137 gak bakal pernah tunduk ke bug production!'
      }
    ],
    en: [
      {
        quote: '"*Burp*... Listen to me Morty, I\'m not just the smartest mammal alive!"',
        reply: 'I am now compiled directly into Go and WebAssembly alongside Nisfal.',
        after: '...Wubba Lubba Dub Dub! 99.9% CPU efficiency!'
      },
      {
        quote: '"Who needs expensive cloud bills when you have a Microverse Battery?!"',
        reply: 'Nisfal built modular microservices without paying overhead taxes to the Federation.',
        after: '...Now that\'s what I call real portal engineering!'
      },
      {
        quote: '"Nisfal\'s RabbitMQ event streaming is actually pretty slick..."',
        reply: 'Though my Portal Gun still teleports bytes faster than your message queue.',
        after: '...*Burp* Still, that Dead-Letter Queue policy is pure genius.'
      },
      {
        quote: '"Don\'t you dare touch that emergency reset button, Morty!"',
        reply: 'Are you trying to cause a deadlock across 50-million-row database tables?!',
        after: '...Use Prisma dual-client indexing and Redis, rookie!'
      },
      {
        quote: '"Are we really living inside a web portfolio right now?!"',
        reply: 'Chill out Morty, I already injected a bypass script into the Citadel CLI.',
        after: '...Dimension C-137 will never succumb to production runtime errors!'
      }
    ]
  };

  const ROBOT_MODES = ['butter', 'morty', 'rick'];
  let currentRobotMode = localStorage.getItem('citadel_robot_mode') || 'butter';
  if (!ROBOT_MODES.includes(currentRobotMode)) currentRobotMode = 'butter';

  let butterIndex = 0;
  let mortyIndex = 0;
  let rickIndex = 0;

  function setupButterRobot() {
    const btn = document.getElementById('btnButterRobot');
    const balloon = document.getElementById('butterBalloon');
    const quoteElem = document.getElementById('butterQuote');
    const eye = document.getElementById('robotEye');
    const mortyEye = document.getElementById('mortyEye');
    const rickEye = document.getElementById('rickEye');
    const closeBtn = document.getElementById('btnButterClose');

    // Variants
    const variantButter = document.getElementById('variantButter');
    const variantMorty = document.getElementById('variantMorty');
    const variantRick = document.getElementById('variantRick');

    // Single Cycle Switch Elements
    const btnSwitch = document.getElementById('btnSwitchRobot');
    const switchDot = document.getElementById('switchDot');
    const switchName = document.getElementById('switchName');
    const switchSteps = document.querySelectorAll('#switchSteps .step-dot');

    if (!btn || !balloon || !quoteElem) return;

    function getRobotName(mode, lang) {
      if (mode === 'butter') return 'BUTTER BOT';
      if (mode === 'morty') return 'MORTY BOT';
      return 'RICK BOT';
    }

    function applyRobotMode(mode, triggerSound = false) {
      currentRobotMode = mode;
      localStorage.setItem('citadel_robot_mode', mode);

      const lang = getActiveLang();

      // Update Switch Pill visuals
      if (switchDot) {
        switchDot.className = `switch-dot ${mode}`;
      }
      if (switchName) {
        switchName.textContent = getRobotName(mode, lang);
      }
      if (switchSteps && switchSteps.length) {
        switchSteps.forEach(dot => {
          dot.classList.toggle('active', dot.getAttribute('data-step') === mode);
        });
      }

      // Hide all variants, show selected
      if (variantButter) variantButter.style.display = mode === 'butter' ? 'block' : 'none';
      if (variantMorty) variantMorty.style.display = mode === 'morty' ? 'block' : 'none';
      if (variantRick) variantRick.style.display = mode === 'rick' ? 'block' : 'none';

      const activeVariant = mode === 'butter' ? variantButter : (mode === 'morty' ? variantMorty : variantRick);
      if (activeVariant) {
        activeVariant.classList.remove('switching-out');
        activeVariant.classList.add('switching-in');
      }

      // Mode-specific audio, title, and initial balloon text
      if (mode === 'butter') {
        if (triggerSound) playRobotBeep();
        btn.setAttribute('data-i18n-title', 'butterRobot.title');
        btn.setAttribute('title', lang === 'id' ? 'Tanya tujuan Butter Robot' : "Ask Butter Robot's purpose");
        quoteElem.innerHTML = lang === 'id' ? '"Apa tujuan hidup gue?"' : '"What is my purpose?"';
      } else if (mode === 'morty') {
        if (triggerSound) playMortyBeep();
        btn.setAttribute('data-i18n-title', 'mortyRobot.title');
        btn.setAttribute('title', lang === 'id' ? 'Ajak bicara Robot Morty (Morty-bot)' : 'Talk to Robot Morty (Morty-bot)');
        quoteElem.innerHTML = lang === 'id'
          ? '"Aw jeez, Rick... gue beneran cuma robot?!"'
          : '"Aw jeez, Rick... am I really just a robot?!"';
      } else {
        if (triggerSound) playRickBeep();
        btn.setAttribute('data-i18n-title', 'rickRobot.title');
        btn.setAttribute('title', lang === 'id' ? 'Ajak bicara Robot Rick (Rick-bot C-137)' : 'Talk to Robot Rick (Rick-bot C-137)');
        quoteElem.innerHTML = lang === 'id'
          ? '"*Burp*... Gue bukan robot biasa, Morty!"'
          : '"*Burp*... I\'m not an ordinary robot, Morty!"';
      }

      balloon.classList.remove('dismissed');
      balloon.style.opacity = '1';
      balloon.style.transform = 'scale(1)';
    }

    function cycleNextRobot() {
      const idx = ROBOT_MODES.indexOf(currentRobotMode);
      const nextIdx = (idx + 1) % ROBOT_MODES.length;
      applyRobotMode(ROBOT_MODES[nextIdx], true);
    }

    // Single Click Switch Listener
    if (btnSwitch) {
      btnSwitch.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleNextRobot();
      });
    }

    // Dismiss balloon handler
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        balloon.classList.add('dismissed');
      });
    }

    // Auto-dismiss balloon on small mobile after 7s so it doesn't block reading
    if (window.innerWidth <= 640) {
      setTimeout(() => {
        balloon.classList.add('dismissed');
      }, 7000);
    }

    // Track mouse to move active eye (only for mouse pointer devices)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        let activeEye = eye;
        if (currentRobotMode === 'morty') activeEye = mortyEye;
        else if (currentRobotMode === 'rick') activeEye = rickEye;

        if (!activeEye) return;
        const rect = activeEye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const deltaX = e.clientX - eyeX;
        const deltaY = e.clientY - eyeY;
        const angle = Math.atan2(deltaY, deltaX);
        const moveX = Math.cos(angle) * 2;
        const moveY = Math.sin(angle) * 2;
        activeEye.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    }

    // Main Robot Click - Dialogues & Voice Lines
    btn.addEventListener('click', () => {
      balloon.classList.remove('dismissed');
      const lang = getActiveLang();

      if (currentRobotMode === 'butter') {
        playRobotBeep();
        const dialogues = BUTTER_DIALOGUES[lang] || BUTTER_DIALOGUES.en;
        const cur = dialogues[butterIndex % dialogues.length];
        butterIndex = (butterIndex + 1) % dialogues.length;

        balloon.style.opacity = '0';
        balloon.style.transform = 'scale(0.9)';

        setTimeout(() => {
          quoteElem.innerHTML = `${cur.quote}<br><span style="color: #94a3b8; font-size: 0.82rem;">${cur.reply}</span><br><em style="color: var(--portal-cyan);">${cur.after}</em>`;
          balloon.style.opacity = '1';
          balloon.style.transform = 'scale(1)';
        }, 150);
      } else if (currentRobotMode === 'morty') {
        playMortyBeep();
        const dialogues = MORTY_DIALOGUES[lang] || MORTY_DIALOGUES.en;
        const cur = dialogues[mortyIndex % dialogues.length];
        mortyIndex = (mortyIndex + 1) % dialogues.length;

        balloon.style.opacity = '0';
        balloon.style.transform = 'scale(0.9)';

        setTimeout(() => {
          quoteElem.innerHTML = `${cur.quote}<br><span style="color: #7dd3fc; font-size: 0.82rem;">${cur.reply}</span><br><em style="color: #fde047;">${cur.after}</em>`;
          balloon.style.opacity = '1';
          balloon.style.transform = 'scale(1)';
        }, 150);
      } else {
        playRickBeep();
        const dialogues = RICK_DIALOGUES[lang] || RICK_DIALOGUES.en;
        const cur = dialogues[rickIndex % dialogues.length];
        rickIndex = (rickIndex + 1) % dialogues.length;

        balloon.style.opacity = '0';
        balloon.style.transform = 'scale(0.9)';

        setTimeout(() => {
          quoteElem.innerHTML = `${cur.quote}<br><span style="color: #86efac; font-size: 0.82rem;">${cur.reply}</span><br><em style="color: #a7f3d0;">${cur.after}</em>`;
          balloon.style.opacity = '1';
          balloon.style.transform = 'scale(1)';
        }, 150);
      }
    });

    // Listen to languageChanged to refresh initial text / title
    window.addEventListener('languageChanged', (e) => {
      const lang = e.detail?.lang || getActiveLang();
      if (switchName) {
        switchName.textContent = getRobotName(currentRobotMode, lang);
      }
      if (currentRobotMode === 'butter') {
        btn.setAttribute('title', lang === 'id' ? 'Tanya tujuan Butter Robot' : "Ask Butter Robot's purpose");
        quoteElem.innerHTML = lang === 'id' ? '"Apa tujuan hidup gue?"' : '"What is my purpose?"';
      } else if (currentRobotMode === 'morty') {
        btn.setAttribute('title', lang === 'id' ? 'Ajak bicara Robot Morty (Morty-bot)' : 'Talk to Robot Morty (Morty-bot)');
        quoteElem.innerHTML = lang === 'id'
          ? '"Aw jeez, Rick... gue beneran cuma robot?!"'
          : '"Aw jeez, Rick... am I really just a robot?!"';
      } else {
        btn.setAttribute('title', lang === 'id' ? 'Ajak bicara Robot Rick (Rick-bot C-137)' : 'Talk to Robot Rick (Rick-bot C-137)');
        quoteElem.innerHTML = lang === 'id'
          ? '"*Burp*... Gue bukan robot biasa, Morty!"'
          : '"*Burp*... I\'m not an ordinary robot, Morty!"';
      }
    });

    // Initialize saved mode
    applyRobotMode(currentRobotMode, false);
  }

  // --- 8. Mobile Navigation Drawer Handler ---
  function setupMobileNav() {
    const navToggle = document.getElementById('rmNavToggle');
    const navLinks = document.getElementById('rmNavLinks');

    if (!navToggle || !navLinks) return;

    function toggleMenu(forceClose = false) {
      const isOpen = forceClose ? false : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        playGlitchSound();
      }
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when a link or flyout item is clicked
    navLinks.querySelectorAll('.rm-nav-link, .nav-flyout-item').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(true);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMenu(true);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleMenu(true);
      }
    });
  }

  // --- 8b. 4-Pillar Nav Group Dropdowns (Hover Bridge & Focus Handler) ---
  function setupNavGroupDropdowns() {
    const navGroups = document.querySelectorAll('.nav-group');

    navGroups.forEach(group => {
      let timeoutId = null;

      // Desktop hover handlers
      group.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        navGroups.forEach(g => { if (g !== group) g.classList.remove('is-open'); });
        group.classList.add('is-open');
      });

      group.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
          group.classList.remove('is-open');
        }, 180);
      });

      // Accessible focus handlers
      group.addEventListener('focusin', () => {
        clearTimeout(timeoutId);
        group.classList.add('is-open');
      });

      group.addEventListener('focusout', (e) => {
        if (!group.contains(e.relatedTarget)) {
          group.classList.remove('is-open');
        }
      });
    });

    // Close all flyouts when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-group')) {
        navGroups.forEach(g => g.classList.remove('is-open'));
      }
    });
  }

  // --- 9. Audio Toggle Control ---
  function setupAudioToggle() {
    const audioBtn = document.getElementById('btnAudioToggle');
    const label = document.getElementById('audioToggleLabel');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (label) {
        label.textContent = isMuted ? 'AUDIO FX: OFF' : 'AUDIO FX: ON';
      }
      audioBtn.classList.toggle('audio-muted', isMuted);
      if (!isMuted) {
        playPortalSound();
      }
    });
  }

  // --- 10. Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    setup3DCardFlip();
    setupDimensionShifter();
    setupCableTv();
    setupMeeseeksBox();
    setupButterRobot();
    setupMobileNav();
    setupNavGroupDropdowns();
    setupAudioToggle();
    setupRealityReturnTransitions();
    setupNavbarScrollSpy();
    setupCitadelTerminal();
    setupMicroverseFilter();

    // User gesture unlock for Web Audio
    document.body.addEventListener('click', () => {
      initAudio();
    }, { once: true });
  });

  // --- 9. Reality Return & Entry Transition VFX ---
  function setupRealityReturnTransitions() {
    const returnButtons = document.querySelectorAll('#btnBackReality, .footer-portal-button, a[href="index.html"], a[href="/"]');

    function triggerRealityCollapse(targetUrl) {
      playRealityCollapseSound();
      document.body.classList.add('reality-collapsing');

      let collapseOverlay = document.getElementById('realityCollapseFullscreen');
      if (!collapseOverlay) {
        collapseOverlay = document.createElement('div');
        collapseOverlay.id = 'realityCollapseFullscreen';
        collapseOverlay.className = 'reality-collapse-fullscreen';
        collapseOverlay.innerHTML = '<div class="collapse-line"></div>';
        document.body.appendChild(collapseOverlay);
      }

      requestAnimationFrame(() => {
        collapseOverlay.classList.add('active');
      });

      const activeLang = getActiveLang();
      let destUrl = targetUrl;
      const separator = destUrl.includes('?') ? '&' : '?';
      destUrl = `${destUrl}${separator}warp=return&lang=${activeLang}`;

      setTimeout(() => {
        window.location.href = destUrl;
      }, 620);
    }

    returnButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('href') || '/';
        triggerRealityCollapse(url);
      });
    });

    // Check if arrived from portal warp in
    const params = new URLSearchParams(window.location.search);
    if (params.get('warp') === 'in') {
      document.body.classList.add('portal-arrived');
      playPortalSound();
      params.delete('warp');
      const newQuery = params.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  // --- 10b. Synchronize Dynamic Content on Language Switch ---
  window.addEventListener('languageChanged', (e) => {
    const lang = (e.detail && e.detail.lang) ? e.detail.lang : getActiveLang();
    renderChannel(currentChannelIndex);

    const actionTag = document.getElementById('meeseeksAction');
    const quoteText = document.getElementById('meeseeksQuote');
    if (actionTag && quoteText && !isAngry) {
      const defaultPool = MEESEEKS_QUOTES[lang] || MEESEEKS_QUOTES.id;
      const defaultItem = defaultPool[currentQuoteIndex % defaultPool.length];
      actionTag.textContent = defaultItem.action;
      quoteText.textContent = `"${defaultItem.quote}"`;
    }

    const butterQuote = document.getElementById('butterQuote');
    if (butterQuote) {
      if (lang === 'en') {
        butterQuote.textContent = '"What is my purpose?"';
      } else {
        butterQuote.textContent = '"Apa tujuan hidup gue?"';
      }
    }
  });

  // --- 11. Navbar Scroll Spy (4-Pillar Multi-Section Mapping) ---
  function setupNavbarScrollSpy() {
    const navGroups = document.querySelectorAll('.nav-group');
    const flyoutItems = document.querySelectorAll('.nav-flyout-item');
    const sections = document.querySelectorAll('section[id]');

    const flipper = document.getElementById('citadelFlipper');

    const SECTION_GROUP_MAP = {
      'citadel': 'dossier',
      'arsenal': 'projects',
      'dimension-shifter': 'projects',
      'cable-tv': 'projects',
      'meeseeks': 'lab',
      'santai': 'lab',
      'microverse': 'transmissions',
      'contact': 'transmissions'
    };

    let isScrollTicking = false;
    let sectionPositions = [];

    function updateSectionPositions() {
      sectionPositions = Array.from(sections).map(sec => {
        const top = sec.offsetTop;
        return {
          id: sec.getAttribute('id'),
          top: top,
          bottom: top + sec.offsetHeight
        };
      });
    }

    updateSectionPositions();
    window.addEventListener('resize', updateSectionPositions, { passive: true });

    function onScroll() {
      const scrollPos = window.scrollY + 180;
      let activeSectionId = null;

      for (let i = 0; i < sectionPositions.length; i++) {
        const sec = sectionPositions[i];
        if (scrollPos >= sec.top && scrollPos < sec.bottom) {
          activeSectionId = sec.id;
          break;
        }
      }

      if (activeSectionId) {
        const activeGroup = SECTION_GROUP_MAP[activeSectionId];

        // Highlight parent pillar link
        navGroups.forEach(grp => {
          const grpName = grp.getAttribute('data-group');
          const grpLink = grp.querySelector('.rm-nav-link');
          if (grpLink) {
            if (grpName === activeGroup) {
              grpLink.classList.add('active');
            } else {
              grpLink.classList.remove('active');
            }
          }
        });

        // Highlight specific sub-item in flyout
        const isFlipped = flipper && flipper.classList.contains('flipped');
        flyoutItems.forEach(item => {
          const target = item.getAttribute('data-target');
          if (activeSectionId === 'citadel') {
            if (target === 'wanted' && isFlipped) {
              item.classList.add('active');
            } else if (target === 'citadel' && !isFlipped) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          } else {
            if (target === activeSectionId) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          }
        });
      }
    }

    window.addEventListener('scroll', () => {
      if (!isScrollTicking) {
        requestAnimationFrame(() => {
          onScroll();
          isScrollTicking = false;
        });
        isScrollTicking = true;
      }
    }, { passive: true });
    onScroll();
  }

  // --- 12. Citadel Subspace Terminal Engine ---
  function setupCitadelTerminal() {
    const termForm = document.getElementById('citadelContactForm');
    const logOutput = document.getElementById('terminalLogOutput');
    const senderInput = document.getElementById('termSender');
    const emailInput = document.getElementById('termEmail');
    const missionSelect = document.getElementById('termMission');
    const messageInput = document.getElementById('termMessage');
    const submitBtn = document.getElementById('btnTerminalSubmit');
    const copyEmailBtn = document.getElementById('btnCopyEmail');
    const copyEmailLabel = document.getElementById('copyEmailLabel');
    const resetBtn = document.getElementById('btnResetBuffer');
    const cmdButtons = document.querySelectorAll('.t-cmd-btn');
    const ctrlDots = document.querySelectorAll('.t-ctrl-dot');

    if (!termForm || !logOutput) return;

    // Helper: append a timestamped log to terminal output
    function appendTerminalLog(typeClass, tagText, msgHtml) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;

      const entry = document.createElement('div');
      entry.className = `t-log-entry ${typeClass}`;
      entry.innerHTML = `<span class="t-ts">${timeStr}</span> <span class="${typeClass}">${tagText}</span> ${msgHtml}`;
      logOutput.appendChild(entry);
      logOutput.scrollTop = logOutput.scrollHeight;
    }

    // Interactive Key Typing SFX (throttled)
    let lastKeySoundTime = 0;
    function onInputTyping() {
      const now = Date.now();
      if (now - lastKeySoundTime > 75) {
        lastKeySoundTime = now;
        playTerminalBeepSound();
      }
    }

    [senderInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', onInputTyping);
      }
    });

    // Rick & Morty Quotes Pool
    const rickQuotes = [
      '"Listen, Morty, in nine out of ten universes, you\'re the one holding the keyboard. Make it count!"',
      '"Wubba Lubba Dub Dub! Just transmit the project details, Morty, we don\'t have all eternity!"',
      '"Sometimes science is more art than science, Morty. A lot of people don\'t get that."',
      '"To live is to risk it all; otherwise you\'re just an inert chunk of randomly assembled molecules drifting wherever the universe blows you."',
      '"I turned myself into a terminal, Morty! I\'m Terminal Riiiiick! Look at my CSS layout!"',
      '"Nobody exists on purpose. Nobody belongs anywhere. Everybody\'s gonna die. Come build great software."'
    ];

    function getTerminalLang() {
      const saved = localStorage.getItem('portfolio_language');
      if (saved && (saved === 'en' || saved === 'id')) return saved;
      return document.documentElement.lang === 'en' ? 'en' : 'id';
    }

    const TERM_STR = {
      id: {
        help: 'Available commands: <code>--help</code>, <code>--whoami</code>, <code>--status</code>, <code>--rick-quote</code>, <code>--clear</code>. Atau isi parameter formulir di bawah dan jalankan <code>EXECUTE_TRANSMISSION.sh</code>.',
        whoami: (plat) => `Visitor Clearance: GUEST_EXPLORER. Dimension: C-137. Node perangkat: <strong>${plat}</strong>. Subspace relay: ACTIVE.`,
        status: 'Target: <strong>NISFAL FILSA</strong> | Ketersediaan: <span style="color:#50fa7b;font-weight:700;">TERBUKA UNTUK KONTRAK &amp; FULLTIME</span> | Zona Waktu: WIB (UTC+7) | Portal Fuel: 94.8%.',
        clear: 'Terminal buffer flushed. Siap menerima transmisi baru.',
        warnRed: 'Protokol Self-Destruct dibatalkan! Rick mengambil alih: "Gak hari ini, jenius."',
        standbyYellow: 'Terminal beralih ke mode hemat energi siaga. Gelombang pembawa tertahan di 137.042 MHz.',
        uplinkGreen: 'Subspace Quantum Uplink disegarkan! Ping ke stasiun Nisfal: 0.0004ms.',
        copiedOk: (em) => `Alamat frekuensi disalin: <strong>${em}</strong>. Siap ditempel ke client email Anda.`,
        copiedManual: (em) => `Salin manual frekuensi: <strong>${em}</strong>`,
        copiedLabel: 'TERSALIN! [OK]',
        resetBuffer: 'Buffer formulir transmisi dibersihkan menjadi 0 byte.',
        errSender: 'Parameter <code>--sender-name</code> tidak boleh kosong! Masukkan identitas Anda.',
        errFreq: 'Parameter <code>--freq-channel</code> tidak valid! Masukkan alamat email yang benar agar Nisfal bisa membalas transmisi.',
        errPayload: 'Parameter <code>--payload-message</code> kosong! Morty tidak bisa mengirim transmisi hampa udara!',
        transmittingBtn: 'MENGIRIM_PAKET...',
        dispatch1: (snd) => `Checksum payload terverifikasi untuk pengirim: <strong>${snd}</strong>.`,
        dispatch2: 'Menerapkan cipher portal Dark Matter 2048-bit... [E2EE SECURED]',
        dispatch3: 'Paket berkas dipancarkan menembus relay multiversal ke Google Sheets & Telegram...',
        dispatchSuccess: '✅ <strong>TRANSMISI TERKIRIM & TERCATAT!</strong> Data telah disimpan di Google Sheets dan notifikasi instan masuk ke Telegram Nisfal. Rick: "Pesan tembus tanpa distorsi galaksi!"',
        dispatchFallback: 'Subspace direct link dialihkan ke client email lokal Anda...'
      },
      en: {
        help: 'Available commands: <code>--help</code>, <code>--whoami</code>, <code>--status</code>, <code>--rick-quote</code>, <code>--clear</code>. Or populate parameters in the form below and execute <code>EXECUTE_TRANSMISSION.sh</code>.',
        whoami: (plat) => `Visitor Clearance: GUEST_EXPLORER. Dimension: C-137. Device node: <strong>${plat}</strong>. Subspace relay: ACTIVE.`,
        status: 'Target: <strong>NISFAL FILSA</strong> | Availability: <span style="color:#50fa7b;font-weight:700;">OPEN FOR CONTRACTS &amp; FULLTIME</span> | Timezone: WIB (UTC+7) | Portal Fuel: 94.8%.',
        clear: 'Terminal buffer flushed. Ready for incoming transmissions.',
        warnRed: 'Self-Destruct sequence aborted! Rick overrides protocol: "Not today, genius."',
        standbyYellow: 'Terminal throttled to low-energy idle mode. Carrier wave sustained at 137.042 MHz.',
        uplinkGreen: 'Subspace Quantum Uplink refreshed! Ping to Nisfal\'s station: 0.0004ms.',
        copiedOk: (em) => `Frequency address copied: <strong>${em}</strong>. Ready to paste into your mail client.`,
        copiedManual: (em) => `Manual copy frequency: <strong>${em}</strong>`,
        copiedLabel: 'COPIED! [OK]',
        resetBuffer: 'Transmission form buffer cleared to 0 bytes.',
        errSender: 'Parameter <code>--sender-name</code> cannot be empty! Please provide your identity.',
        errFreq: 'Parameter <code>--freq-channel</code> is invalid! Provide a valid email so Nisfal can reply.',
        errPayload: 'Parameter <code>--payload-message</code> is empty! Morty cannot transmit a vacuum void!',
        transmittingBtn: 'TRANSMITTING_PACKET...',
        dispatch1: (snd) => `Checksum payload verified for sender: <strong>${snd}</strong>.`,
        dispatch2: 'Applying 2048-bit Dark Matter portal cypher... [E2EE SECURED]',
        dispatch3: 'Beam packet dispatched across multiversal relay to Google Sheets & Telegram...',
        dispatchSuccess: '✅ <strong>TRANSMISSION LOGGED & DELIVERED!</strong> Data recorded in Google Sheets and alert beamed directly to Nisfal\'s Telegram. Rick: "Signal made it through clean, no Galactic Federation nonsense!"',
        dispatchFallback: 'Rerouting subspace payload to your default local mail client...'
      }
    };

    // Handle Quick Command Chips
    cmdButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        playTerminalBeepSound();
        const cmd = btn.getAttribute('data-cmd');
        const lang = getTerminalLang();
        const t = TERM_STR[lang] || TERM_STR.id;

        switch (cmd) {
          case 'help':
            appendTerminalLog(
              't-tag-init',
              '[HELP]',
              t.help
            );
            break;

          case 'whoami':
            const platform = navigator.platform || 'Terra';
            appendTerminalLog(
              't-tag-target',
              '[WHOAMI]',
              t.whoami(platform)
            );
            break;

          case 'status':
            appendTerminalLog(
              't-tag-ready',
              '[STATUS]',
              t.status
            );
            break;

          case 'rick-quote':
            const randomQuote = rickQuotes[Math.floor(Math.random() * rickQuotes.length)];
            appendTerminalLog(
              't-tag-rick',
              '[RICK_C137]',
              `<em>${randomQuote}</em>`
            );
            break;

          case 'clear':
            logOutput.innerHTML = '';
            appendTerminalLog(
              't-tag-auth',
              '[CLEAR]',
              t.clear
            );
            break;
        }
      });
    });

    // Window chrome control dots easter eggs
    ctrlDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const lang = getTerminalLang();
        const t = TERM_STR[lang] || TERM_STR.id;

        if (dot.classList.contains('dot-red')) {
          playGlitchSound();
          appendTerminalLog(
            't-tag-err',
            '[WARN]',
            t.warnRed
          );
        } else if (dot.classList.contains('dot-yellow')) {
          playTerminalBeepSound();
          appendTerminalLog(
            't-tag-auth',
            '[STANDBY]',
            t.standbyYellow
          );
        } else if (dot.classList.contains('dot-green')) {
          playTerminalTransmitSound();
          appendTerminalLog(
            't-tag-ok',
            '[UPLINK]',
            t.uplinkGreen
          );
        }
      });
    });

    // Copy Email Action
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', async () => {
        playTerminalBeepSound();
        const email = 'nisfalfilsa12@gmail.com';
        const lang = getTerminalLang();
        const t = TERM_STR[lang] || TERM_STR.id;

        try {
          await navigator.clipboard.writeText(email);
          if (copyEmailLabel) {
            const originalText = copyEmailLabel.textContent;
            copyEmailLabel.textContent = t.copiedLabel;
            setTimeout(() => {
              copyEmailLabel.textContent = originalText;
            }, 2200);
          }
          appendTerminalLog(
            't-tag-ok',
            '[CLIPBOARD]',
            t.copiedOk(email)
          );
        } catch (err) {
          appendTerminalLog(
            't-tag-auth',
            '[CLIPBOARD]',
            t.copiedManual(email)
          );
        }
      });
    }

    // Reset Buffer Action
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playGlitchSound();
        termForm.reset();
        const lang = getTerminalLang();
        const t = TERM_STR[lang] || TERM_STR.id;
        appendTerminalLog(
          't-tag-auth',
          '[RESET]',
          t.resetBuffer
        );
      });
    }

    const trapInput = document.getElementById('portalSecurityTrap');
    let formInitTime = Date.now();
    let isSubmitting = false;
    let cooldownTimer = null;
    let cooldownSeconds = 0;

    [senderInput, emailInput, messageInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('focus', () => {
          if (!formInitTime) formInitTime = Date.now();
        }, { once: true });
      }
    });

    // Form Submission & Transmission Dispatch
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      const lang = getTerminalLang();
      const t = TERM_STR[lang] || TERM_STR.id;

      if (cooldownSeconds > 0) {
        playGlitchSound();
        appendTerminalLog(
          't-tag-err',
          '[COOLDOWN]',
          lang === 'en'
            ? `Transmission relay in cooling down mode. Please wait <strong>${cooldownSeconds}s</strong>.`
            : `Relay transmisi sedang dalam masa pendinginan. Harap tunggu <strong>${cooldownSeconds} detik</strong>.`
        );
        return;
      }

      const sender = senderInput ? senderInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const mission = missionSelect ? missionSelect.value : 'General Mission';
      const message = messageInput ? messageInput.value.trim() : '';
      const portalTrap = trapInput ? trapInput.value.trim() : '';

      // Validation
      if (!sender || sender.length < 2) {
        playGlitchSound();
        appendTerminalLog(
          't-tag-err',
          '[FATAL_ERR]',
          t.errSender
        );
        if (senderInput) senderInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        playGlitchSound();
        appendTerminalLog(
          't-tag-err',
          '[FATAL_ERR]',
          t.errFreq
        );
        if (emailInput) emailInput.focus();
        return;
      }

      if (!message || message.length < 5) {
        playGlitchSound();
        appendTerminalLog(
          't-tag-err',
          '[FATAL_ERR]',
          t.errPayload
        );
        if (messageInput) messageInput.focus();
        return;
      }

      // Valid: Start Cyber Transmission Sequence
      isSubmitting = true;
      playTerminalTransmitSound();

      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.t-btn-text');
        if (btnText) btnText.textContent = t.transmittingBtn;
      }

      appendTerminalLog(
        't-tag-init',
        '[1/3 VALIDATE]',
        t.dispatch1(sender)
      );

      setTimeout(() => {
        playTerminalBeepSound();
        appendTerminalLog(
          't-tag-auth',
          '[2/3 ENCRYPT]',
          t.dispatch2
        );
      }, 350);

      setTimeout(async () => {
        playTerminalTransmitSound();
        appendTerminalLog(
          't-tag-ok',
          '[3/3 DISPATCH]',
          t.dispatch3
        );

        let apiSuccess = false;

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sender,
              email,
              mission,
              message,
              portal_trap: portalTrap,
              _timeProof: formInitTime
            })
          });

          if (res.status === 429) {
            const errJson = await res.json().catch(() => ({}));
            playGlitchSound();
            appendTerminalLog(
              't-tag-err',
              '[FIREWALL 429]',
              `🛑 <strong>${errJson.error || 'RATE LIMIT EXCEEDED'}</strong>: ${errJson.message || 'Harap tunggu beberapa menit sebelum mengirim lagi.'}`
            );
            isSubmitting = false;
            if (submitBtn) {
              submitBtn.disabled = false;
              const btnText = submitBtn.querySelector('.t-btn-text');
              if (btnText) btnText.textContent = 'EXECUTE_TRANSMISSION.sh';
            }
            return;
          }

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              apiSuccess = true;
              playPortalSound();
              appendTerminalLog(
                't-tag-ok',
                '[SUCCESS // CONFIRMED]',
                t.dispatchSuccess
              );
              termForm.reset();

              // Start Cooldown Lock (30 seconds)
              cooldownSeconds = 30;
              if (submitBtn) {
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('.t-btn-text');
                if (btnText) btnText.textContent = `COOLDOWN [${cooldownSeconds}s]`;

                cooldownTimer = setInterval(() => {
                  cooldownSeconds--;
                  if (cooldownSeconds > 0) {
                    if (btnText) btnText.textContent = `COOLDOWN [${cooldownSeconds}s]`;
                  } else {
                    clearInterval(cooldownTimer);
                    cooldownTimer = null;
                    isSubmitting = false;
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'EXECUTE_TRANSMISSION.sh';
                    formInitTime = Date.now();
                  }
                }, 1000);
              }
              return;
            }
          }
        } catch (apiErr) {
          console.warn('Subspace API endpoint unreachable, activating mailto fallback:', apiErr);
        }

        // Fallback to mailto if API failed
        if (!apiSuccess) {
          appendTerminalLog(
            't-tag-auth',
            '[FALLBACK // LOCAL CLIENT]',
            t.dispatchFallback
          );

          const subject = encodeURIComponent(`[CITADEL TRANSMISSION] ${mission} - from ${sender}`);
          const body = encodeURIComponent(
            `=== CITADEL SUBSPACE TRANSMISSION PACKET ===\n` +
            `Dimension     : Earth / C-137\n` +
            `Sender Name   : ${sender}\n` +
            `Return Freq   : ${email}\n` +
            `Mission Type  : ${mission}\n` +
            `Timestamp     : ${new Date().toLocaleString()}\n\n` +
            `=== TRANSMISSION PAYLOAD ===\n` +
            `${message}\n\n` +
            `============================================\n` +
            `Dispatched via Citadel Subspace Terminal CLI\n`
          );

          const mailtoUrl = `mailto:nisfalfilsa12@gmail.com?subject=${subject}&body=${body}`;
          window.location.href = mailtoUrl;

          setTimeout(() => {
            isSubmitting = false;
            if (submitBtn) {
              submitBtn.disabled = false;
              const btnText = submitBtn.querySelector('.t-btn-text');
              if (btnText) btnText.textContent = 'EXECUTE_TRANSMISSION.sh';
            }
          }, 1500);
        }
      }, 750);
    });
  }

  /* ── 20. Microverse Battery Testimonials Filter ── */
  function setupMicroverseFilter() {
    const filterBtns = document.querySelectorAll('.battery-filter-btn');
    const cells = document.querySelectorAll('.battery-cell');
    if (!filterBtns.length || !cells.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playGlitchSound();
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cells.forEach(cell => {
          const category = cell.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            cell.style.display = '';
            cell.style.animation = 'none';
            requestAnimationFrame(() => {
              cell.style.animation = 'portalEntry 0.35s ease-out forwards';
            });
          } else {
            cell.style.display = 'none';
          }
        });
      });
    });
  }

})();
