module.exports = {
  mode: 'jit',
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'header': '#0f4c81'
    }),
    extend: {
      height: {
        '56px': '56px'
      },
      width: {
        '56px': '56px',
        '100px': '100px'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
