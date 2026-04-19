/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './public/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50:  '#FDF1EB',
          100: '#F9D9CB',
          200: '#F3B398',
          300: '#E98D64',
          400: '#D96A3B',
          500: '#8C3A1E',
          600: '#752F18',
          700: '#5E2513',
          800: '#461B0E',
          900: '#2F1209',
        },
        gold: {
          50:  '#FDF8E8',
          100: '#FAEDC4',
          200: '#F5D88A',
          300: '#EFC14E',
          400: '#E6A820',
          500: '#C9920A',
          600: '#A87608',
          700: '#875E06',
          800: '#664704',
          900: '#443003',
        },
        forest: {
          50:  '#EBF4EA',
          100: '#CFE5CE',
          200: '#A1CC9E',
          300: '#74B26E',
          400: '#479944',
          500: '#2E5C28',
          600: '#264D21',
          700: '#1E3E1A',
          800: '#162E13',
          900: '#0E1E0C',
        },
        cream: '#FAF6EF',
        bark: {
          50:  '#F5EDEA',
          100: '#E4CFC8',
          200: '#C9A096',
          300: '#AD7264',
          400: '#924539',
          DEFAULT: '#2C1810',
          600: '#241410',
          700: '#1C100C',
          800: '#140C08',
          900: '#0C0804',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'fade-in':    'fadeIn 1s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
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
