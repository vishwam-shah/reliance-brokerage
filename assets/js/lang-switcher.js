/**
 * Language Switcher Module
 * Handles translation across entire site with comprehensive text matching
 */

let translations = {};
let currentLang = localStorage.getItem('lang') || 'en';
let textMap = {}; // Map English text to translation keys

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

    // Build text map for reverse lookup
    buildTextMap();

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
  }
})();

function buildTextMap() {
  // Create a map of English text to translation keys
  const enTexts = translations['en'];
  if (!enTexts) return;

  const walkObj = (obj, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        textMap[value] = fullKey;
      } else if (typeof value === 'object') {
        walkObj(value, fullKey);
      }
    }
  };
  walkObj(enTexts);
}

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

function getValue(obj, keyPath) {
  if (!obj) return null;
  const keys = keyPath.split('.');
  let value = obj;
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return null;
    }
  }
  return value;
}

function applyLanguage(lang) {
  if (!translations[lang]) return;

  const t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = getValue(t, key);

    if (value) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else if (typeof value === 'string' && value.includes('<br/>')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Walk through all text nodes and try to translate them
  walkAndTranslateDOM(document.body, lang);
}

function walkAndTranslateDOM(node, lang) {
  if (!node) return;

  const t = translations[lang];
  if (!t) return;

  // Process text nodes
  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let currentNode;
  while ((currentNode = walker.nextNode())) {
    const text = currentNode.textContent.trim();
    if (!text || text.length < 2) continue;

    // Skip if parent has data-i18n (already handled)
    if (currentNode.parentElement?.hasAttribute('data-i18n')) continue;

    // Try to find translation
    const key = textMap[text];
    if (key) {
      const translatedValue = getValue(t, key);
      if (translatedValue && typeof translatedValue === 'string') {
        currentNode.textContent = translatedValue;
      }
    }
  }
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
    return getValue(translations[currentLang], key) || key;
  }
};
