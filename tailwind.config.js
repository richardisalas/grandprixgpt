/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: 0.6,
            transform: 'scale(0.8)',
          },
          '50%': {
            opacity: 1,
            transform: 'scale(1.2)',
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'inherit',
            h1: {
              fontWeight: '700',
              fontSize: '1.5rem', 
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.25rem',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.125rem',
            },
            strong: {
              fontWeight: '600',
            },
            'ul > li': {
              paddingLeft: '1.25em',
              position: 'relative',
            },
            'ul > li::before': {
              content: '"•"',
              position: 'absolute',
              left: 0,
              paddingRight: '0.75em',
            }
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

