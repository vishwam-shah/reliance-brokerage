/**
 * Event Handlers - Centralized event listener management
 * Replaces all inline onmouseenter/onmouseleave/onclick handlers with external JS
 */

function getCSSVariable(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

document.addEventListener('DOMContentLoaded', () => {
  // Card box shadow hover effects
  const cardShadowElements = document.querySelectorAll('.card-shadow-hover');
  cardShadowElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = 'var(--shadow-modal)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = 'none';
    });
  });

  // Image scale hover effects (simple scale)
  const imageScaleElements = document.querySelectorAll('.image-scale-hover');
  imageScaleElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.04)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });
  });

  // Image filter + scale hover effects (grayscale)
  const imageFilterScaleElements = document.querySelectorAll('.image-filter-scale-hover');
  imageFilterScaleElements.forEach((el) => {
    const origFilter = el.style.filter || 'grayscale(20%)';
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.04)';
      el.style.filter = 'grayscale(0%)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.filter = origFilter;
    });
  });

  // Grayscale filter hover effects (class-based)
  const grayscaleHoverElements = document.querySelectorAll('.grayscale-hover');
  grayscaleHoverElements.forEach((el) => {
    const originalFilter = el.style.filter || 'grayscale(100%)';
    el.addEventListener('mouseenter', () => {
      el.style.filter = 'grayscale(0%)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.filter = originalFilter;
    });
  });

  // Social icon opacity hover effects
  const socialIconElements = document.querySelectorAll('.social-icon-hover');
  socialIconElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      el.style.opacity = '1';
    });
  });

  // Process step background hover effects
  const processSteps = document.querySelectorAll('[data-hover-bg-primary]');
  processSteps.forEach((el) => {
    const originalBg = el.style.background;
    const originalColor = el.style.color;
    el.addEventListener('mouseenter', () => {
      el.style.background = 'var(--primary)';
      el.style.color = 'var(--on-primary)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.background = originalBg;
      el.style.color = originalColor;
    });
  });

  // Grayscale filter hover effects (data attribute)
  const grayscaleElements = document.querySelectorAll('[data-hover-grayscale]');
  grayscaleElements.forEach((el) => {
    const targetFilter = el.dataset.hoverGrayscale || '0%';
    const originalFilter = el.style.filter || 'grayscale(100%)';
    el.addEventListener('mouseenter', () => {
      el.style.filter = `grayscale(${targetFilter})`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.filter = originalFilter;
    });
  });

  // Background color hover effects
  const bgHoverElements = document.querySelectorAll('[data-hover-bg]');
  bgHoverElements.forEach((el) => {
    const hoverColor = el.dataset.hoverBg;
    const originalBg = el.style.background || window.getComputedStyle(el).backgroundColor;
    const hoverColor2 = el.dataset.hoverColor || null;
    el.addEventListener('mouseenter', () => {
      el.style.background = hoverColor;
      if (hoverColor2) el.style.color = hoverColor2;
    });
    el.addEventListener('mouseleave', () => {
      el.style.background = originalBg;
      if (hoverColor2) el.style.color = '';
    });
  });

  // Box shadow hover effects
  const shadowElements = document.querySelectorAll('[data-hover-shadow]');
  shadowElements.forEach((el) => {
    const shadowValue = el.dataset.hoverShadow || 'var(--shadow-modal)';
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = shadowValue;
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = 'none';
    });
  });

  // Scale transform effects
  const scaleElements = document.querySelectorAll('[data-hover-scale]');
  scaleElements.forEach((el) => {
    const scaleValue = el.dataset.hoverScale || '1.03';
    el.addEventListener('mouseenter', () => {
      el.style.transform = `scale(${scaleValue})`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });
  });

  // Combined filter and transform effects (image overlays)
  const filterScaleElements = document.querySelectorAll('[data-hover-filter-scale]');
  filterScaleElements.forEach((el) => {
    const [filter, scale] = el.dataset.hoverFilterScale.split(',');
    const origFilter = el.style.filter || 'grayscale(20%)';
    el.addEventListener('mouseenter', () => {
      el.style.transform = `scale(${scale})`;
      el.style.filter = `grayscale(${filter})`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.filter = origFilter;
    });
  });

  // Opacity hover effects
  const opacityElements = document.querySelectorAll('[data-hover-opacity]');
  opacityElements.forEach((el) => {
    const hoverOpacity = el.dataset.hoverOpacity || '0.8';
    el.addEventListener('mouseenter', () => {
      el.style.opacity = hoverOpacity;
    });
    el.addEventListener('mouseleave', () => {
      el.style.opacity = '1';
    });
  });

  // Text color hover effects
  const colorElements = document.querySelectorAll('[data-hover-text-color]');
  colorElements.forEach((el) => {
    const hoverColor = el.dataset.hoverTextColor;
    const originalColor = window.getComputedStyle(el).color;
    el.addEventListener('mouseenter', () => {
      el.style.color = hoverColor;
    });
    el.addEventListener('mouseleave', () => {
      el.style.color = originalColor;
    });
  });

  // Form submit handlers
  const signInForm = document.getElementById('sign-in-form');
  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'portal/dashboard.html';
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'portal/dashboard.html';
    });
  }

  const resetForm = document.getElementById('reset-form');
  if (resetForm) {
    resetForm.addEventListener('submit', handleReset);
  }

  // Role selection for register page
  const roleBuyerBtn = document.getElementById('role-buyer');
  const roleSellerBtn = document.getElementById('role-seller');
  if (roleBuyerBtn && roleSellerBtn) {
    window.selectRole = function (role) {
      roleBuyerBtn.style.borderColor = role === 'buyer' ? 'var(--primary)' : 'transparent';
      roleSellerBtn.style.borderColor = role === 'seller' ? 'var(--primary)' : 'transparent';
    };
  }

  // Toast notifications
  const toastButtons = document.querySelectorAll('[data-toast]');
  toastButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const message = btn.dataset.toast;
      const type = btn.dataset.toastType || 'info';
      if (window.SovToast) {
        window.SovToast(message, type);
      }
    });
  });

  // Navigation button clicks
  const navButtons = document.querySelectorAll('[data-nav-click]');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = btn.dataset.navClick;
    });
  });
});

// Reset form handler (if handleReset is needed)
function handleReset(event) {
  event.preventDefault();
  // Add reset logic here if needed
  console.log('Reset form submitted');
}
