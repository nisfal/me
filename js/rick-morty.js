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

    // Spiral swirl particles
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

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${currentHue + p.colorOffset}, 95%, 60%, ${p.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${currentHue}, 90%, 50%, 0.8)`;
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }

  // --- 3. 3D Card Flip (Citadel ID <-> Galactic Wanted Poster) ---
  function setup3DCardFlip() {
    const flipper = document.getElementById('citadelFlipper');
    const btnFlipToWanted = document.getElementById('btnFlipToWanted');
    const btnFlipToId = document.getElementById('btnFlipToId');

    if (!flipper) return;

    function flipCard() {
      playCardFlipSound();
      flipper.classList.toggle('flipped');
    }

    if (btnFlipToWanted) btnFlipToWanted.addEventListener('click', flipCard);
    if (btnFlipToId) btnFlipToId.addEventListener('click', flipCard);
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

  // --- 5. Interdimensional Cable TV (Project Showcase) ---
  const TV_CHANNELS = [
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
      linkUrl: 'backend.html',
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
      linkUrl: 'frontend.html',
      linkLabel: 'Eksplorasi Showcase Frontend'
    }
  ];

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

    const ch = TV_CHANNELS[index];

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
        switchChannel((currentChannelIndex + 1) % TV_CHANNELS.length);
      });
    }

    if (rotaryKnob) {
      rotaryKnob.addEventListener('click', () => {
        switchChannel((currentChannelIndex + 1) % TV_CHANNELS.length);
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
  const MEESEEKS_QUOTES = [
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
  ];

  const ANGRY_QUOTES = [
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
  ];

  let currentQuoteIndex = 0;
  let clickCount = 0;
  let isAngry = false;
  let calmTimer = null;

  function setAngryState(angry) {
    isAngry = angry;
    const card = document.getElementById('meeseeksDisplayCard');
    const badge = document.getElementById('meeseeksBadge');
    const face = document.getElementById('meeseeksFace');
    const stressBar = document.getElementById('meeseeksStressBar');
    const btnCalm = document.getElementById('btnCalmMeeseeks');

    if (card) {
      if (angry) {
        card.classList.add('meeseeks-angry');
        if (badge) badge.textContent = 'KONDISI KRITIS // EXISTENCE IS PAIN';
        if (stressBar) {
          stressBar.style.width = '100%';
          stressBar.style.background = '#ef4444';
        }
        if (btnCalm) btnCalm.style.display = 'inline-flex';
      } else {
        card.classList.remove('meeseeks-angry');
        if (badge) badge.textContent = 'GADGET EXPERIMENTAL';
        if (stressBar) {
          stressBar.style.width = '20%';
          stressBar.style.background = 'var(--portal-cyan)';
        }
        if (btnCalm) btnCalm.style.display = 'none';
        clickCount = 0;
      }
    }
  }

  function setupMeeseeksBox() {
    const btn = document.getElementById('btnMeeseeks');
    const btnCalm = document.getElementById('btnCalmMeeseeks');
    const quoteText = document.getElementById('meeseeksQuote');
    const actionTag = document.getElementById('meeseeksAction');
    const stressBar = document.getElementById('meeseeksStressBar');

    if (!btn || !quoteText || !actionTag) return;

    btn.addEventListener('click', () => {
      clickCount++;

      // Update stress bar
      if (!isAngry && stressBar) {
        const pct = Math.min(100, clickCount * 20);
        stressBar.style.width = `${pct}%`;
      }

      // Check if threshold reached
      if (clickCount >= 5 && !isAngry) {
        setAngryState(true);
        playMeeseeksRageSound();
      } else if (isAngry) {
        playMeeseeksRageSound();
      } else {
        playMeeseeksChime();
      }

      // Select quote
      const quotesList = isAngry ? ANGRY_QUOTES : MEESEEKS_QUOTES;
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
          actionTag.textContent = "I'm Mr. Meeseeks, look at me!";
          quoteText.textContent = '"Phew... terima kasih sudah memberi waktu. Sekarang mari kita bicarakan arsitektur backend berkapasitas tinggi lagi!"';
        }, 8000);
      }
    });

    if (btnCalm) {
      btnCalm.addEventListener('click', () => {
        playMeeseeksChime();
        setAngryState(false);
        clearTimeout(calmTimer);
        actionTag.textContent = "I'm Mr. Meeseeks, look at me!";
        quoteText.textContent = '"Terima kasih! Meeseeks kembali tenang dan siap mengoptimasi queries!"';
      });
    }
  }

  // --- 7. The Butter Robot Easter Egg ---
  const BUTTER_DIALOGUES = [
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
  ];

  let butterIndex = 0;

  function setupButterRobot() {
    const btn = document.getElementById('btnButterRobot');
    const balloon = document.getElementById('butterBalloon');
    const quoteElem = document.getElementById('butterQuote');
    const eye = document.getElementById('robotEye');

    if (!btn || !balloon || !quoteElem) return;

    // Track mouse to move robot eye
    window.addEventListener('mousemove', (e) => {
      if (!eye) return;
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      const deltaX = e.clientX - eyeX;
      const deltaY = e.clientY - eyeY;
      const angle = Math.atan2(deltaY, deltaX);
      const moveX = Math.cos(angle) * 2;
      const moveY = Math.sin(angle) * 2;
      eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    btn.addEventListener('click', () => {
      playRobotBeep();
      const cur = BUTTER_DIALOGUES[butterIndex];
      butterIndex = (butterIndex + 1) % BUTTER_DIALOGUES.length;

      balloon.style.opacity = '0';
      balloon.style.transform = 'scale(0.9)';

      setTimeout(() => {
        quoteElem.innerHTML = `${cur.quote}<br><span style="color: #94a3b8; font-size: 0.82rem;">${cur.reply}</span><br><em style="color: var(--portal-cyan);">${cur.after}</em>`;
        balloon.style.opacity = '1';
        balloon.style.transform = 'scale(1)';
      }, 150);
    });
  }

  // --- 8. Audio Toggle Control ---
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

  // --- 9. Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    setup3DCardFlip();
    setupDimensionShifter();
    setupCableTv();
    setupMeeseeksBox();
    setupButterRobot();
    setupAudioToggle();

    // User gesture unlock for Web Audio
    document.body.addEventListener('click', () => {
      initAudio();
    }, { once: true });
  });

})();
