/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JavaScript, JSX, TypeScript, and TSX files in the `src` folder
  ],
  theme: {
    extend: {}, // Extend the default Tailwind theme (e.g., custom colors, fonts)
  },
  plugins: [], // Add Tailwind CSS plugins here
};