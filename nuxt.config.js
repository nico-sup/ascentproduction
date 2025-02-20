// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  postcss: {
    plugins: {
      'postcss-nested': {},
    }
  },
  
  app: {
    head: {
      title: "Production Vidéo & Drone - Studio Pro",
      meta: [
        { name: "description", content: "Experts en production vidéo, photographie et captation drone." },
        { name: "keywords", content: "production vidéo, drone, photographie, montage, vidéo 4K" },
        { name: "author", content: "Nom de ton entreprise" }
      ]
    }
  },

  alias: {
    assets: "/<rootDir>/assets",
    '@storyblok/nuxt': require.resolve('@storyblok/nuxt')
  },

  modules: [
    ["@storyblok/nuxt", { accessToken: process.env.STORYBLOK_TOKEN}],
    '@nuxtjs/tailwindcss',
    'nuxt-swiper',
    'nuxt-lazy-load',
    'nuxt-aos',
  ],

  css: ['~/assets/main.scss', 'aos/dist/aos.css', 'swiper/css/pagination'],
  ssr: false,

  aos: {
    offset: 120, // Ajustez pour un déclenchement plus sensible
    delay: 0,
    duration: 1700,
    easing: 'ease',
    once: false, // Permet les répétitions
    mirror: true, // Active l'animation au scroll vers le haut
    anchorPlacement: 'top-bottom', 
  },
})
