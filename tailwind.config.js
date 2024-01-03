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
      }
    }
  },
  darkMode: "class"
}

