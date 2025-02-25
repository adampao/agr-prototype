/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        aegeanBlue: '#1E4B8C',
        oliveGold: '#C5A572',
        
        // Secondary Colors
        marbleWhite: '#F5F4F0',
        philosophicalPurple: '#614B79',
        
        // Accent Colors
        oracleGreen: '#39725E',
        terracotta: '#C24D2C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'greek-pattern': "url('/src/assets/greek-pattern.png')",
      },
    },
  },
  plugins: [],
}