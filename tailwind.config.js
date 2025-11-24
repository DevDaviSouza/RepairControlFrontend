/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dv: {
          background: '#1B1C1F',
          surface: '#24252B',
          surfaceAlt: '#2E2F36',
          nav: '#1F2024',
          border: '#3C3D45',
          text: '#F5F5F5',
          textMuted: '#C5C5CC',
          textSoft: '#9D9DA4',
          red: '#6F0B14',
          redDark: '#4F050A',
          blue: '#0B3F91',
          blueDark: '#062B63',
          green: '#1D5D12',
          greenDark: '#123E0A',
          gold: '#8E6B0C',
          goldDark: '#5F4707',
          lime: '#9BFF9D',
        },
      },
      boxShadow: {
        'card-dark': '0 12px 30px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}

