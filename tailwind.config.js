/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './public/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cornflower blue — exact globe color from logo (PRIMARY)
        terracotta: {
          50:  '#EBF3FB',
          100: '#CCE1F5',
          200: '#9DC4EC',
          300: '#6EA6E2',
          400: '#5897DC',
          500: '#4A90D9',   // ← logo globe blue
          600: '#3070B8',
          700: '#245490',
          800: '#193B68',
          900: '#0E2240',
        },
        // Logo green — exact ribbon/banner color (ACCENT)
        gold: {
          50:  '#E8F5E9',
          100: '#C8E6CA',
          200: '#A5D6A7',
          300: '#6DBF70',
          400: '#43A847',
          500: '#2D7D32',   // ← logo ribbon green
          600: '#256828',
          700: '#1B521E',
          800: '#123D15',
          900: '#09270D',
        },
        // Deep green — darker shade for section backgrounds
        forest: {
          50:  '#E8F5E9',
          100: '#C8E6CA',
          200: '#A5D6A7',
          300: '#6DBF70',
          400: '#43A847',
          500: '#2D7D32',
          600: '#256828',
          700: '#1B521E',
          800: '#123D15',
          900: '#09270D',
        },
        // Deep navy — dark backgrounds (from shield base)
        bark: {
          50:  '#E8EBF5',
          100: '#C4CCE6',
          200: '#899BCF',
          300: '#4E6AB7',
          400: '#2744A0',
          DEFAULT: '#0D1B3E',
          600: '#0A1530',
          700: '#080F22',
          800: '#050A16',
          900: '#02050B',
        },
        // Off-white background with slight blue tint
        cream: '#F4F8FF',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.9s ease forwards',
        'fade-in':    'fadeIn 1s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
