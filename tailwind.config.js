module.exports = {
  content: ['storyblok/**/*.{vue,js}', 'components/**/*.{vue,js}', 'pages/**/*.vue'],
  theme: {
    extend: {
            colors: {
              'green-ascent': 'var(--green-ascent)',
              'green-light-ascent': 'var(--green-light-ascent)',
              'black-ascent': 'var(--black-ascent)',
              'grey-ascent': 'var(--grey-ascent)',
              'grey-light-ascent': 'var(--grey-light-ascent)',
              'light-bg': 'var(--light-bg)',
            },
            fontFamily: {
              chewy: ['"Chewy"', "sans-serif"],
              barlowCondensed: ['"BarlowCondensed"', "sans-serif"],
          },
        }
  },
}
