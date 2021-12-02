export default {
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
  }
}
