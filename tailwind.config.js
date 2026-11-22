/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#0F4D3F',  /* Deep emerald from image */
          850: '#0B3E33',
          900: '#0A342B',  /* Deepest hero green */
          950: '#06201A',
        },
        accent: {
          gold: '#F59E0B',
          yellow: '#FBBF24',
          amber: '#D97706',
          lightYellow: '#FEF3C7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(10, 62, 51, 0.08), 0 4px 6px -2px rgba(10, 62, 51, 0.04)',
        'card': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'hero': '0 25px 50px -12px rgba(10, 62, 51, 0.25)',
      }
    },
  },
  plugins: [],
}
