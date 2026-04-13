/**
 * Language Switcher Module
 * Handles translation across entire site
 */

let translations = {};
let currentLang = localStorage.getItem('lang') || 'en';

// Load and apply translations
(async function initLanguageSwitcher() {
  try {
    // Determine correct path based on current location
    let translationPath = './assets/js/translations.json';
    const pathDepth = window.location.pathname.split('/').length - 2;
    if (pathDepth > 0) {
      translationPath = '../'.repeat(pathDepth) + 'assets/js/translations.json';
    }

    const res = await fetch(translationPath);
    if (!res.ok) throw new Error(`Failed to load translations: ${res.status}`);
    translations = await res.json();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applyLanguage(currentLang);
        setupLanguageButton();
      });
    } else {
      applyLanguage(currentLang);
      setupLanguageButton();
    }

    // Listen for language changes on other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'lang') {
        currentLang = e.newValue || 'en';
        applyLanguage(currentLang);
        updateLanguageButtonText();
      }
    });
  } catch (err) {
    console.error('Error loading translations:', err);
    console.log('Translation path attempted:', translationPath);
  }
})();

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
  btn.addEventListener('mouseenter', () => {
    btn.style.color = 'var(--on-surface)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.color = 'var(--on-surface-variant)';
  });
}

function updateLanguageButtonText() {
  const btn = document.getElementById('lang-text');
  if (btn) btn.textContent = currentLang === 'en' ? '中文' : 'English';
}

function applyLanguage(lang) {
  if (!translations[lang]) return;

  const t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const keys = key.split('.');
    let value = t;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }
    
    if (value) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else if (el.innerHTML && value.includes('<br/>')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Update navigation
  document.querySelectorAll('a[href*=".html"]').forEach(link => {
    const href = link.getAttribute('href');
    let key = null;
    
    if (href === 'listings.html' || href.endsWith('/listings.html')) key = 'nav.listings';
    else if (href === 'how-it-works.html' || href.endsWith('/how-it-works.html')) key = 'nav.how_it_works';
    else if (href === 'valuations.html' || href.endsWith('/valuations.html')) key = 'nav.valuations';
    else if (href === 'about.html' || href.endsWith('/about.html')) key = 'nav.about';
    else if (href === 'legal-hub.html' || href.endsWith('/legal-hub.html')) key = 'nav.legal';
    else if (href === 'sign-in.html' || href.endsWith('/sign-in.html')) key = 'nav.sign_in';
    
    if (key) {
      const keys = key.split('.');
      let value = t;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        }
      }
      if (value && !link.closest('footer')) {
        link.textContent = value;
      }
    }
  });

  // Update buttons
  document.querySelectorAll('.btn').forEach(btn => {
    const text = btn.textContent.trim();
    const lookups = {
      'Sign In': 'auth.sign_in_button',
      '登录': 'auth.sign_in_button',
      'List a Business': 'nav.list_business',
      '上市业务': 'nav.list_business',
      'Request Valuation': 'hero.cta1',
      '请求估值': 'hero.cta1',
      'View Listings': 'hero.cta2',
      '查看房源': 'hero.cta2',
      'Contact a Lead Broker': 'cta_final.contact',
      '联系主要经纪人': 'cta_final.contact',
      'Browse Listings': 'cta_final.browse',
      'Explore the Full Process': 'process.explore',
      '探索完整流程': 'process.explore',
      'Create Account': 'auth.register_button',
      '创建账户': 'auth.register_button',
      'Send Reset Link': 'auth.send_reset',
      '发送重置链接': 'auth.send_reset'
    };

    const key = lookups[text];
    if (key) {
      const keys = key.split('.');
      let value = t;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        }
      }
      if (value) btn.textContent = value;
    }
  });
}

// Export for use in other scripts
window.LanguageSwitcher = {
  getCurrentLanguage: () => currentLang,
  setLanguage: (lang) => {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyLanguage(lang);
    updateLanguageButtonText();
  },
  getTranslations: () => translations,
  translate: (key) => {
    const keys = key.split('.');
    let value = translations[currentLang];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      }
    }
    return value || key;
  }
};
