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
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
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
            a: {
              color: '#1E4B8C',
              '&:hover': {
                color: '#C5A572',
              },
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