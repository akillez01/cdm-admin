/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EEF0',
          100: '#CCDDE2',
          200: '#99BBC5',
          300: '#6699A8',
          400: '#33778B',
          500: '#003B4D', // Main primary color
          600: '#00334D',
          700: '#002A40',
          800: '#002233',
          900: '#001926',
        },
        secondary: {
          50: '#FAF6E6',
          100: '#F6ECCC',
          200: '#ECD999',
          300: '#E3C766',
          400: '#D9B433',
          500: '#D4AF37', // Main secondary color
          600: '#BF9C31',
          700: '#A68829',
          800: '#8C7322',
          900: '#735F1C',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        danger: {
          500: '#EF4444',
        },
        info: {
          500: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 59, 77, 0.1), 0 2px 4px -1px rgba(0, 59, 77, 0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};