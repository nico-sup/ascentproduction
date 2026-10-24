module.exports = {
  content: ['storyblok/**/*.{vue,js}', 'components/**/*.{vue,js}', 'pages/**/*.vue', 'app.vue', 'error.vue'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        basalt: 'var(--basalt)',
        moss: 'var(--moss)',
        sage: 'var(--sage)',
        stone: 'var(--stone)',
        ember: 'var(--ember)',
        // anciens noms, toujours utilisés dans certains blocs
        'green-ascent': 'var(--green-ascent)',
        'green-light-ascent': 'var(--green-light-ascent)',
        'black-ascent': 'var(--black-ascent)',
        'grey-ascent': 'var(--grey-ascent)',
        'grey-light-ascent': 'var(--grey-light-ascent)',
        'light-bg': 'var(--light-bg)',
        'blue-ascent': 'var(--blue-ascent)',
      },
      fontFamily: {
        display: ['"Cormorant"', 'Georgia', 'serif'],
        sans: ['"Aspekta"', 'system-ui', 'sans-serif'],
        // ancien nom conservé : pointe maintenant vers la serif éditoriale
        cormorant: ['"Cormorant"', 'Georgia', 'serif'],
        barlowCondensed: ['"Aspekta"', 'sans-serif'],
      },
    },
  },
}
