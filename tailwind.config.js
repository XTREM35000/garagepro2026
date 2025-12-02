/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // tailwind.config.js - Section colors
    extend: {
      colors: {
        // Gardez vos couleurs WhatsApp/Apple
        light: {
          background: '#F0F2F5',
          surface: '#FFFFFF',
          'surface-secondary': '#F7F9FC',
          text: '#111B21',
          'text-secondary': '#667781',
          border: '#E0E5E9',
          accent: '#25D366',
          'accent-hover': '#128C7E',
        },
        dark: {
          background: '#000000',
          surface: '#1C1C1E',
          'surface-secondary': '#2C2C2E',
          text: '#FFFFFF',
          'text-secondary': '#8E8E93',
          border: '#38383A',
          accent: '#0A84FF',
          'accent-hover': '#007AFF',
        },
        // Ajoutez les couleurs gray utilisées dans Help
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827', // C'est ce que Help utilise
          950: '#030712',
        }
      }
    }
  }
}