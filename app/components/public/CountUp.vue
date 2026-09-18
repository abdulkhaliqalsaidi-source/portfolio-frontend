<template>
  <span ref="el">{{ displayValue }}</span>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  end: { type: [Number, String], required: true, default: 0 },
  suffix: { type: String, default: '' }
})

const el = ref(null)
const targetNum = computed(() => {
  const n = Number(props.end)
  return isNaN(n) ? 0 : n
})
const displayValue = ref(`${targetNum.value}${props.suffix || ''}`)

function animateCount() {
  if (!el.value) return
  const obj = { val: 0 }
  gsap.to(obj, {
    val: targetNum.value,
    duration: 1.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el.value,
      start: 'top 90%',
      once: true
    },
    onUpdate() {
      displayValue.value = Math.round(obj.val) + (props.suffix || '')
    }
  })
}

onMounted(() => {
  animateCount()
})

watch(() => props.end, () => {
  animateCount()
})
</script>

