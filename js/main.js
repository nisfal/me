/**
 * Personal Portfolio - Nisfal Filsa (Fullstack & Systems Engineer)
 * BDSN.club Kinetic Motion, Fluid Cursor, Kinetic Typography & Lenis Momentum Scroll
 */

(function() {
  'use strict';

  // ===== 1. BDSN-Style Fluid Spring Pointer / Cursor =====
  class FluidCursor {
    constructor() {
      const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!isFinePointer || window.innerWidth < 768) return;

      this.dot = document.createElement('div');
      this.dot.className = 'custom-cursor-dot';

      this.trailer = document.createElement('div');
      this.trailer.className = 'custom-cursor-trailer';

      document.body.appendChild(this.dot);
      document.body.appendChild(this.trailer);

      this.mouse = { x: -100, y: -100 };
      this.trailerPos = { x: -100, y: -100 };
      this.lerpEase = 0.16;
      this.isMoving = false;

      this.init();
    }

    init() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (!document.body.classList.contains('cursor-active')) {
          document.body.classList.add('cursor-active');
          this.trailerPos.x = this.mouse.x;
          this.trailerPos.y = this.mouse.y;
        }

        // Dot follows cursor directly
        this.dot.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px) translate(-50%, -50%)`;

        if (!this.isMoving) {
          this.isMoving = true;
          this.render();
        }
      });

      document.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
      });

      document.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
      });

      window.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-down');
      });

      window.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-down');
      });

      this.bindHoverTargets();
    }

    bindHoverTargets() {
      const interactiveTargets = 'a, button, .bento-card, .project-card, .widget-tab, .tech-chip, .pill, .btn, .lang-btn, .nav-logo';
      document.querySelectorAll(interactiveTargets).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

      // Header typography gets its own filled-ring state
      document.querySelectorAll('.split-word').forEach(el => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-text');
          document.body.classList.remove('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-text');
        });
      });
    }

    render() {
      const diffX = this.mouse.x - this.trailerPos.x;
      const diffY = this.mouse.y - this.trailerPos.y;

      this.trailerPos.x += diffX * this.lerpEase;
      this.trailerPos.y += diffY * this.lerpEase;

      this.trailer.style.transform = `translate(${this.trailerPos.x}px, ${this.trailerPos.y}px) translate(-50%, -50%)`;

      if (Math.abs(diffX) > 0.1 || Math.abs(diffY) > 0.1) {
        requestAnimationFrame(() => this.render());
      } else {
        this.isMoving = false;
      }
    }
  }

  // ===== 2. BDSN-Style Kinetic Typography Engine (Mask Split Reveal) =====
  function initKineticTypography() {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const titles = document.querySelectorAll('.hero-title, .section-title');

    titles.forEach(title => {
      if (title.hasAttribute('data-split-done')) return;

      const rawHtml = title.innerHTML;
      title.setAttribute('data-original-html', rawHtml);

      const clone = title.cloneNode(true);
      const childNodes = Array.from(clone.childNodes);
      title.innerHTML = '';
      let wordCounter = 0;

      function splitTextIntoWords(text, isGrad = false) {
        const frag = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);
        parts.forEach(part => {
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else if (part.length > 0) {
            const mask = document.createElement('span');
            mask.className = 'split-word-mask';
            const wordSpan = document.createElement('span');
            wordSpan.className = isGrad ? 'split-word gradient-text' : 'split-word';
            wordSpan.style.setProperty('--word-idx', wordCounter++);
            wordSpan.textContent = part;
            mask.appendChild(wordSpan);
            frag.appendChild(mask);
          }
        });
        return frag;
      }

      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          title.appendChild(splitTextIntoWords(node.textContent, false));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'br') {
            title.appendChild(document.createElement('br'));
          } else {
            const isGrad = node.classList.contains('gradient-text') || node.classList.contains('highlight');
            title.appendChild(splitTextIntoWords(node.textContent, isGrad));
          }
        }
      });

      title.setAttribute('data-split-done', 'true');
    });

    // Trigger word reveal with staggered BDSN ease
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.split-word').forEach(word => {
          word.classList.add('animated');
        });
      }, 50);
    });
  }

  // ===== 3. Standalone Lenis-Style Smooth Momentum Scroll Engine =====
  class SmoothScrollEngine {
    constructor() {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.isReducedMotion || 'ontouchstart' in window && window.innerWidth <= 768) {
        return;
      }

      this.targetY = window.scrollY;
      this.currentY = window.scrollY;
      this.ease = 0.085;
      this.isScrolling = false;
      this.rafId = null;

      this.init();
    }

    init() {
      document.documentElement.classList.add('lenis', 'lenis-smooth');

      window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

      window.addEventListener('resize', () => {
        this.targetY = window.scrollY;
        this.currentY = window.scrollY;
      });
    }

    onWheel(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      let target = e.target;
      while (target && target !== document.body) {
        if (target.scrollHeight > target.clientHeight && ['auto', 'scroll'].includes(window.getComputedStyle(target).overflowY)) {
          return;
        }
        target = target.parentElement;
      }

      e.preventDefault();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetY = Math.max(0, Math.min(this.targetY + e.deltaY * 1.05, maxScroll));

      if (!this.isScrolling) {
        this.isScrolling = true;
        this.render();
      }
    }

    scrollTo(targetY) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetY = Math.max(0, Math.min(targetY, maxScroll));
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.render();
      }
    }

    render() {
      const diff = this.targetY - this.currentY;
      this.currentY += diff * this.ease;

      if (Math.abs(diff) < 0.5) {
        this.currentY = this.targetY;
        window.scrollTo(0, this.currentY);
        this.isScrolling = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        return;
      }

      window.scrollTo(0, this.currentY);
      this.rafId = requestAnimationFrame(() => this.render());
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const smoothEngine = new SmoothScrollEngine();
    const cursor = new FluidCursor();

    // Initial Kinetic Typography
    initKineticTypography();

    // Re-bind typography on language change
    window.addEventListener('languageChanged', () => {
      document.querySelectorAll('[data-split-done]').forEach(el => el.removeAttribute('data-split-done'));
      initKineticTypography();
      cursor.bindHoverTargets();
    });

    // ===== 4. Navbar Scroll Dynamic Header =====
    const navbar = document.getElementById('navbar');
    let ticking = false;

    function updateNavbar() {
      if (window.scrollY > 30) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
    updateNavbar();

    // ===== 5. Mobile Navigation Drawer =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
          navToggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
      });

      document.querySelectorAll('.nav-link, .btn-switch').forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }

    // ===== 6. Smooth Anchor Scrolling Integration =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 70;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          if (smoothEngine.scrollTo) {
            smoothEngine.scrollTo(offsetPosition);
          } else {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // ===== 7. BDSN-Style Scroll Stagger Reveals =====
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      scrollObserver.observe(el);
    });

    // ===== 8. Hero Architecture Telemetry Widget Tabs =====
    const widgetTabs = document.querySelectorAll('.widget-tab');
    const widgetBody = document.getElementById('widgetBody');

    const widgetData = {
      arch: `
        <div class="widget-grid">
          <div class="widget-stat-card">
            <span class="widget-stat-label">Pipeline Throughput</span>
            <span class="widget-stat-val">100k+ ops/s</span>
            <span class="widget-stat-sub">Go Gin + RabbitMQ</span>
          </div>
          <div class="widget-stat-card">
            <span class="widget-stat-label">DB Query Latency</span>
            <span class="widget-stat-val">&lt; 2.4ms</span>
            <span class="widget-stat-sub">Prisma v6 + Redis</span>
          </div>
          <div class="widget-stat-card">
            <span class="widget-stat-label">Queue Reliability</span>
            <span class="widget-stat-val">99.99%</span>
            <span class="widget-stat-sub">Durable + DLQ Policy</span>
          </div>
        </div>
      `,
      telemetry: `
        <div class="widget-grid">
          <div class="widget-stat-card">
            <span class="widget-stat-label">SSR TTFB</span>
            <span class="widget-stat-val">&lt; 42ms</span>
            <span class="widget-stat-sub">Next.js 15 App Router</span>
          </div>
          <div class="widget-stat-card">
            <span class="widget-stat-label">State Hydration</span>
            <span class="widget-stat-val">0ms Shift</span>
            <span class="widget-stat-sub">Zustand v5 + Query</span>
          </div>
          <div class="widget-stat-card">
            <span class="widget-stat-label">GIS Map Render</span>
            <span class="widget-stat-val">60 FPS</span>
            <span class="widget-stat-sub">Leaflet Layer Cache</span>
          </div>
        </div>
      `,
      security: `
        <div class="widget-grid">
          <div class="widget-stat-card">
            <span class="widget-stat-label">Auth & Permissions</span>
            <span class="widget-stat-val">CASL ABAC</span>
            <span class="widget-stat-sub">Granular Policy Enforcement</span>
          </div>
          <div class="widget-stat-card">
            <span class="widget-stat-label">Encryption</span>
            <span class="widget-stat-val">AES-256 E2EE</span>
            <span class="widget-stat-sub">Client Key Exchange</span>
          </div>
          <div class="widget-stat-card">
            <span class="widget-stat-label">Data Isolation</span>
            <span class="widget-stat-val">Dual DB</span>
            <span class="widget-stat-sub">Main OLTP + Mediation DB</span>
          </div>
        </div>
      `
    };

    if (widgetTabs.length && widgetBody) {
      widgetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabKey = tab.getAttribute('data-tab');
          if (!widgetData[tabKey] || tab.classList.contains('active')) return;

          widgetTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          // BDSN Easing transition: crossfade with subtle scale
          widgetBody.style.opacity = '0';
          widgetBody.style.transform = 'translateY(4px) scale(0.99)';

          setTimeout(() => {
            widgetBody.innerHTML = widgetData[tabKey];
            widgetBody.style.opacity = '1';
            widgetBody.style.transform = 'translateY(0) scale(1)';
            cursor.bindHoverTargets();
          }, 120);
        });
      });
    }

    // ===== 9. Active Navigation Link Highlighting =====
    const sections = document.querySelectorAll('section[id], header[id]');
    function highlightNavigation() {
      const scrollY = window.scrollY;
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink?.classList.add('active');
        } else {
          navLink?.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(highlightNavigation);
    }, { passive: true });

    console.log('⚡ Nisfal Filsa Portfolio initialized with BDSN Kinetic Typography, Fluid Pointer & Lenis Momentum Scroll.');
  });
})();
