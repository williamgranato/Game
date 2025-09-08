module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseGrow: {
          '0%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(1.02)' },
          '100%': { transform: 'scaleX(1)' },
        }
      },
      animation: {
        pulseGrow: 'pulseGrow 600ms ease-in-out',
      }
    },
  },
  plugins: [],
};