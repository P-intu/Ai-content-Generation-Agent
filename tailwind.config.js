/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#15142B',
          50: '#EEEEF4',
          100: '#D6D5E6',
          200: '#ADABCE',
          300: '#8481B5',
          400: '#5B579D',
          500: '#3A3670',
          600: '#26234E',
          700: '#1D1B3D',
          800: '#15142B',
          900: '#0D0C1A',
        },
        paper: {
          DEFAULT: '#F7F7F3',
          dim: '#ECEBE4',
        },
        signal: {
          DEFAULT: '#4B3FE4',
          50: '#EEECFD',
          100: '#D9D4FB',
          400: '#6E62EA',
          500: '#4B3FE4',
          600: '#3A2FC0',
          700: '#2C2494',
        },
        citrus: {
          DEFAULT: '#D7E86B',
          400: '#E2EF8B',
          500: '#D7E86B',
          600: '#BFD24C',
        },
        coral: {
          DEFAULT: '#FF6B5E',
          500: '#FF6B5E',
          600: '#E5493B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        typewriter: {
          '0%': { width: '0%' },
          '60%': { width: '100%' },
          '90%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
      animation: {
        drift: 'drift 6s ease-in-out infinite',
        'drift-slow': 'drift 9s ease-in-out infinite',
        blink: 'blink 1s step-start infinite',
        typewriter: 'typewriter 8s steps(30) infinite',
      },
    },
  },
  plugins: [],
}
