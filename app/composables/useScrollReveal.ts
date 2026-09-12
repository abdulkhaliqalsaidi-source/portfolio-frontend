import { onMounted, onUnmounted, nextTick } from 'vue'

/**
 * Robust scroll reveal composable that supports async rendered content via MutationObserver
 * @param {string} selector - CSS selector for elements to animate
 * @param {object} options
 */
export function useScrollReveal(selector = '.anim, .anim-left, .anim-right', options: any = {}) {
  const { threshold = 0.05, rootMargin = '50px 0px 50px 0px' } = options
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null

  function observeElements() {
    if (!import.meta.client || !observer) return
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => {
      if (!el.classList.contains('revealed')) {
        observer?.observe(el)
      }
    })
  }

  onMounted(async () => {
    if (!import.meta.client) return
    await nextTick()

    // IntersectionObserver to add .revealed
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer?.unobserve(entry.target)
          }
        })
      }, { threshold, rootMargin })
    }

    observeElements()

    // MutationObserver to catch elements rendered after async API fetch
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        observeElements()
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    // Safety fallback: reveal all visible elements after 800ms to guarantee nothing stays invisible
    setTimeout(() => {
      if (!import.meta.client) return
      document.querySelectorAll(selector).forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('revealed')
        }
      })
    }, 600)
  })

  onUnmounted(() => {
    observer?.disconnect()
    mutationObserver?.disconnect()
  })

  return { refresh: observeElements }
}
