/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#f8f7f4',
        accent: '#ff6b35',
        supporting: '#2d5a27',
        neutral: '#6b7280',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Source Serif Pro', 'serif'],
        ui: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'stagger-in': 'staggerIn 0.6s ease forwards',
      },
      keyframes: {
        staggerIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}