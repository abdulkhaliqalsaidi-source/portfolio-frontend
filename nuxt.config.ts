// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-11',

  // Nuxt 4 Architecture & Structure
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: false },
  telemetry: false,

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
      title: 'الملف المهني ومعرض الأعمال | Professional Portfolio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0B0F19' },
        { name: 'google-site-verification', content: '7nXhc3IexdOX9noZEXPCk39Vucx9g2XI_o3Fd4SvZaU' },
        { name: 'description', content: 'الموقع الشخصي ومعرض الأعمال والخدمات المهنية والاستشارية.' },
        { name: 'keywords', content: 'معرض أعمال, سيرة ذاتية, خدمات واستشارات, Portfolio, Professional Services' },
        { name: 'author', content: 'Professional Portfolio' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'geo.region', content: 'YE-SN' },
        { name: 'geo.placename', content: 'صنعاء، اليمن' },
        { name: 'geo.position', content: '15.3694;44.1910' },
        { name: 'ICBM', content: '15.3694, 44.1910' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap' }
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
    apiServerUrl: process.env.NUXT_API_SERVER_URL || process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://portfolio-backend-1kar.onrender.com/api' : 'http://127.0.0.1:8000/api'),
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://portfolio-backend-1kar.onrender.com/api' : 'http://127.0.0.1:8000/api'),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://portfolio-frontend-pink-mu.vercel.app'
    }
  },

  // Hybrid Rendering Rules
  routeRules: {
    '/': { swr: false },
    '/projects': { swr: false },
    '/projects/**': { swr: false },
    '/blog': { swr: false },
    '/blog/**': { swr: false },
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
