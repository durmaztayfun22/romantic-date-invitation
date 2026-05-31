import type { Config } from 'tailwindcss'

export default <Config>{
  content: [],
  theme: {
    extend: {
      colors: {
        romantic: {
          50: '#fff5f7',
          100: '#ffe4e9',
          200: '#fecdd6',
          300: '#fea3b4',
          400: '#fb7185',
          500: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Fredoka', 'sans-serif'],
        cursive: ['Sacramento', 'cursive']
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' }
        }
      }
    },
  },
  plugins: [],
}