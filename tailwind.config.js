/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces — soft off-white, neutral cool tones
        surface: '#FAFAF7',
        'surface-bright': '#FFFFFF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F5F5F1',
        'surface-container': '#F1F1ED',
        'surface-container-high': '#EAEAE6',
        'surface-container-highest': '#E2E2DE',
        'surface-dim': '#D4D4D0',
        'surface-variant': '#EAEAE6',

        // Primary — deep slate (more refined than pure black)
        primary: '#0F172A',
        'primary-dim': '#1E293B',
        'on-primary': '#FFFFFF',
        'primary-container': '#E2E8F0',
        'on-primary-container': '#334155',

        // Secondary — warm sand for subtle contrast
        secondary: '#475569',
        'secondary-dim': '#334155',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#F1F5F9',
        'on-secondary-container': '#334155',

        // Tertiary
        tertiary: '#64748B',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#F1F5F9',

        // Accent — refined gold (desaturated, mature)
        accent: '#B8893E',
        'accent-dim': '#9C7330',
        'on-accent': '#FFFFFF',

        // Black & White
        black: '#0F172A',
        white: '#FFFFFF',

        // Text — true neutral grays
        'on-surface': '#0F172A',
        'on-surface-variant': '#64748B',
        'on-background': '#0F172A',

        // Borders — subtle cool gray
        outline: '#94A3B8',
        'outline-variant': '#E2E8F0',

        // Status — modern, vibrant
        error: '#DC2626',
        'error-container': '#FEE2E2',
        'on-error': '#FFFFFF',
        success: '#059669',
        warning: '#D97706',
      },
      fontFamily: {
        headline: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Lexend', 'system-ui', 'sans-serif'],
        label: ['Lexend', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display
        'display-lg': ['3.5rem', { lineHeight: '1.1' }],
        'display-md': ['2.75rem', { lineHeight: '1.1' }],
        'display-sm': ['2.25rem', { lineHeight: '1.1' }],

        // Headline
        'headline-lg': ['2rem', { lineHeight: '1.1' }],
        'headline-md': ['1.75rem', { lineHeight: '1.1' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.1' }],

        // Title
        'title-lg': ['1.25rem', { lineHeight: '1.4' }],
        'title-md': ['1rem', { lineHeight: '1.4' }],
        'title-sm': ['0.875rem', { lineHeight: '1.4' }],

        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.7' }],

        // Label
        'label-lg': ['0.875rem', { lineHeight: '1.4' }],
        'label-md': ['0.75rem', { lineHeight: '1.4' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.4' }],
        'label-xs': ['0.625rem', { lineHeight: '1.4' }],
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
        40: '10rem',
      },
      borderRadius: {
        none: '0px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(15, 23, 42, 0.04)',
        modal: '0 20px 50px rgba(15, 23, 42, 0.10), 0 8px 16px rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)',
        elevated: '0 4px 12px rgba(15, 23, 42, 0.06), 0 2px 4px rgba(15, 23, 42, 0.04)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        base: 'cubic-bezier(0, 0, 0.2, 1)',
        slow: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      zIndex: {
        nav: '50',
        modal: '100',
        toast: '200',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
