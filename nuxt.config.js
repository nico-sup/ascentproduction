// https://nuxt.com/docs/api/configuration/nuxt-config
import { fetchStoryblokRoutes } from './scripts/storyblok-routes.mjs'

const SITE_URL = 'https://ascentproduction.fr'

// Version du contenu Storyblok servie au public.
// En production : "published". Pour un déploiement de prévisualisation : STORYBLOK_VERSION=draft
const STORYBLOK_VERSION = process.env.STORYBLOK_VERSION === 'draft' ? 'draft' : 'published'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // SSR activé : chaque page est pré-générée en HTML (nuxt generate).
  // Google et les moteurs IA (ChatGPT, Perplexity, Claude…) lisent enfin le contenu.
  ssr: true,

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'author', content: 'Ascent Production' },
        { name: 'theme-color', content: '#344e41' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'google-site-verification', content: '8DLnBD6HRkhCIPw4ayfGnoY0gJ2RFZV2ySR7BJAETew' },
        { property: 'og:site_name', content: 'Ascent Production' },
        { property: 'og:locale', content: 'fr_FR' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        // Polices principales préchargées (évite le saut de texte au chargement)
        { rel: 'preload', href: '/font/Aspekta-400.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/font/JoyrideEXTItalic.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preconnect', href: 'https://a.storyblok.com' },
        // Fichier de présentation pour les moteurs IA
        { rel: 'alternate', type: 'text/markdown', href: '/llms.txt', title: 'Ascent Production – résumé pour les IA' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
      storyblokVersion: STORYBLOK_VERSION,
    },
  },

  alias: {
    '@storyblok/nuxt': require.resolve('@storyblok/nuxt'),
  },

  modules: [
    // Le token n'est plus écrit en dur : il vient de la variable d'environnement STORYBLOK_TOKEN
    ['@storyblok/nuxt', { accessToken: process.env.STORYBLOK_TOKEN }],
    '@nuxtjs/tailwindcss',
    'nuxt-swiper',
    'nuxt-aos',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: SITE_URL,
    name: 'Ascent Production',
    defaultLocale: 'fr',
  },

  sitemap: {
    autoLastmod: true,
    // Toutes les pages publiées dans Storyblok (avec leur date de mise à jour)
    urls: async () => {
      const routes = await fetchStoryblokRoutes({ token: process.env.STORYBLOK_TOKEN })
      return routes.map(r => ({ loc: r.path, lastmod: r.lastmod }))
    },
    exclude: ['/404', '/200'],
  },

  nitro: {
    // Toujours un site statique dans .output/public (sur Netlify, Nuxt choisirait sinon
    // le preset "netlify-static" qui écrit dans dist/, d'où l'erreur de déploiement)
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/contact', '/sitemap.xml'],
      failOnError: false,
    },
  },

  hooks: {
    // Pré-génère aussi les pages Storyblok qui ne sont liées nulle part
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) return
      const routes = await fetchStoryblokRoutes({ token: process.env.STORYBLOK_TOKEN })
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = [...(nitroConfig.prerender.routes || []), ...routes.map(r => r.path)]
    },
  },

  css: ['~/assets/main.scss', 'aos/dist/aos.css', 'swiper/css/pagination'],

  aos: {
    offset: 120,
    delay: 0,
    duration: 1700,
    easing: 'ease',
    once: false,
    mirror: true,
    anchorPlacement: 'top-bottom',
  },
})
