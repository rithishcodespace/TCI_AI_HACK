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
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#5542f6',
          700: '#4834e2',
          800: '#3b2bb9',
          900: '#322596',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        'floating': '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 1px 1px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}
