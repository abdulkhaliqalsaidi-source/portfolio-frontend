import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Reveal elements on scroll with GSAP ScrollTrigger
 * @param {string} selector - CSS selector for elements to animate
 * @param {object} options  - GSAP from() options
 */
export function useReveal(selector: string, options: any = {}) {
  let ctx: any

  onMounted(() => {
    if (!import.meta.client) return
    ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((el: any, i: number) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.08,
          ...options,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          }
        })
      })
    })
  })

  onUnmounted(() => {
    if (ctx) ctx.revert()
  })
}

/**
 * Stagger children of a container
 */
export function useStagger(containerSelector: string, childSelector: string = '*', fromVars: any = {}) {
  let ctx: any

  onMounted(() => {
    if (!import.meta.client) return
    ctx = gsap.context(() => {
      gsap.utils.toArray(containerSelector).forEach((container: any) => {
        const children = container.querySelectorAll(childSelector)
        gsap.from(children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.07,
          ...fromVars,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            once: true,
          }
        })
      })
    })
  })

  onUnmounted(() => {
    if (ctx) ctx.revert()
  })
}
