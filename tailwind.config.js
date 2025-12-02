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
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Use Inter as primary font
      },
    },
  },
  plugins: [],
}