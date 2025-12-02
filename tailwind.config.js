/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // WhatsApp Light Theme Palette
        light: {
          'background': '#F0F2F5', // WhatsApp chat bg
          'surface': '#FFFFFF', // WhatsApp message bg
          'surface-2': '#F5F6F8', // Secondary surface
          'text': '#111B21', // WhatsApp dark text
          'text-secondary': '#667781', // WhatsApp grey text
          'border': '#E0E5E9', // Light borders
          'accent': '#25D366', // WhatsApp green
          'accent-dark': '#128C7E', // Darker green
          'success': '#00A884', // WhatsApp success green
          'warning': '#FFC107',
          'error': '#F44336',
          'info': '#0088CC',
        },
        // Apple Dark Theme Palette
        dark: {
          'background': '#000000', // True black Apple style
          'surface': '#1C1C1E', // Apple dark surface
          'surface-2': '#2C2C2E', // Secondary surface
          'text': '#FFFFFF', // Pure white
          'text-secondary': '#8E8E93', // Apple grey
          'border': '#38383A', // Dark borders
          'accent': '#0A84FF', // Apple blue
          'accent-dark': '#0056CC', // Darker blue
          'success': '#30D158', // Apple green
          'warning': '#FF9F0A', // Apple orange
          'error': '#FF453A', // Apple red
          'info': '#64D2FF',
        },
        // Brand colors that work in both themes
        brand: {
          'whatsapp': '#25D366',
          'apple': '#007AFF',
          'gradient-start': '#25D366',
          'gradient-end': '#128C7E',
        }
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'DEFAULT': '14px', // Apple-style rounded corners
        'lg': '18px',
        'xl': '24px',
        '2xl': '30px',
        'full': '9999px'
      },
      boxShadow: {
        // WhatsApp light shadows
        'light-sm': '0 1px 3px rgba(0,0,0,0.08)',
        'light': '0 4px 12px rgba(0,0,0,0.05)',
        'light-lg': '0 10px 40px rgba(0,0,0,0.08)',
        // Apple dark shadows
        'dark-sm': '0 1px 3px rgba(0,0,0,0.3)',
        'dark': '0 4px 24px rgba(0,0,0,0.25)',
        'dark-lg': '0 10px 60px rgba(0,0,0,0.35)',
        // Accent shadows
        'accent': '0 0 20px rgba(37, 211, 102, 0.15)',
        'accent-dark': '0 0 30px rgba(10, 132, 255, 0.2)',
        // Neumorphism
        'neumorphism': '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
        'neumorphism-dark': '20px 20px 60px #0a0a0a, -20px -20px 60px #1e1e1e',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        'gradient-apple': 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        'gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F5F6F8 100%)',
        'grid-pattern': 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      fontFamily: {
        'sans': ['Inter', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
        'display': ['SF Pro Display', 'Inter', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}