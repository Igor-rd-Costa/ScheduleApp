/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      textColor: {
        'main': '#FFBF00',
        'mainLight': '#FFCF00',
        'mainDark': '#DF9F00',
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      backgroundColor: {
        'main': '#FFBF00',
        'mainLight': '#FFCF00',
        'mainDark': '#DF9F00',
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      borderColor: {
        'main': '#FFBF00',
        'mainLight': '#FFCF00',
        'mainDark': '#DF9F00',
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      gradientColorStops: {
        'main': '#FFBF00',
        'mainLight': '#FFCF00',
        'mainDark': '#DF9F00',
        'golden': '#C59854',
        'goldenLight': '#CDA05C',
        'goldenDark': '#B58844'
      },
      boxShadowColor: {
        'golden': '#DDB06C'
      },
      fontFamily: {
        'arial': 'Arial'
      }
    },
  },
  plugins: [],
}

