import { ref } from 'vue'

export function useTheme() {
  const themeCookie = useCookie<'dark' | 'light'>('theme', {
    default: () => 'dark',
    watch: true,
    maxAge: 60 * 60 * 24 * 365
  })

  const isDark = computed(() => themeCookie.value === 'dark')

  function toggle() {
    themeCookie.value = themeCookie.value === 'dark' ? 'light' : 'dark'
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', themeCookie.value)
      try {
        localStorage.setItem('theme', themeCookie.value)
      } catch (e) {}
    }
  }

  function init() {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
      if (saved && saved !== themeCookie.value) {
        themeCookie.value = saved
      }
      document.documentElement.setAttribute('data-theme', themeCookie.value)
    }
  }

  return {
    isDark,
    theme: themeCookie,
    toggle,
    init
  }
}
