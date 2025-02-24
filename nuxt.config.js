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
      title: "Production Vidéo, Drone, photographe, montage et création de site internet - Ascent Production",
      meta: [
        { name: "description", content: "Experts en production vidéo, photographie professionnelle, captation drone et création de sites internet. Nous vous accompagnons dans la réalisation de vidéos créatives, de prises de vue aériennes spectaculaires, ainsi que dans la création de sites web sur mesure qui mettent en valeur votre entreprise. Que ce soit pour des événements, des films d'entreprise, des vidéos publicitaires ou la conception d'un site performant et responsive, notre équipe utilise des outils de pointe pour offrir des solutions visuelles et digitales qui répondent parfaitement à vos besoins."  },
        { name: "keywords", content: "production vidéo, drone, photographie, montage, vidéo 4K, films entreprises, création site internet, développeur web, événementiel, drone fpv, podcast" },
        { name: "author", content: "Ascent Production" },
        { meta: "google-site-verification", content:"8DLnBD6HRkhCIPw4ayfGnoY0gJ2RFZV2ySR7BJAETew"}
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
