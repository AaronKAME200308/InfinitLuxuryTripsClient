/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97A',
          dark:    '#A8832A',
        },
        royal: {
          DEFAULT: '#1E1B6B',
          dark:    '#13104A',
        },
        cream: {
          DEFAULT: '#FAF7F0',
          dark:    '#F0EDE4',
        },
        ilt: {
          dark:       '#0D0D0D',
          gray:       '#666666',
          'light-gray': '#F5F2EA',
        },
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.4em',
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #C9A84C, #E8C97A)',
        'royal-gradient': 'linear-gradient(135deg, #1E1B6B, #13104A)',
      },
      boxShadow: {
        'gold-sm': '0 4px 20px rgba(201,168,76,0.3)',
        'gold-md': '0 6px 32px rgba(201,168,76,0.45)',
        'card':    '0 4px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.14)',
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
