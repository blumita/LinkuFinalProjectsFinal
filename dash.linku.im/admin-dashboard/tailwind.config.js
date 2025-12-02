import scrollbar from 'tailwind-scrollbar'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'shabnam': ['Shabnam', 'Tahoma', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [
    scrollbar({ nocompatible: true }),
  ],
}
