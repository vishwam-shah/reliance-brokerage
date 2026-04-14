/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        surface: '#FFF8F3',
        'surface-bright': '#FFF8F3',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#FDF2E7',
        'surface-container': '#F9ECDF',
        'surface-container-high': '#F4E6D6',
        'surface-container-highest': '#F0E0CE',
        'surface-dim': '#E9D7C3',
        'surface-variant': '#F0E0CE',

        // Primary
        primary: '#000000',
        'primary-dim': '#000000',
        'on-primary': '#FFFFFF',
        'primary-container': '#E8E1DE',
        'on-primary-container': '#55514F',

        // Secondary
        secondary: '#695D52',
        'secondary-dim': '#5D5147',
        'on-secondary': '#FFF7F4',
        'secondary-container': '#F1DFD2',
        'on-secondary-container': '#5B5045',

        // Tertiary
        tertiary: '#695D56',
        'on-tertiary': '#FFF7F4',
        'tertiary-container': '#FFEDE4',

        // Accent
        accent: '#C5A059',
        'accent-dim': '#B08C42',
        'on-accent': '#FFFFFF',

        // Black & White
        black: '#1a1a1a',
        white: '#FFFFFF',

        // Text
        'on-surface': '#2F2C2A',
        'on-surface-variant': '#49413B',
        'on-background': '#2F2C2A',

        // Borders
        outline: '#7A6E62',
        'outline-variant': '#B0A395',

        // Status
        error: '#9E422C',
        'error-container': '#FE8B70',
        'on-error': '#FFF7F6',
        success: '#2D6A4F',
        warning: '#C07A00',
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
        ambient: '0 20px 40px rgba(58, 49, 37, 0.06)',
        modal: '0 20px 40px rgba(47, 44, 42, 0.12)',
        card: '0 4px 16px rgba(47, 44, 42, 0.06)',
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
