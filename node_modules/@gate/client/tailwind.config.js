/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        gate: {
          bg: '#0A0B0F',
          surface: '#12141A',
          card: '#1A1D26',
          border: '#252836',
          primary: '#6C63FF',
          accent: '#00D4AA',
          warn: '#FF6B6B',
          gold: '#FFD166',
          text: '#E8EAF0',
          muted: '#6B7280',
        },
      },
      backgroundImage: {
        'gate-gradient': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(0,212,170,0.05) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'count-up': 'countUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(108,99,255,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(108,99,255,0.7)' },
        },
      },
    },
  },
  plugins: [],
};
