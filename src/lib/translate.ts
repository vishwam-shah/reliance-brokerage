/**
 * Google Translate cookie controls.
 *
 * Google's widget watches `googtrans` cookie. Setting it on root + the
 * site domain (with leading dot) makes the page render in target lang
 * after reload — Google handles all DOM mutation observation.
 */

const COOKIE_NAME = 'googtrans';

function setCookie(value: string) {
  const host = window.location.hostname;
  // Set on path / and on both bare host + .host so subdomains pick it up
  document.cookie = `${COOKIE_NAME}=${value}; path=/`;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=${host}`;
  if (!host.includes(':') && host.split('.').length > 1) {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=.${host}`;
  }
}

function clearCookie() {
  const host = window.location.hostname;
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${COOKIE_NAME}=; path=/; domain=${host}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  if (!host.includes(':') && host.split('.').length > 1) {
    document.cookie = `${COOKIE_NAME}=; path=/; domain=.${host}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function setLanguage(lang: 'en' | 'zh') {
  if (typeof window === 'undefined') return;

  if (lang === 'en') {
    clearCookie();
  } else {
    // Format: /<source>/<target>
    setCookie('/en/zh-CN');
  }

  // Persist user's choice for next session
  try {
    localStorage.setItem('rb_lang', lang);
  } catch {}

  window.location.reload();
}

export function getCurrentLanguage(): 'en' | 'zh' {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  if (match && decodeURIComponent(match[1]).includes('zh')) return 'zh';
  return 'en';
}
