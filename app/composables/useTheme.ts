import { ref, computed, nextTick } from 'vue'

export function useTheme() {
  const themeCookie = useCookie<'dark' | 'light'>('theme', {
    default: () => 'dark',
    watch: true,
    maxAge: 60 * 60 * 24 * 365
  })

  const isDark = computed(() => themeCookie.value === 'dark')

  // تأثير التموج الدائري المباشر (يعمل في كافة المتصفحات بدون استثناء)
  function runFallbackRipple(x: number, y: number, endRadius: number, newTheme: 'dark' | 'light') {
    if (!import.meta.client) return

    const ripple = document.createElement('div')
    ripple.className = 'theme-ripple-overlay'
    ripple.style.backgroundColor = newTheme === 'dark' ? '#0B0F19' : '#F8FAFC'
    ripple.style.clipPath = `circle(0px at ${x}px ${y}px)`
    document.body.appendChild(ripple)

    // Force reflow
    void ripple.offsetHeight

    const anim = ripple.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    )

    setTimeout(() => {
      themeCookie.value = newTheme
      document.documentElement.setAttribute('data-theme', newTheme)
      try {
        localStorage.setItem('theme', newTheme)
      } catch (e) {}
    }, 280)

    anim.onfinish = () => {
      ripple.remove()
    }
  }

  function toggle(event?: MouseEvent) {
    const newTheme = themeCookie.value === 'dark' ? 'light' : 'dark'

    // تحديد إحداثيات مركز زر الثيم المنقور بدقة متناهية
    let x = window.innerWidth - 60
    let y = 35

    if (import.meta.client) {
      const btn = (event?.currentTarget as HTMLElement) ||
                  (event?.target as HTMLElement)?.closest('.theme-toggle-btn, .mobile-theme-toggle, .mobile-theme-btn') ||
                  document.querySelector('.theme-toggle-btn')
      if (btn) {
        const rect = btn.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          x = rect.left + rect.width / 2
          y = rect.top + rect.height / 2
        }
      } else if (event?.clientX && event?.clientY) {
        x = event.clientX
        y = event.clientY
      }
    }

    const endRadius = Math.ceil(
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
    )

    const hasViewTransition =
      import.meta.client &&
      typeof (document as any).startViewTransition === 'function'

    if (hasViewTransition) {
      try {
        const transition = (document as any).startViewTransition(async () => {
          themeCookie.value = newTheme
          document.documentElement.setAttribute('data-theme', newTheme)
          try {
            localStorage.setItem('theme', newTheme)
          } catch (e) {}
          await nextTick()
        })

        transition.ready.then(() => {
          document.documentElement.animate(
            [
              { clipPath: `circle(0px at ${x}px ${y}px)` },
              { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
            ],
            {
              duration: 500,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          )
        }).catch(() => {
          runFallbackRipple(x, y, endRadius, newTheme)
        })
        return
      } catch (err) {
        runFallbackRipple(x, y, endRadius, newTheme)
        return
      }
    }

    // للمتصفحات التي لا تدعم View Transitions API (مثل فايرفوكس)
    if (import.meta.client) {
      runFallbackRipple(x, y, endRadius, newTheme)
    } else {
      themeCookie.value = newTheme
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
