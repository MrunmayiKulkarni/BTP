/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fbbf24',
        secondary: '#10b981',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}