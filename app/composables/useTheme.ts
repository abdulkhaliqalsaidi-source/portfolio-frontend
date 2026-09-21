import { ref, computed, nextTick } from 'vue'

export function useTheme() {
  const themeCookie = useCookie<'dark' | 'light'>('theme', {
    default: () => 'dark',
    watch: true,
    maxAge: 60 * 60 * 24 * 365
  })

  const isDark = computed(() => themeCookie.value === 'dark')

  function toggle(event?: MouseEvent) {
    const newTheme = themeCookie.value === 'dark' ? 'light' : 'dark'

    // التحقق من دعم المتصفح لـ View Transitions API وعدم تفضيل تقليل الحركة
    const isAppearanceTransition =
      import.meta.client &&
      typeof (document as any).startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition) {
      if (import.meta.client) {
        document.documentElement.classList.add('theme-transition')
        themeCookie.value = newTheme
        document.documentElement.setAttribute('data-theme', newTheme)
        try {
          localStorage.setItem('theme', newTheme)
        } catch (e) {}
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition')
        }, 480)
      } else {
        themeCookie.value = newTheme
      }
      return
    }

    // إحداثيات مركز التموج الدائري (من موضع الزر المنقور أو مركز الشاشة)
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = (document as any).startViewTransition(async () => {
      themeCookie.value = newTheme
      document.documentElement.setAttribute('data-theme', newTheme)
      try {
        localStorage.setItem('theme', newTheme)
      } catch (e) {}
      await nextTick()
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]
      document.documentElement.animate(
        {
          clipPath
        },
        {
          duration: 480,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
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
