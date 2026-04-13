/**
 * Utility Functions
 */

// Update copyright year dynamically
(function updateCopyright() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = el.textContent.replace(/©\s*\d{4}/, `© ${year}`);
  });
})();

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
