/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111827', // A deep slate gray
        surface: '#1F2937',    // A lighter slate for cards/panels
        primary: {
          DEFAULT: '#3B82F6', // A vibrant blue
          hover: '#2563EB'   // A darker blue for hover
        },
        text: {
          DEFAULT: '#E5E7EB', // A soft light gray for text
          secondary: '#9CA3AF' // A dimmer gray for secondary text
        },
        border: '#374151',     // A subtle slate gray for borders
      }
    },
  },
  plugins: [],
}
