// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-11',

  // Nuxt 4 Architecture & Structure
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'ar',
        dir: 'rtl'
      },
      title: 'عبد الخالق الصايدي | مهندس برمجيات متكامل',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0B0F19' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap' }
      ]
    }
  },

  css: [
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/styles',
    '~/assets/css/main.css'
  ],

  build: {
    transpile: ['vuetify']
  },

  runtimeConfig: {
    apiServerUrl: process.env.NUXT_API_SERVER_URL || 'http://127.0.0.1:8000/api',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  // Hybrid Rendering Rules
  routeRules: {
    '/': { prerender: true },
    '/projects': { swr: 3600 },
    '/projects/**': { swr: 3600 },
    '/blog': { swr: 3600 },
    '/blog/**': { swr: 3600 },
    '/admin/**': { ssr: false },
    '/project': { redirect: { to: '/projects', statusCode: 301 } },
    '/project/**': { redirect: { to: '/projects', statusCode: 301 } }
  },

  nitro: {
    compressPublicAssets: true
  },

  vite: {
    ssr: {
      noExternal: ['vuetify']
    }
  }
})
