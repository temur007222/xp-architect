/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#006B5E',
          med: '#028090',
          light: '#E8F4F2',
          faint: '#F4F8F9',
        },
        pink: {
          DEFAULT: '#F5E6F0',
          acc: '#D9A7C7',
        },
        dark: '#1A2E2C',
        bg: '#0D1F1D',
        gray: {
          DEFAULT: '#5A6A68',
          light: '#C8D0CF',
          line: '#D6DDE0',
        },
        warn: '#E07A3E',
        good: '#3FA068',
        bad: '#C04848',
        evstory: '#8C5AB7',
        evrest: '#5A8FB7',
        evpuzzle: '#B79A5A',
        evsecret: '#5A6A68',
      },
      fontFamily: {
        sans: ['-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
