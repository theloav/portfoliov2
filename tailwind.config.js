/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#05060a',
          800: '#0a0e14',
          700: '#0f141d',
          600: '#161d29',
        },
        // Signature accents
        term: '#00ff9c',   // terminal green
        cyan: '#38c2ff',   // electric cyan
        danger: '#ff4d5e', // critical red
        muted: '#7d8899',
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-term': '0 0 20px rgba(0,255,156,0.35), 0 0 4px rgba(0,255,156,0.6)',
        'glow-cyan': '0 0 20px rgba(56,194,255,0.35), 0 0 4px rgba(56,194,255,0.6)',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.82' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        flicker: 'flicker 3s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
      },
    },
  },
  plugins: [],
}
