/**
 * Navigation Component
 * Single source of truth for site navigation
 * Renders consistently across all pages
 */

const navHTML = `
  <div class="nav-inner">
    <a href="index.html" class="nav-brand">Reliance Brokerage</a>

    <ul class="nav-links" role="list">
      <li><a href="listings.html">Listings</a></li>
      <li><a href="how-it-works.html">How It Works</a></li>
      <li><a href="valuations.html">Valuations</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="legal-hub.html">Legal</a></li>
    </ul>

    <div class="nav-actions">
      <button id="lang-toggle-btn" aria-label="Toggle language" style="background:none; border:none; padding:0.25rem; cursor:pointer; font-family:var(--font-label); font-size:var(--label-xs); font-weight:600; color:var(--on-surface-variant); text-transform:uppercase; letter-spacing:0.15em; transition:color var(--transition-fast);" title="English / 中文">
        <span id="lang-text">中文</span>
      </button>
      <a href="sign-in.html" class="btn btn-ghost btn-sm">Sign In</a>
      <a href="register.html" class="btn btn-primary btn-sm">List a Business</a>
      <button id="nav-mobile-btn" aria-expanded="false" aria-label="Open navigation" style="display:none; background:none; border:none; padding:0.25rem; cursor:pointer;">
        <span class="material-symbols-outlined" style="font-size:1.5rem; color:var(--on-surface);">menu</span>
      </button>
    </div>
  </div>

  <!-- Mobile Panel -->
  <div id="nav-mobile-panel" style="display:none; position:absolute; top:100%; left:0; right:0; background:var(--surface); border-bottom:1px solid rgba(190,176,159,0.2); padding:1.5rem 2rem; flex-direction:column; gap:1rem; z-index:var(--z-nav);">
    <a href="listings.html" style="font-family:var(--font-label); font-size:var(--label-sm); font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:var(--on-surface-variant); padding:0.5rem 0;">Listings</a>
    <a href="how-it-works.html" style="font-family:var(--font-label); font-size:var(--label-sm); font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:var(--on-surface-variant); padding:0.5rem 0;">How It Works</a>
    <a href="valuations.html" style="font-family:var(--font-label); font-size:var(--label-sm); font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:var(--on-surface-variant); padding:0.5rem 0;">Valuations</a>
    <a href="about.html" style="font-family:var(--font-label); font-size:var(--label-sm); font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:var(--on-surface-variant); padding:0.5rem 0;">About</a>
    <div style="margin-top:0.5rem; display:flex; gap:0.75rem;">
      <a href="sign-in.html" class="btn btn-ghost btn-sm">Sign In</a>
      <a href="register.html" class="btn btn-primary btn-sm">List a Business</a>
    </div>
  </div>
`;

// Render navigation on all pages
(function renderNav() {
  const nav = document.querySelector('nav.nav-public');
  if (nav && !nav.getAttribute('data-component-loaded')) {
    nav.innerHTML = navHTML;
    nav.setAttribute('data-component-loaded', 'true');

    // Re-initialize mobile nav after rendering
    const mobileBtn = document.getElementById('nav-mobile-btn');
    const panel = document.getElementById('nav-mobile-panel');

    if (mobileBtn && panel) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
        panel.style.display = isOpen ? 'flex' : 'none';
      });

      if (window.innerWidth < 768) mobileBtn.style.display = 'block';
      window.addEventListener('resize', () => {
        mobileBtn.style.display = window.innerWidth < 768 ? 'block' : 'none';
      });
    }
  }
})();
