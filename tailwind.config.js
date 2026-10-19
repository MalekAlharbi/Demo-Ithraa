/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'Tajawal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          50: '#f3f8f7',
          100: '#e5efed',
          200: '#cfdfdd',
          300: '#b1c9c7',
          400: '#829f9d',
          500: '#587b7a',
          600: '#3d6363',
          700: '#294e50',
          800: '#1c3f41',
          900: '#123538',
          950: '#09282b',
        },
        brand: {
          50: '#e6f4f3',
          100: '#cce9e8',
          200: '#99d3d2',
          300: '#66bdbc',
          400: '#33a7a9',
          500: '#008186',
          600: '#006c72',
          700: '#00585e',
          800: '#00464b',
          900: '#00363b',
        },
        turquoise: {
          50: '#e6f8f6',
          100: '#ccf1ed',
          500: '#00b5a4',
          600: '#009b8e',
        },
        sand: {
          50: '#f8f4ef',
          100: '#eee5da',
          500: '#c19f79',
          600: '#a98762',
        },
        emerald: {
          50: '#e6f8f6',
          100: '#ccf1ed',
          700: '#006c72',
          800: '#00585e',
        },
        sky: {
          50: '#e6f8f6',
          100: '#ccf1ed',
          700: '#007c7c',
          800: '#006363',
        },
        amber: {
          50: '#f8f4ef',
          100: '#eee5da',
          200: '#dfcbb4',
          700: '#8b6846',
          800: '#705237',
        },
      },
      boxShadow: {
        soft: '0 12px 32px rgba(0, 72, 77, 0.08)',
        card: '0 18px 48px rgba(0, 72, 77, 0.11)',
      },
    },
  },
  plugins: [],
};
