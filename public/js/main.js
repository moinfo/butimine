// ── Navbar scroll effect ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu with backdrop ─────────────────────────────────────
const menuBtn    = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const backdrop   = document.getElementById('menu-backdrop');

function openMenu() {
  mobileMenu.classList.remove('hidden', '-translate-y-4', 'opacity-0');
  mobileMenu.classList.add('translate-y-0', 'opacity-100');
  backdrop && backdrop.classList.remove('hidden');
  menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn && menuBtn.classList.add('is-open');
}
function closeMenu() {
  mobileMenu.classList.add('-translate-y-4', 'opacity-0');
  mobileMenu.classList.remove('translate-y-0', 'opacity-100');
  setTimeout(() => mobileMenu.classList.add('hidden'), 250);
  backdrop && backdrop.classList.add('hidden');
  menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn && menuBtn.classList.remove('is-open');
}

menuBtn && menuBtn.addEventListener('click', () => {
  menuBtn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
});
backdrop && backdrop.addEventListener('click', closeMenu);

// ── Scroll reveal ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ─────────────────────────────────────────────
function animateCounter(el) {
  const target    = parseInt(el.dataset.target, 10);
  const suffix    = el.dataset.suffix || '';
  const duration  = 1800;
  const step      = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Gallery lightbox (safe DOM construction) ──────────────────────
const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
let currentIndex = 0;

if (galleryItems.length) {
  // Backdrop
  const lbBackdrop = document.createElement('div');
  lbBackdrop.id = 'lb-backdrop';
  lbBackdrop.className = 'fixed inset-0 z-[990] bg-black/0 transition-all duration-300 hidden';

  // Box wrapper
  const lbBox = document.createElement('div');
  lbBox.id = 'lb-box';
  lbBox.className = 'fixed inset-0 z-[999] flex items-center justify-center hidden';

  // Close button
  const lbClose = document.createElement('button');
  lbClose.setAttribute('aria-label', 'Close');
  lbClose.className = 'absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors';
  lbClose.textContent = '✕';

  // Prev button
  const lbPrev = document.createElement('button');
  lbPrev.setAttribute('aria-label', 'Previous');
  lbPrev.className = 'absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-3xl flex items-center justify-center transition-colors';
  lbPrev.textContent = '‹';

  // Next button
  const lbNext = document.createElement('button');
  lbNext.setAttribute('aria-label', 'Next');
  lbNext.className = 'absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-3xl flex items-center justify-center transition-colors';
  lbNext.textContent = '›';

  // Image
  const lbImg = document.createElement('img');
  lbImg.id = 'lb-img';
  lbImg.className = 'max-w-[90vw] max-h-[88vh] object-contain rounded-xl shadow-2xl transition-opacity duration-200';
  lbImg.alt = 'Butemine School photo';

  // Counter
  const lbCounter = document.createElement('div');
  lbCounter.className = 'absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tracking-widest';

  lbBox.append(lbClose, lbPrev, lbNext, lbImg, lbCounter);
  document.body.append(lbBackdrop, lbBox);

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = galleryItems[index].src;
    lbCounter.textContent = (index + 1) + ' / ' + galleryItems.length;
    lbBackdrop.classList.remove('hidden');
    lbBox.classList.remove('hidden');
    requestAnimationFrame(() => {
      lbBackdrop.classList.add('bg-black/90');
      lbBackdrop.classList.remove('bg-black/0');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lbBackdrop.classList.remove('bg-black/90');
    lbBackdrop.classList.add('bg-black/0');
    setTimeout(() => {
      lbBackdrop.classList.add('hidden');
      lbBox.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  function showSlide(index) {
    currentIndex = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = galleryItems[currentIndex].src;
      lbCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
      lbImg.style.opacity = '1';
    }, 150);
  }

  galleryItems.forEach((img, i) => {
    const item = img.closest('.gallery-item');
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => showSlide(currentIndex - 1));
  lbNext.addEventListener('click', () => showSlide(currentIndex + 1));
  lbBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (lbBox.classList.contains('hidden')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
  });
}

// ── Dark / Light mode ─────────────────────────────────────────────
(function () {
  const html = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  }
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = html.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
})();

// ── More dropdown ─────────────────────────────────────────────────
const moreBtn  = document.getElementById('more-btn');
const moreMenu = document.getElementById('more-menu');
const moreChev = document.getElementById('more-chevron');
if (moreBtn && moreMenu) {
  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = moreMenu.classList.toggle('hidden');
    moreBtn.setAttribute('aria-expanded', String(!open));
    moreChev.style.transform = open ? '' : 'rotate(180deg)';
  });
  document.addEventListener('click', (e) => {
    if (!document.getElementById('more-dropdown-wrap').contains(e.target)) {
      moreMenu.classList.add('hidden');
      moreBtn.setAttribute('aria-expanded', 'false');
      moreChev.style.transform = '';
    }
  });
}

// ── Back to top ───────────────────────────────────────────────────
const backTop = document.getElementById('back-to-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('opacity-0', window.scrollY < 400);
    backTop.classList.toggle('pointer-events-none', window.scrollY < 400);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
