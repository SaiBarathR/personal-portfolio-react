export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'default': ['"Neue Montreal"', 'sans-serif'],
      'monospace': ['"Neue Montreal Monospace"', 'monospace'],
    },
    extend: {
      fontSize: {
        'default': '14px',
      },
      fontWeight: {
        'default': '400'
      },
      lineHeight: {
        'default': '14px',
      },
      animation: {
        'appear-smooth': 'appear .7s ease-in-out forwards',
        'disappear-smooth': 'disappear .7s ease-in-out forwards',
      },
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        disappear: {
          '0%': {
            opacity: 1,
          },
          '30%': {
            opacity: 0.2,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
    }
  },
  darkMode: "class"
}

