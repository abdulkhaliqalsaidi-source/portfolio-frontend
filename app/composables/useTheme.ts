import { computed, nextTick } from 'vue'

export function useTheme() {
  const themeCookie = useCookie<'dark' | 'light'>('theme', {
    default: () => 'dark',
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  })

  // Nuxt scopes useState to the current app/request, avoiding SSR state leaks
  // and keeping the server-rendered theme aligned with the persisted cookie.
  const currentTheme = useState<'dark' | 'light'>(
    'portfolio-theme',
    () => themeCookie.value === 'light' ? 'light' : 'dark'
  )

  const isDark = computed(() => currentTheme.value === 'dark')

  function applyTheme(newTheme: 'dark' | 'light') {
    currentTheme.value = newTheme
    themeCookie.value = newTheme

    if (import.meta.client) {
      // Update the root attribute and Vuetify immediately on theme changes.
      document.documentElement.setAttribute('data-theme', newTheme)

      try {
        const nuxtApp = useNuxtApp()
        if (nuxtApp?.$vuetify?.theme) {
          nuxtApp.$vuetify.theme.global.name.value = newTheme
        }
      } catch (e) {}
    }
  }

  function revealThemeSnapshot(
    previousTheme: 'dark' | 'light',
    x: number,
    y: number,
    radius: number,
    onFinish: () => void
  ) {
    const snapshot = document.createElement('div')
    snapshot.className = 'theme-transition-snapshot'
    snapshot.setAttribute('aria-hidden', 'true')
    snapshot.style.backgroundColor = previousTheme === 'dark' ? '#0B1518' : '#EEF3EF'

    document.body.append(snapshot)
    try {
      const animation = snapshot.animate([
        { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
        { clipPath: `circle(0px at ${x}px ${y}px)` }
      ], {
        duration: 220,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      })

      const finish = () => {
        snapshot.remove()
        onFinish()
      }
      void animation.finished.then(finish, finish)
    } catch {
      snapshot.remove()
      return false
    }

    return true
  }

  function toggle(event?: MouseEvent) {
    const nextTheme = currentTheme.value === 'dark' ? 'light' : 'dark'

    if (import.meta.client && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const root = document.documentElement
      const previousTheme = currentTheme.value
      const button = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null
      const bounds = button?.getBoundingClientRect()
      const x = bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2
      const y = bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2
      const radius = Math.ceil(Math.max(
        Math.hypot(x, y),
        Math.hypot(window.innerWidth - x, y),
        Math.hypot(x, window.innerHeight - y),
        Math.hypot(window.innerWidth - x, window.innerHeight - y)
      ))

      let transitionFinished = false
      const finishThemeTransition = () => {
        if (transitionFinished) return
        transitionFinished = true
        root.classList.remove('theme-switching')
        root.style.removeProperty('--theme-origin-x')
        root.style.removeProperty('--theme-origin-y')
        root.style.removeProperty('--theme-reveal-radius')
      }

      root.classList.add('theme-switching')
      root.style.setProperty('--theme-origin-x', `${x}px`)
      root.style.setProperty('--theme-origin-y', `${y}px`)
      root.style.setProperty('--theme-reveal-radius', `${radius}px`)

      const transitionDocument = document as Document & {
        startViewTransition?: (updateCallback: () => void | Promise<void>) => { finished: Promise<void> }
      }

      try {
        const transition = transitionDocument.startViewTransition?.(async () => {
          applyTheme(nextTheme)
          await nextTick()
        })
        if (transition) {
          void transition.finished.then(finishThemeTransition, finishThemeTransition)
          return
        }
      } catch {
        // Fall back to an immediate theme change if view transitions are unavailable.
      }

      let hasSnapshot = false
      try {
        hasSnapshot = revealThemeSnapshot(previousTheme, x, y, radius, finishThemeTransition)
      } catch {
        // Keep the theme toggle working even if a browser cannot create the snapshot.
      }
      applyTheme(nextTheme)
      if (!hasSnapshot) finishThemeTransition()
      return
    }

    applyTheme(nextTheme)
  }

  function init() {
    if (import.meta.client) {
      applyTheme(themeCookie.value === 'light' ? 'light' : 'dark')
    }
  }

  return {
    isDark,
    theme: currentTheme,
    toggle,
    init,
    applyTheme
  }
}
