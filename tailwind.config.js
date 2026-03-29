/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'Manrope', 'Segoe UI', 'sans-serif'],
        display: ['Rajdhani', 'Sora', 'sans-serif'],
      },
      colors: {
        dv: {
          background: '#070D1E',
          backgroundSoft: '#0A1228',
          surface: '#101A34',
          surfaceAlt: '#16223F',
          nav: '#0D1630',
          border: '#253153',
          text: '#EAF1FF',
          textMuted: '#B1BEDD',
          textSoft: '#7E90BA',
          red: '#E24B62',
          redDark: '#A9223A',
          blue: '#4B8DFF',
          blueDark: '#2F62C0',
          green: '#3DAF62',
          greenDark: '#2A7D45',
          gold: '#D0A74E',
          goldDark: '#9A7632',
          lime: '#7EE4A1',
        },
      },
      boxShadow: {
        'card-dark': '0 20px 40px rgba(3, 8, 23, 0.45)',
        'glow-blue': '0 0 0 1px rgba(79, 122, 220, 0.28), 0 18px 38px rgba(24, 43, 88, 0.5)',
      },
    },
  },
  plugins: [],
}

