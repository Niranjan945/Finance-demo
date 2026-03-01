/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Razorpay-inspired palette
        rzp: {
          bg: '#F4F8FB',       // Very light blue/gray for the app background
          card: '#FFFFFF',     // Pure white for symmetric cards
          primary: '#0D2366',  // Deep navy blue for headings/trust
          accent: '#2D68FE',   // Bright, crisp blue for primary buttons
          text: '#515978',     // Muted slate for secondary text
          border: '#E2E8F0',   // Subtle borders
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean, readable fintech font
      }
    },
  },
  plugins: [],
}