/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // your app folder
    "./pages/**/*.{js,ts,jsx,tsx}",      // optional if using pages
    "./components/**/*.{js,ts,jsx,tsx}"  // optional
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui'],
      },
    },
    screens: {
      'ipad': '1370px', // new breakpoint for iPad Pro landscape
      '2xl': '1536px',
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
