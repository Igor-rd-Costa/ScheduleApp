/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      screens: {
        'xsm': '400px'
      },
      textColor: {
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      backgroundColor: {
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      borderColor: {
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      gradientColorStops: {
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      boxShadowColor: {
        'golden': '#DDB06C'
      },
      fontFamily: {
        'arial': 'Arial'
      },
      boxShadow: {
        'card': '2px 2px 5px 1px #11111155'
      }
    },
  },
  plugins: [],
}

