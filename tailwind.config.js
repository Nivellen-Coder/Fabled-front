/** @type {import('tailwindcss').Config} */
module.exports = {
  // tailwind.config.js
  darkMode: 'class',

  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('flowbite/plugin')
  ],
}

