/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        backend: {
          primary: '#0f172a', // Slate 900
          secondary: '#1e293b', // Slate 800
          accent: '#06b6d4', // Cyan 500
          text: '#f8fafc', // Slate 50
          muted: '#94a3b8', // Slate 400
        },
        frontend: {
          primary: '#ffffff', // White
          secondary: '#f3f4f6', // Gray 100
          accent: '#a855f7', // Purple 500
          text: '#1f2937', // Gray 800
          muted: '#6b7280', // Gray 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
