/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#E26A45',
        'brand-beige': '#F5F2ED',
      },
    },
  },
  plugins: [],
}