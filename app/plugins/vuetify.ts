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
            background:        '#0B0F19',
            surface:           '#111827',
            'surface-bright':  '#1E293B',
            'surface-light':   '#161F30',
            'surface-variant': '#0F172A',
            primary:   '#3B82F6',
            secondary: '#64748B',
            success:   '#10B981',
            error:     '#EF4444',
          }
        },
        light: {
          dark: false,
          colors: {
            background:        '#F8FAFC',
            surface:           '#FFFFFF',
            'surface-bright':  '#FFFFFF',
            'surface-light':   '#F1F5F9',
            'surface-variant': '#E2E8F0',
            primary:   '#2563EB',
            secondary: '#64748B',
            success:   '#10B981',
            error:     '#EF4444',
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
