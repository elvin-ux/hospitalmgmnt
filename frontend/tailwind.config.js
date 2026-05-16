// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: Tells Tailwind where your source files are
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // OPTIONAL: Add custom colors, fonts, or other styles here
      colors: {
        primary: '#007bff',      // Main blue for buttons/active links
        'primary-dark': '#0056b3',
        'sidebar-bg': '#ffffff',
        'main-bg': '#f4f7f9',
        'text-primary': '#334e68', // Dark text
        'text-secondary': '#8c98a4', // Gray text
      },
    },
  },
  plugins: [],
}