/**
 * Reliance Brokerage — Main JavaScript
 * Shared interactions across the platform
 */

'use strict';

/* ─────────────────────────────────────────────────────
   Mobile Navigation Toggle
───────────────────────────────────────────────────── */
(function initMobileNav() {
  const btn   = document.getElementById('nav-mobile-btn');
  const panel = document.getElementById('nav-mobile-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    panel.style.display = isOpen ? 'flex' : 'none';
  });
})();

/* ─────────────────────────────────────────────────────
   Animated KPI Counters
   Triggers when the element enters the viewport.
───────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.counter.replace(/[^0-9.]/g, ''));
      const prefix = el.dataset.counter.match(/^[^0-9]*/)?.[0] || '';
      const suffix = el.dataset.counter.match(/[^0-9.]+$/)?.[0] || '';
      const decimals = (el.dataset.counter.split('.')[1] || '').length;
      let start = 0;
      const duration = 2000;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = prefix + (target * ease).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────
   Scroll-Reveal (fade-in on scroll)
───────────────────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    observer.observe(el);
  });
})();

/* ─────────────────────────────────────────────────────
   Active Navigation Link Highlighter
───────────────────────────────────────────────────── */
(function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .sidebar-link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ─────────────────────────────────────────────────────
   Modal Utility
───────────────────────────────────────────────────── */
window.SovModal = {
  open(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    modal.querySelector('[data-modal-close]')?.focus();
  },
  close(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
};

document.addEventListener('click', e => {
  if (e.target.closest('[data-modal-trigger]')) {
    const id = e.target.closest('[data-modal-trigger]').dataset.modalTrigger;
    window.SovModal.open(id);
  }
  if (e.target.closest('[data-modal-close]')) {
    const modal = e.target.closest('[role="dialog"]');
    if (modal) window.SovModal.close(modal.id);
  }
});

/* ─────────────────────────────────────────────────────
   Sidebar Toggle (Mobile Portal)
───────────────────────────────────────────────────── */
(function initSidebarToggle() {
  const btn     = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar--open');
  });
})();

/* ─────────────────────────────────────────────────────
   Toast Notification
───────────────────────────────────────────────────── */
window.SovToast = function(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `sov-toast sov-toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="material-symbols-outlined">${
      type === 'success' ? 'check_circle' :
      type === 'error'   ? 'error'        :
      'info'
    }</span>
    <span>${message}</span>
  `;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    background: type === 'error' ? '#9E422C' : type === 'success' ? '#2D6A4F' : '#2F2C2A',
    color: '#FFF8F3',
    fontFamily: "'Manrope', sans-serif",
    fontSize: '0.8125rem',
    fontWeight: '600',
    letterSpacing: '0.03em',
    boxShadow: '0 20px 40px rgba(47, 44, 42, 0.12)',
    opacity: '0',
    transform: 'translateY(8px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

/* ─────────────────────────────────────────────────────
   Language Switcher (English / 中文)
───────────────────────────────────────────────────── */
(function initLanguageSwitcher() {
  let translations = {};
  let currentLang = localStorage.getItem('lang') || 'en';

  // Load translations
  fetch('./assets/js/translations.json')
    .then(res => res.json())
    .then(data => {
      translations = data;
      applyLanguage(currentLang);
      setupLanguageButton();
    })
    .catch(err => console.error('Error loading translations:', err));

  function setupLanguageButton() {
    const btn = document.getElementById('lang-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      localStorage.setItem('lang', currentLang);
      applyLanguage(currentLang);
      updateLanguageButtonText();
    });

    updateLanguageButtonText();
  }

  function updateLanguageButtonText() {
    const btn = document.getElementById('lang-text');
    if (btn) btn.textContent = currentLang === 'en' ? '中文' : 'English';
  }

  function applyLanguage(lang) {
    if (!translations[lang]) return;

    const t = translations[lang];
    document.documentElement.lang = lang;

    // Update navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === 'listings.html') link.textContent = t.nav.listings;
      else if (href === 'how-it-works.html') link.textContent = t.nav.how_it_works;
      else if (href === 'valuations.html') link.textContent = t.nav.valuations;
      else if (href === 'about.html') link.textContent = t.nav.about;
      else if (href === 'legal-hub.html') link.textContent = t.nav.legal;
    });

    // Update mobile nav links
    document.querySelectorAll('#nav-mobile-panel a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === 'listings.html') link.textContent = t.nav.listings;
      else if (href === 'how-it-works.html') link.textContent = t.nav.how_it_works;
      else if (href === 'valuations.html') link.textContent = t.nav.valuations;
      else if (href === 'about.html') link.textContent = t.nav.about;
      else if (href === 'legal-hub.html') link.textContent = t.nav.legal;
    });

    // Update buttons
    document.querySelectorAll('.btn').forEach(btn => {
      const text = btn.textContent.trim();
      if (text === 'Sign In' || text === '登录') btn.textContent = lang === 'en' ? 'Sign In' : '登录';
      else if (text === 'List a Business' || text === '上市业务') btn.textContent = lang === 'en' ? 'List a Business' : '上市业务';
      else if (text === 'Request Valuation' || text === '请求估值') btn.textContent = lang === 'en' ? 'Request Valuation' : '请求估值';
      else if (text === 'View Listings' || text === '查看房源') btn.textContent = lang === 'en' ? 'View Listings' : '查看房源';
      else if (text === 'Contact a Lead Broker' || text === '联系主要经纪人') btn.textContent = lang === 'en' ? 'Contact a Lead Broker' : '联系主要经纪人';
      else if (text === 'Browse Listings' || text === '查看房源') btn.textContent = lang === 'en' ? 'Browse Listings' : '查看房源';
      else if (text === 'Explore the Full Process' || text === '探索完整流程') btn.textContent = lang === 'en' ? 'Explore the Full Process' : '探索完整流程';
    });
  }
})();
