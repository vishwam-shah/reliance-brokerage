/**
 * Footer Component
 * Renders the same footer on all pages from a single source
 * Reduces duplication and ensures consistency
 */

const footerHTML = `
  <div class="container">
    <div style="display:grid; grid-template-columns:1fr; gap:var(--space-12); gap-row: var(--space-16);" class="footer-layout">
      <style>
        .footer-layout { grid-auto-flow: row; }
        @media(min-width:768px){
          .footer-layout{
            grid-template-columns: 2fr repeat(4, 1fr);
            grid-auto-flow: column;
            gap: var(--space-8);
            gap-row: var(--space-12);
          }
        }
      </style>

      <div>
        <div class="footer-brand">Reliance Brokerage</div>
        <p class="footer-tagline">Institutional Grade Brokerage serving the Malaysian SME and corporate landscape with architectural stability and deep-rooted integrity.</p>
        <div style="display:flex; gap: var(--space-4); margin-top: var(--space-8);">
          <a href="#" aria-label="LinkedIn" style="display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:var(--primary); color:var(--on-primary); transition:opacity var(--transition-fast);" onmouseenter="this.style.opacity='0.8'" onmouseleave="this.style.opacity='1'">
            <span class="material-symbols-outlined" style="font-size:1.25rem;">language</span>
          </a>
          <a href="#" aria-label="Email" style="display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:var(--primary); color:var(--on-primary); transition:opacity var(--transition-fast);" onmouseenter="this.style.opacity='0.8'" onmouseleave="this.style.opacity='1'">
            <span class="material-symbols-outlined" style="font-size:1.25rem;">mail</span>
          </a>
        </div>
        <p class="footer-copy">© Reliance Brokerage Malaysia. All rights reserved.</p>
      </div>

      <div>
        <div class="footer-col-title">Platform</div>
        <ul class="footer-links">
          <li><a href="listings.html">Business Listings</a></li>
          <li><a href="valuations.html">Valuations</a></li>
          <li><a href="how-it-works.html">How It Works</a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a href="about.html">About Us</a></li>
          <li><a href="about.html#team">Our Team</a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">Legal</div>
        <ul class="footer-links">
          <li><a href="legal-hub.html">Legal Hub</a></li>
          <li><a href="legal-hub.html#privacy">Privacy Policy</a></li>
          <li><a href="legal-hub.html#terms">Terms of Service</a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">Access</div>
        <ul class="footer-links">
          <li><a href="sign-in.html">Sign In</a></li>
          <li><a href="register.html">Register</a></li>
          <li><a href="portal/dashboard.html">Broker Portal</a></li>
        </ul>
      </div>
    </div>
  </div>
`;

// Render footer on all pages
(function renderFooter() {
  const footer = document.querySelector('footer.site-footer');
  if (footer && !footer.getAttribute('data-component-loaded')) {
    footer.innerHTML = footerHTML;
    footer.setAttribute('data-component-loaded', 'true');
  }
})();
