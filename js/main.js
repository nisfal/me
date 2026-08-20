/**
 * Personal Portfolio - Nisfal Filsa (Fullstack & Systems Engineer)
 * BDSN.club Kinetic Motion, Lenis Smooth Inertia Scroll & Emil Kowalski Design Engineering
 */

(function() {
  'use strict';

  // ===== 1. Standalone Lenis-Style Smooth Momentum Scroll Engine =====
  class SmoothScrollEngine {
    constructor() {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.isReducedMotion || 'ontouchstart' in window && window.innerWidth <= 768) {
        return; // Native smooth behavior for mobile / reduced motion
      }

      this.targetY = window.scrollY;
      this.currentY = window.scrollY;
      this.ease = 0.085; // Calibrated BDSN momentum dampening
      this.isScrolling = false;
      this.rafId = null;

      this.init();
    }

    init() {
      document.documentElement.classList.add('lenis', 'lenis-smooth');

      window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

      // Keep targetY updated on key navigation or resize
      window.addEventListener('resize', () => {
        this.targetY = window.scrollY;
        this.currentY = window.scrollY;
      });
    }

    onWheel(e) {
      // Don't intercept if modifier keys pressed or inner scrollable container
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

    scrollTo(targetY, duration = 600) {
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

    // ===== 2. Navbar Scroll Dynamic Header =====
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

    // ===== 3. Mobile Navigation Drawer =====
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

    // ===== 4. Smooth Anchor Scrolling Integration =====
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

    // ===== 5. BDSN-Style Scroll Stagger Reveals =====
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

    // ===== 6. Hero Architecture Telemetry Widget Tabs =====
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
          }, 120);
        });
      });
    }

    // ===== 7. Active Navigation Link Highlighting =====
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

    console.log('⚡ Nisfal Filsa Portfolio initialized with BDSN Kinetic Motion & Lenis Momentum Scroll.');
  });
})();
