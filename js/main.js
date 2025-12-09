/**
 * Personal Portfolio - JavaScript Animations & Interactions
 * Fullstack Developer | Go & Svelte
 */

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// ===== Navbar Scroll Effect =====
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
  const currentScrollY = window.scrollY;
  
  // Add/remove scrolled class
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Scroll-Triggered Animations =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optionally unobserve after animation
      // observer.unobserve(entry.target);
    }
  });
};

const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
  scrollObserver.observe(el);
});

// ===== Typing Animation for Hero =====
class TypeWriter {
  constructor(element, words, wait = 3000) {
    this.element = element;
    this.words = words;
    this.wait = parseInt(wait, 10);
    this.txt = '';
    this.wordIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ===== Parallax Effect for Hero Glows =====
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

const heroGlow1 = document.querySelector('.hero-glow-1');
const heroGlow2 = document.querySelector('.hero-glow-2');

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateGlows() {
  // Smooth interpolation
  currentX += (mouseX - currentX) * 0.05;
  currentY += (mouseY - currentY) * 0.05;

  if (heroGlow1 && heroGlow2) {
    heroGlow1.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px)`;
    heroGlow2.style.transform = `translate(${-currentX * 20}px, ${-currentY * 20}px)`;
  }

  requestAnimationFrame(animateGlows);
}

animateGlows();

// ===== Skill Tags Hover Effect =====
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function(e) {
    this.style.transform = 'translateY(-2px) scale(1.05)';
  });
  
  tag.addEventListener('mouseleave', function(e) {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// ===== Project Card Tilt Effect =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== Active Navigation Highlighting =====
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
  const scrollY = window.scrollY;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add('active');
    } else {
      navLink?.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// ===== Counter Animation for Stats (if needed) =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  
  updateCounter();
}

// ===== Debounce Utility =====
function debounce(func, wait = 20) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
  // Initial navbar check
  updateNavbar();
  
  // Initial navigation highlight
  highlightNavigation();
  
  // Add loaded class to body for initial animations
  document.body.classList.add('loaded');
  
  console.log('🚀 Portfolio loaded successfully!');
  console.log('Built with: Go + Node.js + Svelte mindset');
});

// ===== Preloader (Optional) =====
window.addEventListener('load', () => {
  document.body.classList.add('fully-loaded');
});
