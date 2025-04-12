/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'sway-normal': 'sway 4s ease-in-out infinite',
        'sway-delayed': 'sway-delayed 5s ease-in-out infinite',
        'spin-slow': 'spin-slow 10s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'pulse-glow': 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};