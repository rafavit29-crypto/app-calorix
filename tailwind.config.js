/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using a class
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3A7AFE', // Accent blue
        secondary: '#14C57C', // Accent green (optional, for contrast)
        background: {
          light: '#f8fafc', // Very light gray
          dark: '#1a202c', // Dark gray for dark mode background
        },
        emerald: { // Added for onboarding background
          50: '#ecfdf5',
          700: '#047857',
          400: '#34d399',
          900: '#064e3b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Use Inter as primary font
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in-right 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}