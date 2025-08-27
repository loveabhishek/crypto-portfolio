/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scan all React files for Tailwind classes
  ],
  theme: {
    extend: {}, // you can customize colors, fonts, spacing here
  },
  plugins: [], // optional plugins
};
