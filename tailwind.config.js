/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        brand: {
          50: '#f3fbf6',
          100: '#e6f7ed',
          200: '#bfefd5',
          300: '#9be6be',
          400: '#59d097',
          500: '#25d366', // primary green
          600: '#20b95a',
          700: '#188646',
          800: '#0f4f2a',
        },
        indigoish: {
          500: '#4f46e5',
          700: '#3730a3'
        },
        surface: {
          DEFAULT: 'hsl(210 14% 98%)',
          muted: 'hsl(210 14% 88%)'
        },
        'glass-1': 'rgba(255,255,255,0.6)',
        'glass-2': 'rgba(10,10,10,0.4)'
      },
      borderRadius: {
        lg: '16px',
        xl: '20px',
        '2xl': '28px'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(8,10,15,0.06)',
        card: '0 14px 48px rgba(8,10,20,0.08)',
        greenGlow: '0 8px 30px rgba(37,211,102,0.12)'
      },
      transitionTimingFunction: { 'spring-soft': 'cubic-bezier(.2,.9,.3,1)' },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto']
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}