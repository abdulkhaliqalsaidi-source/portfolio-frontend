import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    locale: {
      rtl: { ar: true },
      locale: 'ar'
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            background:        '#0B1518',
            surface:           '#142326',
            'surface-bright':  '#243638',
            'surface-light':   '#192A2C',
            'surface-variant': '#101E21',
            primary:   '#76D9C3',
            secondary: '#A6B9E8',
            success:   '#76D9C3',
            error:     '#FF8179',
          }
        },
        light: {
          dark: false,
          colors: {
            background:        '#EEF3EF',
            surface:           '#F8FAF6',
            'surface-bright':  '#FFFFFF',
            'surface-light':   '#E3EBE6',
            'surface-variant': '#D8E3DD',
            primary:   '#0B7065',
            secondary: '#4A5F91',
            success:   '#0B7065',
            error:     '#B33B36',
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
