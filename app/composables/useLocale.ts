import { computed, watch } from 'vue'
import ar from '~/locales/ar'
import en from '~/locales/en'

type LocaleType = 'ar' | 'en'

const dictionaries: Record<LocaleType, any> = { ar, en }

export function useLocale() {
  const localeCookie = useCookie<LocaleType>('portfolio_locale', {
    default: () => 'ar',
    maxAge: 60 * 60 * 24 * 365,
    path: '/'
  })

  const locale = computed({
    get: () => localeCookie.value || 'ar',
    set: (val: LocaleType) => {
      localeCookie.value = val
      applyHtmlAttrs(val)
    }
  })

  const isRtl = computed(() => locale.value === 'ar')
  const dir = computed(() => isRtl.value ? 'rtl' : 'ltr')

  function applyHtmlAttrs(loc: LocaleType) {
    if (import.meta.client) {
      document.documentElement.setAttribute('lang', loc)
      document.documentElement.setAttribute('dir', loc === 'ar' ? 'rtl' : 'ltr')
    }
  }

  if (import.meta.client) {
    watch(locale, (newVal) => {
      applyHtmlAttrs(newVal)
    }, { immediate: true })
  }

  function toggleLocale() {
    locale.value = locale.value === 'ar' ? 'en' : 'ar'
  }

  function setLocale(newLocale: LocaleType) {
    if (newLocale === 'ar' || newLocale === 'en') {
      locale.value = newLocale
    }
  }

  function t(key: string, fallback = ''): string {
    const dict = dictionaries[locale.value] || dictionaries.ar
    const keys = key.split('.')
    let current: any = dict

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        // Fallback to Arabic if missing in English
        let fallbackDict: any = dictionaries.ar
        for (const fk of keys) {
          if (fallbackDict && typeof fallbackDict === 'object' && fk in fallbackDict) {
            fallbackDict = fallbackDict[fk]
          } else {
            return fallback || key
          }
        }
        return typeof fallbackDict === 'string' ? fallbackDict : fallback || key
      }
    }

    return typeof current === 'string' ? current : fallback || key
  }

  return {
    locale,
    isRtl,
    dir,
    toggleLocale,
    setLocale,
    t
  }
}
