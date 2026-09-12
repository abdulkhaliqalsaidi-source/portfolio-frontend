<template>
  <span ref="el">0{{ suffix }}</span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  end: { type: Number, required: true },
  suffix: { type: String, default: '' }
})

const el = ref(null)

onMounted(() => {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: props.end,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el.value,
      start: 'top 85%',
      once: true
    },
    onUpdate() {
      el.value.textContent = Math.round(obj.val) + props.suffix
    }
  })
})
</script>
