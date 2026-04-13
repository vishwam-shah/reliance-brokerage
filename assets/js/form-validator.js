/**
 * Form Validation Module
 * Real-time validation feedback for forms
 */

(function initFormValidation() {
  const passwordInput = document.getElementById('reg-password');
  const emailInput = document.getElementById('reg-email');
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const passwordToggle = document.querySelector('[aria-label="Toggle visibility"]');

  // Password strength indicator
  if (passwordInput) {
    const strengthContainer = document.createElement('div');
    strengthContainer.id = 'password-strength';
    strengthContainer.style.cssText = 'margin-top: 0.5rem; font-size: 0.75rem; display: flex; align-items: center; gap: 0.5rem;';
    passwordInput.parentElement.appendChild(strengthContainer);

    passwordInput.addEventListener('input', function() {
      const strength = calculatePasswordStrength(this.value);
      updatePasswordStrength(strength, strengthContainer);
      updateInputState(this, this.value.length >= 8);
    });

    // Password visibility toggle
    if (passwordToggle) {
      let isVisible = false;
      passwordToggle.addEventListener('click', function(e) {
        e.preventDefault();
        isVisible = !isVisible;
        passwordInput.type = isVisible ? 'text' : 'password';
        this.querySelector('.material-symbols-outlined').textContent = isVisible ? 'visibility_off' : 'visibility';
        this.style.color = isVisible ? 'var(--primary)' : 'var(--outline)';
      });
    }
  }

  // Email validation
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
      updateInputState(this, isValid || this.value === '');
    });
  }

  // Real-time name validation
  [firstNameInput, lastNameInput].forEach(input => {
    if (input) {
      input.addEventListener('blur', function() {
        const isValid = this.value.length >= 2;
        updateInputState(this, isValid || this.value === '');
      });
    }
  });

  // Form submit validation
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      let isFormValid = true;

      // Check required fields
      const requiredInputs = this.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          updateInputState(input, false);
          isFormValid = false;
        }
      });

      // Check email format
      if (emailInput && emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        updateInputState(emailInput, false);
        isFormValid = false;
      }

      // Check password strength
      if (passwordInput && calculatePasswordStrength(passwordInput.value) < 2) {
        updateInputState(passwordInput, false);
        isFormValid = false;
      }

      if (!isFormValid) {
        e.preventDefault();
        SovToast('Please correct the errors above', 'error');
      }
    });
  }

  // Helper: Calculate password strength
  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  }

  // Helper: Update password strength display
  function updatePasswordStrength(strength, container) {
    const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#9E422C', '#C07A00', '#85796A', '#2D6A4F', '#2D6A4F'];

    const bars = Array.from({length: 4}, (_, i) =>
      `<div style="width: 8px; height: 4px; background: ${i < strength ? colors[strength-1] : '#E0D4CC'}; border-radius: 2px;"></div>`
    ).join('');

    container.innerHTML = `
      <div style="display: flex; gap: 4px;">${bars}</div>
      <span style="color: ${colors[strength-1] || '#9E422C'}; font-weight: 600;">${labels[strength] || 'No password'}</span>
    `;
  }

  // Helper: Update input state
  function updateInputState(input, isValid) {
    if (isValid) {
      input.style.borderColor = 'var(--outline-variant)';
      input.style.backgroundColor = 'var(--surface-container-lowest)';
      input.removeAttribute('aria-invalid');
    } else if (input.value) {
      input.style.borderColor = 'var(--error)';
      input.style.backgroundColor = 'rgba(158, 66, 44, 0.03)';
      input.setAttribute('aria-invalid', 'true');
    }
  }
})();
