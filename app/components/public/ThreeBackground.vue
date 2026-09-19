<template>
  <canvas ref="canvas" class="three-bg" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useTheme } from '~/composables/useTheme'

const canvas = ref(null)
const { isDark } = useTheme()
let renderer, scene, camera, points, mat, animId
let mouseX = 0, mouseY = 0

onMounted(() => {
  if (!import.meta.client) return
  const el = canvas.value
  const W = window.innerWidth
  const H = window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000)
  camera.position.z = 120

  renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Subtle architectural constellation (Calm, non-distracting)
  const count = 120
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 260
    pos[i * 3 + 1] = (Math.random() - 0.5) * 260
    pos[i * 3 + 2] = (Math.random() - 0.5) * 180
    sizes[i] = Math.random() * 0.8 + 0.3
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  mat = new THREE.PointsMaterial({
    size: 0.5,
    color: 0x64748B,
    transparent: true,
    opacity: isDark.value ? 0.2 : 0.08,
    sizeAttenuation: true,
    depthWrite: false
  })

  points = new THREE.Points(geo, mat)
  scene.add(points)

  // Mouse
  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.1
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true })

  // Resize
  const onResize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize, { passive: true })

  // Animate (Slow, elegant drift)
  const clock = new THREE.Clock()
  const animate = () => {
    animId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()
    points.rotation.y = t * 0.005 + mouseX * 0.1
    points.rotation.x = t * 0.003 + mouseY * 0.08
    renderer.render(scene, camera)
  }
  animate()

  watch(isDark, (val) => {
    if (mat) {
      mat.opacity = val ? 0.2 : 0.08
    }
  })

  el._cleanup = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  canvas.value?._cleanup?.()
})
</script>

<style scoped>
.three-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
