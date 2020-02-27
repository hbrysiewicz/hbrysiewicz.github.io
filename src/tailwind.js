const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    fontFamily: {
      serif: [
        'clarendon-urw',
        ...defaultTheme.fontFamily.serif
      ],

      sans: [
        'adelle-sans',
        ...defaultTheme.fontFamily.sans
      ],

      body: [ 'adelle-sans', 'sans' ],
    },

    fontWeight: {
      'hairline': 100,
      'thin': 200,
      'light': 300,
      'normal': 400,
      'medium': 500,
      'semibold': 600,
      'bold': 700,
      'extrabold': 800,
      'black': 900,
    },

    extend: {
      colors: {
        'code-gray': '#f5f2f0'
      }
    }
  },

  variants: {
    variants: ['responsive'],
    backgroundColors: ['responsive', 'hover', 'focus'],
    borderColors: ['responsive', 'hover', 'focus'],
    fontWeights: ['responsive', 'hover', 'focus'],
    shadows: ['responsive', 'hover', 'focus'],
    textColors: ['responsive', 'hover', 'focus'],
    textStyle: ['responsive', 'hover', 'focus'],
  },

  plugins: []
}
