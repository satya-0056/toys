// landing.js — Landing Page Interactions

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== SCROLL REVEAL OBSERVER =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal-up, .reveal-right, .reveal-left').forEach(el => {
  revealObserver.observe(el);
});

// Force visible elements that are already on screen on load
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-up, .reveal-right, .reveal-left').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
});

// ===== HERO PARALLAX — subtle depth on mouse move =====
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const dx = (clientX / innerWidth - 0.5) * 20;
    const dy = (clientY / innerHeight - 0.5) * 20;

    const cards = document.querySelectorAll('.hero-card');
    cards.forEach((card, i) => {
      const factor = (i + 1) * 0.4;
      card.style.transform = `translateX(${dx * factor}px) translateY(${dy * factor}px)`;
    });

    const floaters = document.querySelectorAll('.hf');
    floaters.forEach((f, i) => {
      const factor = ((i % 3) + 1) * 0.15;
      f.style.transform = `translateX(${dx * factor}px) translateY(${dy * factor}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    document.querySelectorAll('.hero-card').forEach(card => {
      card.style.transform = '';
    });
  });
}

// ===== CATEGORY CARD TILT EFFECT =====
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s ease, box-shadow 0.3s ease';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
});

// ===== FEATURED CARD HOVER TILT =====
document.querySelectorAll('.featured-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-6px) scale(1.01)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ===== STAT COUNTER ANIMATION =====
function animateCounter(el, target, suffix) {
  const start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    const progress = Math.min(timestamp / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Trigger counter when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(document.querySelector('.stat:nth-child(1) .stat-num'), 20, 'K+');
      animateCounter(document.querySelector('.stat:nth-child(3) .stat-num'), 50, 'K+');
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== GSAP SCROLL ANIMATIONS =====
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Animate hero floating cards to move downwards and rotate while scrolling
  gsap.to('.card-main', {
    y: 150,
    rotation: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.card-top', {
    y: 200,
    x: 80,
    rotation: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.card-bottom', {
    y: 100,
    x: -80,
    rotation: -25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Animate floating emojis to scatter on scroll
  const floaters = document.querySelectorAll('.hf');
  floaters.forEach((f, i) => {
    gsap.to(f, {
      y: (i % 2 === 0 ? 1 : -1) * (100 + Math.random() * 100),
      x: (i % 3 === 0 ? 1 : -1) * (50 + Math.random() * 100),
      rotation: (Math.random() - 0.5) * 180,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Fade out hero blobs
  gsap.to('.hero-bg-blobs', {
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'center top',
      scrub: true
    }
  });

  // Animate the toy car across the screen based on scroll progress
  gsap.to('#scrollCarAnim', {
    x: window.innerWidth + 300,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const car = document.getElementById('scrollCarAnim');
        if (!car) return;
        // add moving class to show speed lines if velocity is high enough
        if (Math.abs(self.getVelocity()) > 20) {
          car.classList.add('moving');
        } else {
          car.classList.remove('moving');
        }
      }
    }
  });
});

// ===== CATEGORY DISTRIBUTION RENDER =====
function buildDistributionChart() {
  const chart = document.getElementById('distChart');
  if (!chart) return;

  const catCards = document.querySelectorAll('.categories-grid .cat-card');
  const data = [];
  catCards.forEach(card => {
    const label = card.querySelector('h3')?.textContent || '';
    const countText = card.querySelector('.cat-count')?.textContent || '0';
    // extract numeric part
    const n = parseInt(countText.replace(/[^0-9]/g, '')) || 0;
    if (label && n) data.push({ label, value: n });
  });

  if (!data.length) return;
  const max = Math.max(...data.map(d => d.value));

  data.forEach(d => {
    const barWrap = document.createElement('div');
    barWrap.style.flex = '1';
    barWrap.style.display = 'flex';
    barWrap.style.flexDirection = 'column';
    barWrap.style.alignItems = 'center';
    barWrap.style.gap = '8px';

    const bar = document.createElement('div');
    const pct = Math.max(6, Math.round((d.value / max) * 100));
    bar.style.width = '100%';
    bar.style.height = pct + '%';
    bar.style.background = 'linear-gradient(180deg,#7c3aed,#00c853)';
    bar.style.borderRadius = '6px 6px 2px 2px';
    bar.style.transition = 'height 800ms cubic-bezier(.2,.9,.2,1)';
    barWrap.appendChild(bar);

    const label = document.createElement('small');
    label.style.marginTop = '8px';
    label.style.textAlign = 'center';
    label.style.fontSize = '0.8rem';
    label.textContent = d.label;

    barWrap.appendChild(label);
    chart.appendChild(barWrap);
  });

  // Animate bars on reveal
  requestAnimationFrame(() => {
    document.querySelectorAll('#distChart div > div').forEach(b => {
      b.style.height = b.style.height; // trigger
    });
  });
}

window.addEventListener('load', buildDistributionChart);
