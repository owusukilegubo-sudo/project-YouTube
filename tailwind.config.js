export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fluent: {
          bg: '#121214',
          surface: '#1c1c21',
          card: '#27272a80',
          accent: '#0078d4',
          accentHover: '#106ebe',
          accentLight: '#2b88d8',
          border: '#3f3f46',
          subtle: '#71717a',
          text: '#f4f4f5',
          muted: '#a1a1aa'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
