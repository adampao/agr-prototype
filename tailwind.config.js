/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'aegeanBlue': '#1E4B8C',
        'oliveGold': '#C5A572',
        // Secondary Colors
        'marbleWhite': '#F5F4F0',
        'philosophicalPurple': '#614B79',
        // Accent Colors
        'oracleGreen': '#39725E',
        'terracotta': '#C24D2C',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Spectral', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'monospace'],
        display: ['Spectral', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            h1: {
              fontFamily: 'Spectral, serif',
              fontWeight: '500',
              letterSpacing: '-0.025em',
            },
            h2: {
              fontFamily: 'Spectral, serif',
              fontWeight: '500',
              letterSpacing: '-0.025em',
            },
            h3: {
              fontFamily: 'Spectral, serif',
              fontWeight: '500',
            },
            h4: {
              fontWeight: '600',
            },
            a: {
              color: '#1E4B8C',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: '#C5A572',
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: '2px',
              },
            },
            blockquote: {
              fontFamily: 'Spectral, serif',
              fontStyle: 'italic',
              fontWeight: '300',
            },
            code: {
              fontFamily: 'JetBrains Mono, monospace',
            },
            pre: {
              fontFamily: 'JetBrains Mono, monospace',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}